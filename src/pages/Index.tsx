
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, Clock, PlayCircle } from "lucide-react";
import { fetchSongs } from "@/lib/api";

const Index = () => {
  const { data: recentSongs } = useQuery({
    queryKey: ['recentSongs'],
    queryFn: () => fetchSongs('latest'),
  });

  return (
    <div className="container px-4 py-6 space-y-8">
      <motion.h1 
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Welcome Back
      </motion.h1>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Plays</h2>
          <Clock className="text-gray-500" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {recentSongs?.data?.slice(0, 4).map((song: any) => (
            <motion.div
              key={song.id}
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={song.image}
                  alt={song.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium truncate">{song.name}</h3>
              <p className="text-xs text-gray-500 truncate">
                {song.primaryArtists.join(", ")}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Favorites</h2>
          <Heart className="text-accent" />
        </div>
        {/* Similar grid for favorite songs */}
      </section>
    </div>
  );
};

export default Index;
