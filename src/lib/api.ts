const BASE_URL = "https://jiosaavn-api.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL = "https://jiosaavn-api-new-theta.vercel.app/api";
const BASE_URL2 = "https://jiosaavn-api2.abdulazeezmd060.workers.dev/api";
const BASE_URL_VERCEL2 = "https://jiosaavn-api-5g8q.vercel.app/api";
const BASE_URL_OTHER = "https://jiosavan-api2.vercel.app/api";

export const fetchSongs = async (query: string, category: string) => {
  try {
    let response = await fetch(
      `${BASE_URL_VERCEL2}/search/${category}?limit=15&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      response = await fetch(
        `${BASE_URL}/search/${category}?limit=15&query=${encodeURIComponent(
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
    `${BASE_URL}/playlists?id=${id}&link=${link}&limit=50`
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
    let response = await fetch(
      `${BASE_URL_VERCEL}/songs/${songId}/suggestions?id=${songId}&limit=15`
    );

    console.log(response, "this is form fetchsongs suggestoins");
    if (!response.ok) {
      response = await fetch(
        `${BASE_URL_VERCEL2}/songs/${songId}/suggestions?id=${songId}&limit=15`
      );
    }

    if (!response.ok) {
      response = await fetch(
        `${BASE_URL_OTHER}/songs/${songId}/suggestions?id=${songId}&limit=15`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching song lyrics", error);
    return null;
  }
};

// fetchSongsByIds.ts
export const fetchSongsByIds = async (songIds: string[]) => {
  const BATCH_SIZE = 10;
  const songs: any[] = [];

  const fetchBatch = async (ids: string[], baseUrl: string) => {
    const batchPromises = ids.map((songId) =>
      fetch(`${baseUrl}/songs/${songId}`)
        .then((res) => res.json())
        .catch(() => null)
    );
    const results = await Promise.all(batchPromises);
    return results;
  };

  for (let i = 0; i < songIds.length; i += BATCH_SIZE) {
    const batchIds = songIds.slice(i, i + BATCH_SIZE);
    let results = await fetchBatch(batchIds, BASE_URL_VERCEL2);
    if (results.every((song) => song === null || !song?.data?.length)) {
      results = await fetchBatch(batchIds, BASE_URL);
    }

    const validSongs = results
      .map((song) => (song?.data?.length ? song.data[0] : null))
      .filter(Boolean);

    songs.push(...validSongs);
  }

  return songs;
};

export const fetchSongBatch = async (
  allSongIds: string[],
  batchNumber: number,
  batchSize: number = 10
) => {
  const start = batchNumber * batchSize;
  const end = start + batchSize;
  const batchIds = allSongIds.slice(start, end);

  const fetchBatch = async (ids: string[], baseUrl: string) => {
    const batchPromises = ids.map((songId) =>
      fetch(`${baseUrl}/songs/${songId}`)
        .then((res) => res.json())
        .catch(() => null)
    );
    return await Promise.all(batchPromises);
  };

  let results = await fetchBatch(batchIds, BASE_URL_VERCEL2);
  if (results.every((r) => r === null || !r?.data?.length)) {
    results = await fetchBatch(batchIds, BASE_URL);
  }

  const songs = results
    .map((song) => (song?.data?.length ? song.data[0] : null))
    .filter(Boolean);

  return songs;
};
