import { account, database } from "@/appwrite/appwrite";
import {
  DATABASE_ID,
  FAVORITE_COLLECTION,
  SONG_COLLECTION,
} from "@/appwrite/appwrite";
import { Song } from "@/types/music";

import { ID, Query } from "appwrite";

export async function setIsNotFavorite(
  songId: string,
  userId: string,
  songMetadata: Song
) {
  try {
    // First check if this song is already a favorite
    const favorites = await database.listDocuments(
      DATABASE_ID,
      FAVORITE_COLLECTION,
      [Query.equal("userId", userId), Query.equal("songId", songId)]
    );

    if (favorites.documents.length > 0) {

      // Song is already a favorite - remove it
      const favoriteId = favorites.documents[0].$id;
      await database.deleteDocument(
        DATABASE_ID,
        FAVORITE_COLLECTION,
        favoriteId
      );

      return {
        success: true,
        isFavorite: false,
        message: "Removed from favorites",
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      message: error.message || "An error occurred",
      error,
    };
  }
}

export async function setIsFavorite(userId: string, songId: string) {
  const favorites: string[] = JSON.parse(localStorage.getItem("favorites"));
  let songExists = favorites.includes(songId);

  if (songExists) {
    return {
      success: false,
      isFavorite: true,
      message: "Song is already liked",
    };
  }

  // Add the favorite relationship
  await database.createDocument(DATABASE_ID, FAVORITE_COLLECTION, ID.unique(), {
    userId,
    songId,
  });

  return {
    success: true,
    isFavorite: true,
    message: "Added to favorites",
  };
}

export async function getUserFavoriteSongs(userId: string) {
  try {
    // First get all the user's favorites from the favorites collection
    const favorites = await database.listDocuments(
      DATABASE_ID,
      FAVORITE_COLLECTION,
      [Query.equal("userId", userId)]
    );

    if (favorites.total === 0) {
      return {
        success: true,
        songs: [],
        message: "No favorite songs found",
      };
    }

    // Extract the song IDs from the favorites
    const songIds: string[] = favorites.documents.map((doc) => doc.songId);



    return {
      success: true,
      songs: songIds,
      message: "Found",
    };
  } catch (error) {
    return {
      success: false,
      songs: [],
      message: error.message || "An error occurred fetching favorite songs",
      error,
    };
  }
}
