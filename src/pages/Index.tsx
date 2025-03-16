import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSongs } from "@/context/songsContext";
import { useCurrentUserData } from "@/context/userContext";
import SongLoader from "@/components/Loaders/SongLoader";
import { Song } from "@/types/music";
import he from "he";
import TrendingHits from "@/components/HomePage/TrendingHits";
import TopHits from "@/components/HomePage/TopHits";
import MostSearched from "@/components/HomePage/MostSearched";
import TopCharts from "@/components/HomePage/TopCharts";
import TopCharts2 from "@/components/HomePage/TopCharts2";
import useSessionReload from "@/components/SessionReload";
import { Button } from "@/components/ui/button";

const Index = () => {
  // const { data: recentSongs, isLoading } = useQuery({
  //   queryKey: ['recentSongs'],
  //   queryFn: () => fetchSongs('latest'),
  // });

  useSessionReload();

  const [recentSongs, setRecentSongs] = useState([]);
  const { user, favoriteSongIds, favoriteSongs, setFavoriteSongs, isLoading } =
    useCurrentUserData();

  useEffect(() => {
    const recentSongs = localStorage.getItem("recentSongs");
    let recent: Song[] = recentSongs ? JSON.parse(recentSongs) : [];

    // ✅ Convert to a Map to remove duplicates (keep latest occurrence)
    const uniqueSongsMap = new Map(recent.map((song) => [song.id, song]));
    recent = Array.from(uniqueSongsMap.values());

    // ✅ Keep only the latest 30 songs
    if (recent.length > 30) {
      recent = recent.slice(-30);
    }

    // ✅ Save back to localStorage
    localStorage.setItem("recentSongs", JSON.stringify(recent));

    // ✅ Reverse for UI display
    setRecentSongs(recent.reverse());
  }, [user, favoriteSongIds]);

  const { currentSongId, setCurrentSongId, setSongs } = useSongs();

  // const songs = recentSongs?.data ? Array.isArray(recentSongs.data) ? recentSongs.data : [] : [];

  return (
    <div className=" py-6 space-y-2 bg-black mb-24">
      <div className="flex  justify-between px-2 md:px-4">
        <motion.h1
          className="text-2xl md:text-4xl my-4 font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          Welcome Back {user?.name.split(" ")[0]}
        </motion.h1>
      </div>

      {recentSongs.length > 0 && (
        <section className="space-y-4 w-screen">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white px-2 md:px-4">
              Recent Plays
            </h2>
            <Clock className="text-muted mr-2" />
          </div>
          <div className="overflow-x-auto scrollbar-hide ">
            <div className="grid grid-flow-col  auto-cols-max w-screen">
              {recentSongs?.map((song: any) => (
                <motion.div
                  key={song?.id}
                  className="relative flex flex-col overflow-hidden  items-center group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
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
                    {he.decode(song?.name)}
                  </h3>
                  <p className="text-xs text-muted truncate">
                    {Array.isArray(song?.primaryArtists)
                      ? song?.primaryArtists?.join(", ")
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
      )}

      {favoriteSongs.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white px-4">
              Favorites
            </h2>
            <Heart className="text-accent mr-2" />
          </div>
          <div className="overflow-x-auto scrollbar-hide ">
            <div className="grid grid-flow-col  auto-cols-max w-screen">
              {favoriteSongs?.map((song: any) => (
                <motion.div
                  key={song?.id}
                  className="relative flex flex-col  items-center group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setCurrentSongId(song.id);
                    setSongs(favoriteSongs);
                  }}>
                  <div className=" aspect-square rounded-lg overflow-x-auto size-36 md:size-60 mx-2  ">
                    <img
                      loading="lazy"
                      src={song?.image[2].url}
                      alt={song?.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate w-[9rem] md:w-[15rem]   text-center text-white">
                    {he.decode(song?.name)}
                  </h3>
                  <p className=" text-xs  truncate w-[9rem] md:w-[15rem]   text-center text-slate-400">
                    {song?.artists.primary
                      ?.map((artist) => artist.name)
                      .join(", ")}
                  </p>
                </motion.div>
              ))}

              {isLoading &&
                [...Array(6)].map((_, index) => <SongLoader key={index} />)}
            </div>
          </div>
        </section>
      )}

      <TrendingHits />

      <TopHits />

      <MostSearched />

      <TopCharts />

      <TopCharts2 />

      {/* <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white px-4">Playlists</h2>
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
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
                      loading="lazy"
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
      </section> */}
    </div>
  );
};

export default Index;
