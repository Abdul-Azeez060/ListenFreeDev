import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSearchSongs } from "@/context/searchContext";
import { fetchAlbumSongs, fetchPlaylistSongs } from "@/lib/api";
import { useLocation } from "react-router-dom";
import { Song } from "@/types/music";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BugPlay,
  PlayCircle,
  PlayCircleIcon,
  PlayIcon,
  PlusCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSongs } from "@/context/songsContext";

interface DetailSongs {
  songs: Song[];
  id: string;
  name: string;
  image: object;
  description?: string;
}
function Details() {
  const { albumId, playlistId } = useParams();
  const { category, url } = useSearchSongs();
  const { addSong, setSongs, songs, setCurrentSongId } = useSongs();
  const navigate = useNavigate();
  const [detailSongs, setDetailSongs] = useState<DetailSongs>();

  useEffect(() => {
    async function getSongs() {
      if (category === "albums") {
        const result = await fetchAlbumSongs(albumId, url);
        console.log(result.data, "these are the songs in the album");
        setDetailSongs(result.data);
      } else if (category === "playlists") {
        const result = await fetchPlaylistSongs(playlistId, url);
        setDetailSongs(result.data);
      }
    }
    getSongs();
  }, []);

  return (
    <div className="h-screen  scrollbar-hide overflow-auto">
      <div>
        <img
          src={detailSongs?.image[2].url}
          alt=""
          className="md:w-full md:h-[35rem] opacity-50"
        />
        <div className="flex justify-between items-center">
          <p className="px-5 text-slate-300 w-[80%]">
            {detailSongs?.description}
          </p>
          {detailSongs && (
            <button
              className="mx-4"
              onClick={() => {
                setSongs(detailSongs.songs);
                console.log("button clicked");
                setCurrentSongId(detailSongs?.songs[0].id);
              }}>
              <PlayCircleIcon className="text-white size-14" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 mb-40">
        {detailSongs?.songs?.map((song: Song) => (
          <motion.div
            key={song.id}
            className="flex items-center justify-between space-x-4 p-2 hover:text-black hover:bg-muted rounded-lg cursor-pointer"
            whileHover={{ scale: 1.01 }}>
            <div
              className="flex items-center w-[calc(100vw-5rem)]"
              onClick={() => {
                console.log("clicked the song");
                setCurrentSongId(song.id);
                addSong(song);
                console.log("addded the song to the state");
              }}>
              <img
                src={song.image[2].url}
                alt={song.name}
                className="w-12 mr-3 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium  text-slate-300">{song.name}</h3>
                <p className="text-sm text-slate-400">
                  {song?.artists.primary
                    ?.map((artist) => artist.name)
                    .join(", ")}
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
    </div>
  );
}

export default Details;
