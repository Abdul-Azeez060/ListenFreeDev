
import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "@/lib/api";

const Search = () => {
  const [query, setQuery] = useState("");
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSongs(query),
    enabled: query.length > 0,
  });

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="grid gap-4">
            {searchResults?.data?.map((song: any) => (
              <motion.div
                key={song.id}
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">{song.name}</h3>
                  <p className="text-sm text-gray-500">
                    {song.primaryArtists.join(", ")}
                  </p>
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
