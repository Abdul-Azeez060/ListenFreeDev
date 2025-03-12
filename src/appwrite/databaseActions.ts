import { account, database } from "@/appwrite/appwrite";
import client from "@/appwrite/appwrite";
import {
  DATABASE_ID,
  FAVORITE_COLLECTION,
  SONG_COLLECTION,
} from "@/appwrite/appwrite";
import { Song } from "@/types/music";

import { ID, Query } from "appwrite";

export async function getIsFavorite(songId: string, userId: string) {
  try {
    const res = await database.listDocuments(DATABASE_ID, FAVORITE_COLLECTION, [
      Query.equal("userId", userId),
      Query.equal("songId", songId),
    ]);
    console.log(res, "this is the response");
    return {
      success: "true",
      message: res.total,
    };
  } catch (error) {
    return {
      success: "false",
      error,
    };
  }
}
export async function toggleFavorite(
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
    } else {
      // Song is not a favorite - add it
      // First, check if song exists in songs collection
      let songExists = false;
      try {
        const songDoc = await database.getDocument(
          DATABASE_ID,
          SONG_COLLECTION,
          songId
        );
        songExists = true;
      } catch (e) {
        // Song doesn't exist in our DB yet
      }

      // If song doesn't exist in DB, add it
      if (!songExists && songMetadata) {
        await database.createDocument(
          DATABASE_ID,
          SONG_COLLECTION,
          songId, // Use the same ID from your API
          {
            name: songMetadata.name.toString(),
            url: songMetadata.url,
            duration: songMetadata.duration.toString(),
            image: songMetadata.image[2].url.toString(),
            primaryArtists: songMetadata.artists.primary
              ?.map((artist) => artist.name)
              .join(", "),
            downloadurl: songMetadata.downloadUrl[4].url.toString(),
          }
        );
      }

      // Add the favorite relationship
      await database.createDocument(
        DATABASE_ID,
        FAVORITE_COLLECTION,
        ID.unique(),
        {
          userId,
          songId,
        }
      );

      return {
        success: true,
        isFavorite: true,
        message: "Added to favorites",
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
    const songIds = favorites.documents.map((doc) => doc.songId);

    // Get the complete song data for each favorite
    // We'll use Promise.all to fetch all songs in parallel
    const songsPromises = songIds.map((songId) =>
      database.getDocument(DATABASE_ID, SONG_COLLECTION, songId)
    );

    // Wait for all song data requests to complete
    let songs = [];
    try {
      songs = await Promise.all(songsPromises);
    } catch (error) {
      // If any song fetch fails, get the ones that succeeded
      // This is optional - you could just return the error
      console.error("Some songs couldn't be retrieved", error);

      // Fetch songs one by one to get the ones that exist
      songs = await Promise.all(
        songIds.map(async (songId) => {
          try {
            return await database.getDocument(
              DATABASE_ID,
              SONG_COLLECTION,
              songId
            );
          } catch (e) {
            console.warn(`Song ${songId} not found in database`);
            return null;
          }
        })
      );

      // Filter out the null values (songs that weren't found)
      songs = songs.filter((song) => song !== null);
    }

    return {
      success: true,
      songs: songs,
      message: `Found ${songs.length} favorite songs`,
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
