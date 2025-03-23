import { useCurrentUserData } from "@/context/userContext";
import { useEffect, useState } from "react";
import { fetchSongsByIds } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Heart, PlayCircle } from "lucide-react";
import LazyImage from "../LazyImage";
import SongLoader from "../Loaders/HomeSongLoader";
import { useSongs } from "@/context/songsContext";
import he from "he";
function Favorites() {
  const { user, favoriteSongIds, setFavoriteSongs, favoriteSongs } =
    useCurrentUserData();
  const { setCurrentSongId, setSongs } = useSongs();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoriteSongs();
  }, [user, favoriteSongIds]);

  async function loadFavoriteSongs() {
    try {
      if (user) {
        setIsLoading(true);
        if (favoriteSongIds) {
          const result = await fetchSongsByIds(favoriteSongIds);
          // console.log(result);
          setFavoriteSongs(result.reverse());
        } else {
          setFavoriteSongs([]);
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Failed to load favorite songs");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="my-6    ">
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white px-4 mb-4">
            Favorites
          </h2>
          <Heart className="text-accent mr-2" />
        </div>
        <div className="overflow-x-auto scrollbar-hide ">
          <div className="grid grid-flow-col gap-4 auto-cols-max w-screen">
            {isLoading
              ? [...Array(6)].map((_, index) => <SongLoader key={index} />)
              : favoriteSongs?.map((song: any) => (
                  <motion.div
                    key={song?.id}
                    className="relative flex flex-col items-center group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setCurrentSongId(song.id);
                      setSongs(favoriteSongs);
                    }}>
                    <div className="aspect-square rounded-lg overflow-x-auto size-36 md:size-60 mx-2">
                      <LazyImage
                        src={song?.image[2].url}
                        alt={song?.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium truncate w-[9rem] md:w-[15rem] text-center text-white">
                      {he.decode(song?.name)}
                    </h3>
                    <p className="text-xs truncate w-[9rem] md:w-[15rem] text-center text-slate-400">
                      {song?.artists.primary
                        ?.map((artist) => artist.name)
                        .join(", ")}
                    </p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Favorites;
