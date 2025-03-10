const BASE_URL = "https://jiosaavn-api.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL = "https://backend-music-blush.vercel.app/api";

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
    `${BASE_URL}/playlists?id=${id}&link=${link}&limit=15`
  );
  return response.json();
};

export const fetchAlbumSongs = async (id: string, link: string) => {
  const response = await fetch(`${BASE_URL}/albums?id=${id}&link=${link}`);
  return response.json();
};

export const fetchSongDetails = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/songs?id=${id}`);
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
