const BASE_URL = "https://saavn.dev/api";

export const fetchSongs = async (query: string, category: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/${category}?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }

    const data = await response.json();
    // The API returns data in a nested structure
    console.log(data, "this is the response");

    return data.data.results || [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const fetchArtists = async () => {
  const response = await fetch(`${BASE_URL}/artists`);
  return response.json();
};

export const fetchAlbums = async () => {
  const response = await fetch(`${BASE_URL}/albums`);
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
