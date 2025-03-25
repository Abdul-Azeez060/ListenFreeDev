const BASE_URL = "https://jiosaavn-api.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL = "https://backend-music-blush.vercel.app/api";
const BASE_URL2 = "https://jiosaavn-api2.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL2 = "https://backend-music1212.vercel.app/api";

export const fetchSongs = async (query: string, category: string) => {
  try {
    let response = await fetch(
      `${BASE_URL}/search/${category}?limit=15&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      response = await fetch(
        `${BASE_URL2}/search/${category}?limit=15&query=${encodeURIComponent(
          query
        )}`
      );
    }
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }

    const data = await response.json();
    // The API returns data in a nested structure
    // console.log(data, "this is the response");
    // return data.data.results || [];
    return {
      success: true,
      data: data.data.results || [],
      message: "Successfull",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
      message: error,
    };
  }
};

export const fetchArtistSongs = async (id: string) => {
  let response = await fetch(`${BASE_URL2}/artists/${id}`);
  if (!response.ok) {
    response = await fetch(`${BASE_URL_VERCEL}/artists/${id}`);
  }
  return response.json();
};

export const fetchPlaylistSongs = async (id: string, link: string) => {
  let response = await fetch(
    `${BASE_URL_VERCEL2}/playlists?id=${id}&link=${link}&limit=50`
  );

  if (!response.ok) {
    response = await fetch(
      `${BASE_URL2}/playlists?id=${id}&link=${link}&limit=50`
    );
  }
  return response.json();
};

export const fetchAlbumSongs = async (id: string, link: string) => {
  let response = await fetch(`${BASE_URL_VERCEL}/albums?id=${id}&link=${link}`);
  if (!response.ok) {
    response = await fetch(`${BASE_URL2}/albums?id=${id}&link=${link}`);
  }

  return response.json();
};

export const fetchSongDetails = async (id: string) => {
  try {
    let response = await fetch(`${BASE_URL2}/songs?id=${id}`);
    if (!response.ok) {
      response = await fetch(`${BASE_URL_VERCEL2}/songs?id=${id}`);
    }

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
    let response = await fetch(`${BASE_URL_VERCEL}/songs/${id}/lyrics`);
    if (!response.ok) {
      response = await fetch(`${BASE_URL2}/songs/${id}/lyrics`);
    }
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
    let fetchPromises = songIds.map((songId) =>
      fetch(`${BASE_URL_VERCEL2}/songs/${songId}`).then((res) => res.json())
    );

    if (fetchPromises.length < 0) {
      fetchPromises = songIds.map((songId) =>
        fetch(`${BASE_URL}/songs/${songId}`).then((res) => res.json())
      );
    }

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
