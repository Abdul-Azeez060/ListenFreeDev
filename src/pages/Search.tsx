import { useEffect, useState } from "react";
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

  useEffect(() => {
    // call the fetchSongs function and pass the songQuery as an argument
    const fetchSearchSongs = async () => {
      setIsLoading(true);
      const songs = await fetchSongs(songQuery, category);
      setIsLoading(false);
      setSearchSongsResult(songs);
    };

    fetchSearchSongs();
  }, [songQuery, category]);
  const categories = ["songs", "albums", "playlists", "artists"];
  console.log("this is the songs");

  return (
    <div className=" h-screen bg-black scrollbar-hide overflow-auto  py-6 space-y-6">
      <div className="relative px-2">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted ml-2" />
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          className="w-full pl-10   pr-4 py-3 rounded-full bg-secondary text-primary-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={songQuery}
          onChange={(e) => {
            songQuerySearched = e.target.value;
            setSongsQuery(e.target.value);
          }}
        />
      </div>

      <div className="flex items-center mx-auto">
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
          className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-300 px-4">
            Search Results
          </h2>
          <div className="grid gap-4">
            {isLoading && (category === "songs" || category === "artists") ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center space-x-4 p-2">
                    <div className="w-12 h-12 bg-secondary rounded-md" />
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-secondary rounded" />
                      <div className="h-3 w-32 bg-secondary rounded" />
                    </div>
                  </div>
                ))
            ) : category === "songs" ? (
              <SongsResult />
            ) : category === "albums" ? (
              <AlbumResult isLoading={isLoading} />
            ) : category === "artists" ? (
              <ArtistResult />
            ) : category === "playlists" ? (
              <PlaylistResult />
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
