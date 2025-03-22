import { useRef, useEffect, useState } from "react";
import { ListMusic, Minus, MinusCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { useSongs } from "@/context/songsContext";
import { Song } from "@/types/music";
import he from "he";
import LazyImage from "./LazyImage";
import LongNames from "./LongNames";

function SongsQueue() {
  const [isQueueOpen, setisQueueOpen] = useState(false);
  const songRefs = useRef({});
  const { songs, setSongs, setCurrentSongId, currentSongId, addSong } =
    useSongs();
  useEffect(() => {
    setTimeout(() => {
      if (songRefs.current[currentSongId]) {
        songRefs.current[currentSongId].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 200);
  }, [currentSongId, isQueueOpen]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div>
          <Button
            className="bg-transparent text-white relative right-6"
            variant="secondary"
            onClick={() => setisQueueOpen(!isQueueOpen)}>
            <ListMusic className="text-white" />
            Queue
          </Button>
        </div>
      </DrawerTrigger>

      <DrawerTitle />

      <DrawerContent className="bg-black/90 px-4 py-4  md:px-12  h-[50%]">
        <div className="mx-auto w-full max-w-sm "></div>
        <div className=" md:px-4 overflow-y-auto scrollbar-hide">
          {songs?.map((song: Song) => (
            <motion.div
              key={song?.id}
              ref={(el) => (songRefs.current[song?.id] = el)}
              className={`flex items-center justify-between space-x-4 p-2 ${
                song?.id === currentSongId ? "bg-gray-700" : ""
              }  hover:text-black hover:bg-gray-700 rounded-lg cursor-pointer`}
              whileHover={{ scale: 1.01 }}>
              <div
                className="flex items-center w-[calc(100vw-5rem)]"
                onClick={() => {
                  setCurrentSongId(song?.id);
                }}>
                {/* <img
                  loading="lazy"
                  src={song?.image[2].url}
                  alt={song?.name}
                  className="w-12 mr-3 h-12 rounded-md object-cover"
                /> */}
                <LazyImage
                  src={song?.image[2].url}
                  alt={song?.name}
                  className="w-12 mr-3 h-12 rounded-md object-cover"
                />
                <LongNames song={song} />
              </div>
              <div>
                <button>
                  <MinusCircle
                    className="text-white"
                    onClick={() => {
                      setSongs(
                        songs.filter((currentSong) => currentSong.id != song.id)
                      );
                    }}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SongsQueue;
