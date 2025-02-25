import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";
import { Song } from "@/types/music";

interface SongsContextProps {
  songs: Song[];
  addSong: (newSong: Song) => void;
  currentSongId: string;
  setCurrentSongId: (id: string) => void;
}

const SongsContext = createContext<SongsContextProps | undefined>(undefined);

// 🎵 SongsProvider component
export const SongsProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string>();
  const addSong = (newSong: Song) => {
    setSongs((prevSongs) => [...prevSongs, newSong]);
  };

  return (
    <SongsContext.Provider
      value={{ songs, addSong, currentSongId, setCurrentSongId }}>
      {children}
    </SongsContext.Provider>
  );
};

// 🎧 Custom Hook to retrieve all songs
export const useSongs = (): SongsContextProps => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
};
