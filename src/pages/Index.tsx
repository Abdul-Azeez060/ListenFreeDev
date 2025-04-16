import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSongs } from "@/context/songsContext";
import { useCurrentUserData } from "@/context/userContext";
import SongLoader from "@/components/Loaders/HomeSongLoader";
import { Song } from "@/types/music";
import he from "he";
import TrendingHits from "@/components/HomePage/TrendingHits";
import TopHits from "@/components/HomePage/TopHits";
import MostSearched from "@/components/HomePage/MostSearched";
import TopCharts from "@/components/HomePage/TopCharts";
import TopCharts2 from "@/components/HomePage/TopCharts2";
import { Button } from "@/components/ui/button";
import InstallPWA from "@/components/InstallPwa";
import LazyImage from "@/components/LazyImage";
import Favorites from "@/components/HomePage/Favorites";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

const Index = () => {
  // const { data: recentSongs, isLoading } = useQuery({
  //   queryKey: ['recentSongs'],
  //   queryFn: () => fetchSongs('latest'),
  // });

  // useSessionReload();
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    if (needRefresh[0]) {
      toast("New update available!", {
        action: {
          label: "Update",
          onClick: () => {
            updateServiceWorker(true);
          },
        },
        description: "Click to update the app.",
        duration: 5000,
        dismissible: true,
        style: {
          backgroundColor: "#1e1e2f",
          color: "#fff",
          border: "1px solid #4b5563",
          borderRadius: "0.375rem",
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease-in-out",
        },
      });
    }
  }, [needRefresh, updateServiceWorker]);

  const [recentSongs, setRecentSongs] = useState([]);
  const { user } = useCurrentUserData();

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
  }, [user]);

  const { currentSongId, setCurrentSongId, setSongs } = useSongs();

  // const songs = recentSongs?.data ? Array.isArray(recentSongs.data) ? recentSongs.data : [] : [];

  return (
    <div className=" py-6 space-y-2 bg-black mb-24">
      <div className="flex  justify-between px-2 md:px-4">
        <motion.h1
          className="text-2xl md:text-4xl my-4 font-bold text-[#a7a6ec]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          Welcome Back{" "}
          <span className="text-orange-600">
            {user ? user?.name.split(" ")[0] + "!" : "Guest!"}
          </span>
        </motion.h1>
        {/* <InstallPWA /> */}
      </div>
      <div className="flex items-center ">
        {needRefresh[0] && (
          <div className="update-toast">
            <span className=" text-orange-400 pl-4">New update available!</span>
            <button
              className="text-white border border-white rounded px-2 py-1 ml-2"
              onClick={() => updateServiceWorker(true)}>
              Update
            </button>
          </div>
        )}
      </div>
      {recentSongs.length > 0 && (
        <section className="space-y-4 w-screen">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#a7a6ec] px-2 md:px-4">
              Recent Plays
            </h2>
            <Clock className="text-muted mr-2" />
          </div>
          <div className="overflow-x-auto scrollbar-hide ">
            <div className="grid grid-flow-col gap-1  auto-cols-max w-screen">
              {recentSongs?.map((song: any) => (
                <motion.div
                  key={song?.id}
                  className="relative group cursor-pointer size-40 md:size-60 p-1 mb-14 "
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setCurrentSongId(song.id);
                    recentSongs.unshift(
                      recentSongs.splice(recentSongs.indexOf(song), 1)[0]
                    );
                    setRecentSongs(recentSongs);

                    setSongs(recentSongs);
                  }}>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <LazyImage
                      src={song?.image[2].url}
                      alt={song?.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  <div className=" w-[9rem] md:w-[15rem]">
                    <h3 className="mt-2 text-sm font-medium text-center w-full truncate text-white overflow-hidden">
                      {he.decode(song?.name)}
                    </h3>
                    <p className="text-xs text-muted truncate w-full text-center  text-slate-400 overflow-hidden">
                      {song?.artists?.primary
                        ?.map((artist) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                </motion.div>
              ))}
              {/* {isLoading &&
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-secondary rounded-lg"></div>
                      <div className="mt-2 h-4 bg-secondary rounded w-3/4"></div>
                      <div className="mt-1 h-3 bg-secondary rounded w-1/2"></div>
                    </div>
                  ))} */}
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
