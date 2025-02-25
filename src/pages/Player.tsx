
import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart,
  Volume2
} from "lucide-react";
import { fetchSongDetails } from "@/lib/api";

const Player = () => {
  const { songId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: song } = useQuery({
    queryKey: ['song', songId],
    queryFn: () => fetchSongDetails(songId!),
  });

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-accent/20 to-background backdrop-blur-lg">
      <div className="container h-full px-4 py-8 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-64 h-64 rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src={song?.image || "placeholder.jpg"}
              alt={song?.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{song?.name}</h1>
            <p className="text-gray-500">
              {song?.primaryArtists?.join(", ")}
            </p>
          </div>

          <div className="w-full max-w-md space-y-6">
            <div className="h-1 bg-gray-200 rounded-full">
              <div className="h-full w-1/3 bg-accent rounded-full" />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>1:23</span>
              <span>3:45</span>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <button className="p-2 text-gray-600 hover:text-accent">
                <SkipBack size={32} />
              </button>
              
              <button 
                className="p-4 rounded-full bg-accent text-white hover:bg-accent/90"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>

              <button className="p-2 text-gray-600 hover:text-accent">
                <SkipForward size={32} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <button
                className={`p-2 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart fill={isFavorite ? "currentColor" : "none"} />
              </button>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="text-gray-500" />
                <div className="w-24 h-1 bg-gray-200 rounded-full">
                  <div className="h-full w-2/3 bg-accent rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Player;
