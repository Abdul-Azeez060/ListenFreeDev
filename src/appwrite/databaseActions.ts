import { account, database } from "@/appwrite/appwrite";
import {
  DATABASE_ID,
  FAVORITE_COLLECTION,
  SONG_COLLECTION,
  PLAYLIST_METADATA_COLLECTION,
  PLAYLIST_SONGS_COLLECTION,
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
    // console.log(error.message);
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
      [
        Query.equal("userId", userId), // Filter documents where userId matches
        Query.limit(100), // Limit the number of results to 100
      ]
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

export async function getUserPlaylistMetadata(userId: string) {
  try {
    const playlists = await database.listDocuments(
      DATABASE_ID,
      PLAYLIST_METADATA_COLLECTION,
      [Query.equal("userId", userId)]
    );

    // console.log(playlists, "these are playlists");

    return {
      success: true,
      playlists: playlists,
      message: "Found",
    };
  } catch (error) {
    return {
      success: false,
      playlists: [],
      message: error.message || "An error occurred fetching playlists",
      error,
    };
  }
}

export async function createPlaylist(playlistName: string, userId: string) {
  // console.log(PLAYLIST_METADATA_COLLECTION, "this is playlist collection");
  try {
    const playlist = await database.createDocument(
      DATABASE_ID,
      PLAYLIST_METADATA_COLLECTION,
      ID.unique(),
      {
        userId,
        name: playlistName,
      }
    );

    // console.log(playlist, "this isthe new playlist created");
    return {
      success: true,
      message: "successfull created playlist",
      playlist,
    };
  } catch (error) {
    // console.log(error, "this is error");
    return {
      sucess: false,
      message: error.message || "An error occured creating a playlist",
      error,
    };
  }
}

export async function addSongToPlaylist(songId: string, playlistId: string) {
  // console.log(songId, playlistId, "this is song id ");
  try {
    const res = await database.createDocument(
      DATABASE_ID,
      PLAYLIST_SONGS_COLLECTION,
      ID.unique(),
      {
        playlistId,
        songId,
      }
    );
    return {
      success: true,
      message: "Added song to playlist",
      playlistId,
    };
  } catch (error) {
    return {
      success: false,
      message: error || "An error occured adding song to playlist",
      error,
    };
  }
}

export async function fetchUserPlaylstSongs(playlistIds: any[]) {
  // console.log(playlistIds, "these are in fetch ");
  playlistIds = playlistIds.map((playlistIds) => playlistIds.$id);
  // Helper function to batch the playlist IDs
  const batchSize = 10; // You can adjust the batch size based on your use case
  const batchFetch = async (batch: any[]) => {
    try {
      const res = await database.listDocuments(
        DATABASE_ID,
        PLAYLIST_SONGS_COLLECTION,
        [Query.equal("playlistId", batch)]
      );
      return res; // Return the fetched songs for the batch
    } catch (error) {
      throw new Error(
        "Error fetching batch of playlist songs: " + error.message
      );
    }
  };

  try {
    // Split the playlistIds into smaller batches
    const batches = [];
    for (let i = 0; i < playlistIds.length; i += batchSize) {
      batches.push(playlistIds.slice(i, i + batchSize));
    }

    // console.log(batches, "these are batches");

    // Fetch all batches in parallel
    const batchResults = await Promise.all(batches.map(batchFetch));

    // Flatten the results from each batch into a single array of songs
    const allSongs = batchResults.flat();
    // console.log(allSongs, "these are all the songs");
    return {
      success: true,
      message: "Successfully fetched the songs",
      songs: allSongs,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred fetching playlist songs",
      error,
    };
  }
}

export async function deletePlaylist(playlistId: string) {
  try {
    // Step 1: Delete the playlist metadata document
    await database.deleteDocument(
      DATABASE_ID,
      PLAYLIST_METADATA_COLLECTION,
      playlistId
    );

    // Step 2: Get all songs associated with the playlistId
    const result = await database.listDocuments(
      DATABASE_ID,
      PLAYLIST_SONGS_COLLECTION,
      [Query.equal("playlistId", playlistId)]
    );

    // Step 3: Delete all documents in PLAYLIST_SONGS_COLLECTION that belong to the playlist
    const deletePromises = result.documents.map((doc) =>
      database.deleteDocument(DATABASE_ID, PLAYLIST_SONGS_COLLECTION, doc.$id)
    );

    await Promise.all(deletePromises); // Execute all deletions in parallel

    console.log("Playlist and all associated songs deleted successfully!");
    return {
      success: true,
      message: "Deleted Successfull",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "couldn't delete",
      data: error,
    };
  }
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
) {
  //remove the songId from playlist
  try {
    const response = await database.listDocuments(
      DATABASE_ID,
      PLAYLIST_SONGS_COLLECTION,
      [
        Query.equal("songId", songId) && Query.equal("playlistId", playlistId), // Replace with actual songId
      ]
    );

    console.log(response, "this is the document to be delted");

    // Step 2: Check if the document exists
    if (response.total > 0) {
      const documentId = response.documents[0].$id; // Get document ID

      // Step 3: Delete the document
      const res = await database.deleteDocument(
        DATABASE_ID,
        PLAYLIST_SONGS_COLLECTION,
        documentId
      );
      console.log("Document deleted successfully!");
    }
    return {
      success: true,
      message: "successfully deleted",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "couldn't delete",
      data: error,
    };
  }
}
