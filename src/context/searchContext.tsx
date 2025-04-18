import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";
import { Song } from "@/types/music";

interface SearchSongsProps {
  searchSongsResult: any[];
  songQuery: string;
  setSearchSongsResult: (songs: Song[]) => void;
  setSongsQuery: (query: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
  url: string;
  setUrl: (url: string) => void;
  detailSongs: DetailSongs;
  setDetailSongs: (detailsSongs: any) => void;
}
type Category = "songs" | "albums" | "artists" | "playlists" | "userPlaylists";
export interface DetailSongs {
  songs: Song[];
  id: string;
  name?: string;
  image: object | string;
  description?: string;
  topAlbums?: Array<object>;
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
  const [searchSongsResult, setSearchSongsResult] = useState([]);
  const [songQuery, setSongsQuery] = useState<string>("");
  const [detailSongs, setDetailSongs] = useState<DetailSongs>();
  const [category, setCategory] = useState<Category>("songs");
  const [url, setUrl] = useState<string>("");

  return (
    <SearchSongsContext.Provider
      value={{
        url,
        setUrl,
        searchSongsResult,
        setSearchSongsResult,
        setSongsQuery,
        songQuery,
        category,
        setCategory,
        detailSongs,
        setDetailSongs,
      }}>
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
