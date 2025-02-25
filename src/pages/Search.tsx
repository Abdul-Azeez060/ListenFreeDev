import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, PlusCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchSongs } from "@/lib/api";
import { Song } from "@/types/music";
import { useSongs } from "@/context/songsContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { addSong } = useSongs();

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSongs(query),
    enabled: query.length > 0,
  });

  console.log(songs, "these are songs");

  return (
    <div className="container min-h-screen bg-primary px-4 py-6 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          className="w-full pl-10 pr-4 py-3 rounded-full bg-secondary text-primary-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4">
          <h2 className="text-xl font-semibold text-primary-foreground">
            Search Results
          </h2>
          <div className="grid gap-4">
            {isLoading
              ? Array(4)
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
              : songs.map((song: Song) => (
                  <motion.div
                    key={song.id}
                    className="flex items-center justify-between space-x-4 p-2 hover:bg-secondary rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.01 }}>
                    <div
                      className="flex items-center "
                      onClick={() => {
                        addSong(song);
                        navigate(`/player/${song.id}`);
                      }}>
                      <img
                        src={song.image[2].url}
                        alt={song.name}
                        className="w-12 mr-3 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-primary-foreground">
                          {song.name}
                        </h3>
                        <p className="text-sm text-muted">
                          {Array.isArray(song.primaryArtists)
                            ? song.primaryArtists.join(", ")
                            : song.primaryArtists}
                        </p>
                      </div>
                    </div>
                    <div>
                      <PlusCircleIcon
                        onClick={() => {
                          addSong(song);
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
