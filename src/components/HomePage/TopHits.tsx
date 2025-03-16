import { fetchSongs } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Playlist } from "@/types/music";
import { List, PlayCircle } from "lucide-react";
import SongLoader from "../Loaders/SongLoader";
import { useNavigate } from "react-router-dom";
import { useSearchSongs } from "@/context/searchContext";

function TopHits() {
  const { setUrl, setCategory } = useSearchSongs();
  const [isLoading, setIsLoading] = useState(false);
  const [trendingPlaylists, setTrendingPlaylsits] = useState([]);
  const navigate = useNavigate();

  const fetchTopHits = async () => {
    console.log("feching songs");
    try {
      setIsLoading(true);
      let topHits = [];
      let topHitsExpiry = 0;
      if (localStorage.getItem("TopHits")) {
        // console.log("Fetching songs from localstorage");
        topHits = JSON.parse(localStorage.getItem("TopHits"));
        topHitsExpiry = parseInt(localStorage.getItem("TopHitsExpiry"));
      } else if (!topHits || topHits.length <= 0) {
        // console.log("Trending hits not found fetching from api");
        topHits = await fetchSongs("top", "playlists");
        localStorage.setItem("TopHits", JSON.stringify(topHits));
        localStorage.setItem(
          "TopHitsExpiry",
          (Date.now() + 24 * 60 * 60 * 1000).toString()
        );
      } else if (topHits && topHitsExpiry < Date.now()) {
        // console.log("Trending hits time expired");
        topHits = await fetchSongs("top", "playlists");
        localStorage.setItem("TopHits", JSON.stringify(topHits));
        localStorage.setItem(
          "TopHitsExpiry",
          (Date.now() + 24 * 60 * 60 * 1000).toString()
        );
      }

      //   console.log(topHits, "these are trendingsongs ");

      setTrendingPlaylsits(topHits);
      //   console.log("updated the search result");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTopHits();
  }, []);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white px-2 md:px-4">
          Top Hits
        </h2>
        <List />
      </div>
      <div className="overflow-x-auto scrollbar-hide ">
        <div className="grid grid-flow-col  auto-cols-max w-screen">
          {trendingPlaylists?.map((playlist: Playlist) => (
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

export default TopHits;

//get the playlist
//call the fetchSongs api (data -> store display)
