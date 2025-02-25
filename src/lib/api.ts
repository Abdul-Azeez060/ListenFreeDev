
const BASE_URL = "https://saavn.dev/api";

export const fetchSongs = async (query: string) => {
  const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
  return response.json();
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
