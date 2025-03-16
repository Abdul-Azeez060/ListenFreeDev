const BASE_URL = "https://jiosaavn-api.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL = "https://backend-music-blush.vercel.app/api";
const BASE_URL2 = "https://jiosaavn-api2.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL2 = "https://backend-music1212.vercel.app/api";

export const fetchSongs = async (query: string, category: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/${category}?limit=15&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }

    const data = await response.json();
    // The API returns data in a nested structure
    // console.log(data, "this is the response");

    return data.data.results || [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const fetchArtistSongs = async (id: string) => {
  const response = await fetch(`${BASE_URL}/artists/${id}`);
  return response.json();
};

export const fetchPlaylistSongs = async (id: string, link: string) => {
  const response = await fetch(
    `${BASE_URL2}/playlists?id=${id}&link=${link}&limit=50`
  );
  return response.json();
};

export const fetchAlbumSongs = async (id: string, link: string) => {
  const response = await fetch(
    `${BASE_URL_VERCEL}/albums?id=${id}&link=${link}`
  );
  return response.json();
};

export const fetchSongDetails = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL2}/songs?id=${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch song details");
    }
    const data = await response.json();
    // console.log(data.data[0], "this is the player api");
    return data.data[0] || null;
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
};

export const fetchSongLyrics = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/songs/${id}/lyrics`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching song lyrics", error);
    return null;
  }
};

export const fetchSongSuggestions = async (songId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL_VERCEL}/songs/${songId}/suggestions?id=${songId}&limit=15`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching song lyrics", error);
    return null;
  }
};

export const fetchSongsByIds = async (songIds: string[]) => {
  try {
    // Create an array of fetch promises
    const fetchPromises = songIds.map((songId) =>
      fetch(`${BASE_URL2}/songs/${songId}`).then((res) => res.json())
    );

    // console.log(fetchPromises, "this is fetch promises");

    // Wait for all requests to complete in parallel
    let songs = await Promise.all(fetchPromises);
    songs = songs.map((song) => song.data[0]);
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return []; // Return empty array in case of an error
  }
};
