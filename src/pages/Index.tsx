import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, Clock, PlayCircle } from "lucide-react";
import { fetchSongs } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSongs } from "@/context/songsContext";

const Index = () => {
  // const { data: recentSongs, isLoading } = useQuery({
  //   queryKey: ['recentSongs'],
  //   queryFn: () => fetchSongs('latest'),
  // });
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const favorite = localStorage.getItem("favoriteSongs");
    const songs = favorite ? JSON.parse(favorite) : [];
    setFavoriteSongs(songs);

    const recentSongs = localStorage.getItem("recentSongs");
    const recent = recentSongs ? JSON.parse(recentSongs) : [];
    setRecentSongs(recent);

    setIsLoading(false);
  }, []);

  const { currentSongId, setCurrentSongId, setSongs } = useSongs();
  // const songs = recentSongs?.data ? Array.isArray(recentSongs.data) ? recentSongs.data : [] : [];

  return (
    <div className=" py-6 space-y-8 bg-black mb-10 ">
      <motion.h1
        className="text-4xl font-bold text-white px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        Welcome Back
      </motion.h1>

      <section className="space-y-4 w-screen">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white px-4">
            Recent Plays
          </h2>
          <Clock className="text-muted mr-2" />
        </div>
        <div className="overflow-x-auto scrollbar-hide ">
          <div className="grid grid-flow-col  auto-cols-max w-screen">
            {!isLoading &&
              recentSongs?.map((song: any) => (
                <motion.div
                  key={song?.id}
                  className="relative flex flex-col  items-center group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setCurrentSongId(song.id);
                    recentSongs.unshift(
                      recentSongs.splice(recentSongs.indexOf(song), 1)[0]
                    );
                    setRecentSongs(recentSongs);

                    setSongs(recentSongs);
                  }}>
                  <div className=" aspect-square rounded-lg overflow-x-auto size-36 md:size-60 mx-2  ">
                    <img
                      src={song?.image[2].url}
                      alt={song?.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium w-[9rem] md:w-[15rem] text-center truncate text-white">
                    {song?.name}
                  </h3>
                  <p className="text-xs text-muted truncate">
                    {Array.isArray(song?.primaryArtists)
                      ? song?.primaryArtists.join(", ")
                      : song?.primaryArtists}
                  </p>
                </motion.div>
              ))}
            {isLoading &&
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-secondary rounded-lg"></div>
                    <div className="mt-2 h-4 bg-secondary rounded w-3/4"></div>
                    <div className="mt-1 h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white px-4">Favorites</h2>
          <Heart className="text-accent mr-2" />
        </div>
        <div className="overflow-x-auto scrollbar-hide ">
          <div className="grid grid-flow-col  auto-cols-max w-screen">
            {!isLoading &&
              favoriteSongs?.map((song: any) => (
                <motion.div
                  key={song?.id}
                  className="relative flex flex-col  items-center group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setCurrentSongId(song.id);
                    favoriteSongs.unshift(
                      favoriteSongs.splice(recentSongs.indexOf(song), 1)[0]
                    );
                    setFavoriteSongs(recentSongs);

                    setSongs(recentSongs);
                  }}>
                  <div className=" aspect-square rounded-lg overflow-x-auto size-36 md:size-60 mx-2  ">
                    <img
                      src={song?.image[2].url}
                      alt={song?.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate w-[9rem] md:w-[15rem]   text-center text-white">
                    {song?.name}
                  </h3>
                  <p className="text-xs text-muted truncate">
                    {Array.isArray(song?.primaryArtists)
                      ? song?.primaryArtists.join(", ")
                      : song?.primaryArtists}
                  </p>
                </motion.div>
              ))}
            {isLoading &&
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-secondary rounded-lg"></div>
                    <div className="mt-2 h-4 bg-secondary rounded w-3/4"></div>
                    <div className="mt-1 h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
