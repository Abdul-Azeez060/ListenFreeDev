import { motion } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { useSearchSongs } from "@/context/searchContext";
import { toast } from "sonner";
import { useSongs } from "@/context/songsContext";
import { Song } from "@/types/music";
import { useNavigate } from "react-router-dom";
import he from "he";
function SongsResult() {
  const { searchSongsResult } = useSearchSongs();
  const { addSong, setCurrentSongId, setSongs } = useSongs();
  const navigate = useNavigate();

  return (
    <div className="">
      {searchSongsResult.map((song: Song) => (
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
            <img
              loading="lazy"
              src={song.image[2].url}
              alt={song.name}
              className="w-12 mr-3 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium  text-slate-300">
                {he.decode(song.name.slice(0, 25))}...
              </h3>
              <p className="text-sm text-slate-400">
                {song?.artists?.primary
                  ?.map((artist) => artist.name)
                  .join(", ")
                  .slice(0, 25)}
                ...
              </p>
            </div>
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
      ))}
    </div>
  );
}

export default SongsResult;
