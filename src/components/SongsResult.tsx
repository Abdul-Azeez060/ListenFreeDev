import { motion } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { useSearchSongs } from "@/context/searchContext";
import { toast } from "sonner";
import { useSongs } from "@/context/songsContext";
import { Song } from "@/types/music";
import { useNavigate } from "react-router-dom";
import he from "he";
import { useState } from "react";
import LazyImage from "./LazyImage";
import LongNames from "./LongNames";
import SongsLoader from "./Loaders/SongsLoader";
function SongsResult({ isLoading }: { isLoading: boolean }) {
  const { searchSongsResult } = useSearchSongs();
  const { addSong, setCurrentSongId, setSongs } = useSongs();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="">
      {!isLoading ? (
        searchSongsResult.map((song: Song) => (
          <motion.div
            key={song.id}
            className="flex items-center justify-between space-x-4 p-2  hover:text-black hover:bg-gray-700/60 rounded-lg cursor-pointer"
            whileHover={{ scale: 1.01 }}>
            <div
              className="flex items-center w-[calc(100vw-5rem)]"
              onClick={() => {
                setSongs([]);
                setCurrentSongId(song.id);
                addSong(song);
                navigate(`/player/${song.id}`);
              }}>
              <LazyImage
                src={song.image[2].url}
                alt={song.name}
                className="w-12 mr-3 h-12 rounded-md object-cover"
              />
              {/* <img
              loading="lazy"
              src={song.image[2].url}
              alt={song.name}
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={() => console.log("Failed to load image")}
              className="w-12 mr-3 h-12 rounded-md object-cover"
            /> */}
              <LongNames song={song} />
            </div>
            <div>
              <PlusCircleIcon
                onClick={() => {
                  addSong(song);
                  toast("Song added to queue");
                }}
                className="text-white"
              />
            </div>
          </motion.div>
        ))
      ) : (
        <>
          {[...Array(10)].map((_, i) => (
            <SongsLoader key={i} />
          ))}
        </>
      )}
    </div>
  );
}

export default SongsResult;
