import { fetchSongs } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Playlist } from "@/types/music";
import { List, PlayCircle } from "lucide-react";
import SongLoader from "../Loaders/SongLoader";
import { useNavigate } from "react-router-dom";
import { useSearchSongs } from "@/context/searchContext";

function MostSearched() {
  const { setUrl, setCategory } = useSearchSongs();
  const [isLoading, setIsLoading] = useState(false);
  const [mostSearchedPlaylists, setMostSearchedPlaylist] = useState([]);
  const navigate = useNavigate();

  const fetchmostSearched = async () => {
    console.log("feching most searched songs");
    try {
      setIsLoading(true);
      let mostSearched = [];
      let mostSearchedExpiry = 0;
      if (localStorage.getItem("MostSearched")) {
        console.log("Fetching songs from localstorage");
        mostSearched = JSON.parse(localStorage.getItem("MostSearched"));
        mostSearchedExpiry = parseInt(
          localStorage.getItem("MostSearchedExpiry")
        );
      } else if (!mostSearched || mostSearched.length < 1) {
        console.log("Trending hits not found fetching from api");
        mostSearched = await fetchSongs("most searched", "playlists");
        localStorage.setItem("MostSearched", JSON.stringify(mostSearched));
        localStorage.setItem(
          "MostSearchedExpiry",
          (Date.now() + 24 * 60 * 60 * 1000).toString()
        );
      } else if (mostSearched && mostSearchedExpiry < Date.now()) {
        console.log("Mostsearched time expired");
        mostSearched = await fetchSongs("most searched", "playlists");
        localStorage.setItem("MostSearched", JSON.stringify(mostSearched));
        localStorage.setItem(
          "MostSearchedExpiry",
          (Date.now() + 24 * 60 * 60 * 1000).toString()
        );
      }

      console.log(mostSearched, "these are trendingsongs ");

      setMostSearchedPlaylist(mostSearched);
      console.log("updated the search result");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchmostSearched();
  }, []);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white px-2 md:px-4">
          Most Searched
        </h2>
        <List />
      </div>
      <div className="overflow-x-auto scrollbar-hide ">
        <div className="grid grid-flow-col  auto-cols-max w-screen">
          {mostSearchedPlaylists?.map((playlist: Playlist) => (
            <motion.div
              key={playlist?.id}
              className="relative group cursor-pointer size-40 md:size-60 p-1 mb-14 "
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setCategory("playlists");
                setUrl(playlist.url);
                navigate(`/playlist/${playlist.id}`);
              }}>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  loading="lazy"
                  src={
                    playlist?.image[2].url ||
                    playlist?.image[1].url ||
                    playlist?.image[0].url
                  }
                  alt={playlist?.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium truncate text-white">
                {playlist?.name}
              </h3>
              <p className="text-xs text-muted w-[9rem] md:w-[15rem] truncate">
                {playlist?.language} • {playlist?.songCount} songs
              </p>
            </motion.div>
          ))}

          {isLoading &&
            [...Array(6)].map((_, index) => <SongLoader key={index} />)}
        </div>
      </div>
    </section>
  );
}

export default MostSearched;

//get the playlist
//call the fetchSongs api (data -> store display)
