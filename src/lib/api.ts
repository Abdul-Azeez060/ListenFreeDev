
const BASE_URL = "https://saavn.dev/api";

export const fetchSongs = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    const data = await response.json();
    // The API returns data in a nested structure, so we need to extract the results
    return data.results || [];
  } catch (error) {
    console.error('Error fetching songs:', error);
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
  const response = await fetch(`${BASE_URL}/songs?id=${id}`);
  return response.json();
};
