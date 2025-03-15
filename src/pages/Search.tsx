import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, PlusCircleIcon, PlayCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchSongs } from "@/lib/api";
import { Song } from "@/types/music";
import { useSongs } from "@/context/songsContext";
import { useSearchSongs } from "@/context/searchContext";
import { toast } from "sonner";
import SongsResult from "@/components/SongsResult";
import AlbumResult from "@/components/AlbumResult";
import ArtistResult from "@/components/ArtistResult";
import PlaylistResult from "@/components/PlaylistResult";
import debounce from "lodash.debounce";
import usePreventPullToRefresh from "@/components/PreventReload";

const Search = () => {
  const navigate = useNavigate();
  const { addSong } = useSongs();
  let songQuerySearched = "";

  const {
    searchSongsResult,
    songQuery,
    setSongsQuery,
    setSearchSongsResult,
    category,
    setCategory,
  } = useSearchSongs();
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(songQuery);

  const fetchSearchSongs = async (query: string) => {
    try {
      setIsLoading(true);
      const songs = await fetchSongs(query, category);
      setSearchSongsResult(songs);
      console.log("updated the search result");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Update search query with debounce
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      fetchSearchSongs(debouncedQuery);
    }
  }, [debouncedQuery, category]);

  // **Debounced function using useCallback**
  const debouncedSetQuery = useCallback(
    debounce((query) => {
      setDebouncedQuery(query);
    }, 500), // Adjust delay as needed
    []
  );

  usePreventPullToRefresh();
  const categories = ["songs", "albums", "playlists", "artists"];

  return (
    <div className=" h-screen bg-black overflow-y-auto scrollbar-hide   py-6 space-y-6">
      <div className="relative px-2">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white ml-2" />
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          className="w-full pl-10    pr-4 py-3 rounded-full   text-white bg-slate-800  placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={songQuery}
          onChange={(e) => {
            songQuerySearched = e.target.value;
            setSongsQuery(e.target.value);
            debouncedSetQuery(e.target.value);
          }}
        />
      </div>

      <div className="flex items-center mx-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`mx-1 p-2 rounded-2xl border ${
              category === cat
                ? "bg-white text-black border-white"
                : "border-slate-200 text-white"
            }`}
            onClick={() => setCategory(cat as any)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {songQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 overflow-hidden ">
          <h2 className="text-xl font-semibold text-slate-300 px-4">
            Search Results
          </h2>
          <div className="grid gap-4">
            {category === "songs" ? (
              <SongsResult />
            ) : category === "albums" ? (
              <AlbumResult isLoading={isLoading} />
            ) : category === "artists" ? (
              <ArtistResult />
            ) : category === "playlists" ? (
              <PlaylistResult isLoading={isLoading} />
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
