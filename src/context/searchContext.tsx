import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";
import { Song } from "@/types/music";

interface SearchSongsProps {
  searchSongsResult: Song[];
  songQuery: string;
}

const SearchSongsContext = createContext<SearchSongsProps | undefined>(
  undefined
);

// 🎵 SongsProvider component
export const SearchedSongsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchSongsResult, setSearchSongsResult] = useState<Song[]>([]);

  const [songQuery, setSongsQuery] = useState<string>();

  return (
    <SearchSongsContext.Provider value={{ searchSongsResult, songQuery }}>
      {children}
    </SearchSongsContext.Provider>
  );
};

// 🎧 Custom Hook to retrieve all songs
export const useSearchSongs = (): SearchSongsProps => {
  const context = useContext(SearchSongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
};
