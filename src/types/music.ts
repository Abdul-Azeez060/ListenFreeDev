
export interface Song {
  id: string;
  name: string;
  url: string;
  duration: string;
  image: string;
  primaryArtists: string[];
  album: {
    id: string;
    name: string;
    url: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
}

export interface Album {
  id: string;
  name: string;
  songs: Song[];
  image: string;
  primaryArtists: string[];
  year: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  songs: Song[];
  albums: Album[];
}
