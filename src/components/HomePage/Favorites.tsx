import { useCurrentUserData } from "@/context/userContext";
import { useEffect, useState } from "react";
import { fetchSongBatch } from "@/lib/api";
import { motion } from "framer-motion";
import { Heart, PlayCircle } from "lucide-react";
import LazyImage from "../LazyImage";
import SongLoader from "../Loaders/HomeSongLoader";
import { useSongs } from "@/context/songsContext";
import he from "he";
import { useInView } from "react-intersection-observer";

const BATCH_SIZE = 10;
const MEMORY_CACHE: { [key: number]: any[] } = {};

function Favorites() {
  const {
    user,
    favoriteSongIds,
    isLoading,
    setIsLoading,
    setFavoriteSongs,
    favoriteSongs,
  } = useCurrentUserData();

  const { setCurrentSongId, setSongs } = useSongs();
  const [batchNumber, setBatchNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadFromCache = (batchNum: number) => {
    const key = `fav-songs-batch-${batchNum}`;
    const fromLocal = localStorage.getItem(key);
    return fromLocal ? JSON.parse(fromLocal) : MEMORY_CACHE[batchNum] || null;
  };

  const saveToCache = (batchNum: number, data: any[]) => {
    MEMORY_CACHE[batchNum] = data;
    localStorage.setItem(`fav-songs-batch-${batchNum}`, JSON.stringify(data));
  };

  const loadNextBatch = async () => {
    if (isLoading || !hasMore || !favoriteSongIds?.length) return;

    setIsLoading(true);

    const cached = loadFromCache(batchNumber);
    if (cached) {
      setFavoriteSongs((prev) => [...(prev || []), ...cached]);
      setBatchNumber((prev) => prev + 1);
      setIsLoading(false);
      return;
    }

    const newSongs = await fetchSongBatch(
      favoriteSongIds,
      batchNumber,
      BATCH_SIZE
    );

    if (newSongs.length > 0) {
      setFavoriteSongs((prev) => [...(prev || []), ...newSongs]);
      saveToCache(batchNumber, newSongs);
      setBatchNumber((prev) => prev + 1);
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (favoriteSongs?.length === 0 && favoriteSongIds?.length) {
      loadNextBatch();
    }
  }, [favoriteSongIds]);

  useEffect(() => {
    if (inView) loadNextBatch();
  }, [inView]);

  return (
    <div className="my-6">
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#a7a6ec] px-4 mb-4">
            Favorites
          </h2>
          <Heart className="text-accent mr-2" />
        </div>
        <div className="overflow-x-auto scrollbar-hide ">
          <div className="grid grid-flow-col gap-3 auto-cols-max w-screen">
            {favoriteSongs?.map((song: any) => (
              <motion.div
                key={song?.id}
                className="relative flex flex-col items-center group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setCurrentSongId(song.id);
                  setSongs(favoriteSongs);
                }}>
                <div className="aspect-square rounded-lg overflow-x-auto size-40 md:size-60">
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

            {isLoading && [...Array(3)].map((_, i) => <SongLoader key={i} />)}

            {hasMore && !isLoading && <div ref={ref} className="h-10" />}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Favorites;
