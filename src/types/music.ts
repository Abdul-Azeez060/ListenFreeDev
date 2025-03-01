export interface Song {
  id: string;
  name: string;
  url: string;
  duration: string;
  image: object;
  primaryArtists: string[];
  album: {
    id: string;
    name: string;
    url: string;
  };
  downloadUrl?: object;
  artists: {
    primary: PrimaryArtist[];
  };
  isFavorite?: boolean;
}

export interface PrimaryArtist {
  id: string;
  name: string;
  url: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
  image: object;
  language?: string;
  songCount: number;
  url?: string;
}

export interface Album {
  id: string;
  name: string;
  songs: Song[];
  image: object;
  artists: {
    primary: PrimaryArtist[];
  };
  language?: string;
  year: string;
  url?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: object;
  songs: Song[];
  albums: Album[];
  url: string;
}
