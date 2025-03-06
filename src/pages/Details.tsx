import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSearchSongs } from "@/context/searchContext";
import {
  fetchAlbumSongs,
  fetchArtistSongs,
  fetchPlaylistSongs,
} from "@/lib/api";
import { useLocation } from "react-router-dom";
import { Song } from "@/types/music";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PlayCircleIcon, PlusCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSongs } from "@/context/songsContext";

interface DetailSongs {
  songs: Song[];
  id: string;
  name: string;
  image: object;
  description?: string;
  topAlbums?: Array<object>;
}
function Details() {
  const { albumId, playlistId, artistId } = useParams();
  const { category, url } = useSearchSongs();
  const { addSong, setSongs, songs, setCurrentSongId } = useSongs();
  const navigate = useNavigate();
  const [detailSongs, setDetailSongs] = useState<DetailSongs>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getSongs() {
      setIsLoading(true);
      if (category === "albums") {
        const result = await fetchAlbumSongs(albumId, url);
        //console.log(result.data, "these are the songs in the album");
        setDetailSongs(result.data);
      } else if (category === "playlists") {
        const result = await fetchPlaylistSongs(playlistId, url);
        setDetailSongs(result.data);
      } else if (category === "artists") {
        const result = await fetchArtistSongs(artistId);
        // console.log(result);
        result.data.songs = [...result.data.topSongs];
        setDetailSongs(result.data);
        // console.log(result.data, "this is hte data");

        setDetailSongs(result.data);
      }
      setIsLoading(false);
    }
    getSongs();
  }, []);

  return (
    <div className="h-screen  scrollbar-hide overflow-auto">
      {isLoading ? (
        <div className="animate-pulse ">
          {/* Placeholder for Image */}
          <div className="bg-gray-600 mt-10 sm:w-[20rem] md:p-10  md:w-[30rem] h-48 md:h-60 opacity-50 mx-auto rounded-lg"></div>

          <div className="flex justify-between items-center mt-4 px-5">
            {/* Placeholder for Text */}
            <div className="w-[80%]">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>

            {/* Placeholder for Button */}
            <div className="bg-gray-600 size-14 rounded-full mx-4"></div>
          </div>
        </div>
      ) : (
        <div>
          <img
            src={detailSongs?.image[2].url}
            alt=""
            className="sm:w-[20rem] md:p-10 md:w-[30rem] opacity-50 mx-auto"
          />

          <div className="flex justify-between items-center">
            {category === "artists" ? (
              <h2 className="text-white px-5">{detailSongs?.name}</h2>
            ) : (
              <p className="px-5 text-slate-300 w-[80%]">
                {detailSongs?.description}
              </p>
            )}
            {detailSongs && (
              <button
                className="mx-4"
                onClick={() => {
                  setSongs(detailSongs.songs);
                  console.log("button clicked");
                  setCurrentSongId(detailSongs?.songs[0].id);

                  const playlists = JSON.parse(
                    localStorage.getItem("playlists") || "[]"
                  );

                  // Update the playlists array with the new detailSongs
                  const updatedPlaylists = [...playlists, detailSongs];

                  // Save the updated playlists array back to localStorage
                  localStorage.setItem(
                    "playlists",
                    JSON.stringify(updatedPlaylists)
                  );
                }}>
                <PlayCircleIcon className="text-white size-14" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 mb-40">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center space-x-4 p-2 w-full">
                  <div className="w-12 h-12 bg-gray-600 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-600 rounded" />
                    <div className="h-3 w-32 bg-gray-600 rounded" />
                  </div>
                </div>
              ))
          : detailSongs?.songs?.map((song: Song) => (
              <motion.div
                key={song.id}
                className="flex items-center justify-between space-x-4 p-2 hover:text-black hover:bg-gray-600 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.01 }}>
                <div
                  className="flex items-center w-[calc(100vw-5rem)]"
                  onClick={() => {
                    // console.log("clicked the song");
                    setCurrentSongId(song.id);
                    addSong(song);
                    setSongs(detailSongs.songs);
                    // console.log("addded the song to the state");
                  }}>
                  <img
                    src={song.image[2].url}
                    alt={song.name}
                    className="w-12 mr-3 h-12 rounded-md object-cover"
                  />
                  <div className="w-[11rem] sm:w-[13rem] md:w-[15rem] lg:w-[20rem] xl:w-[35rem]">
                    <h3 className="font-medium  truncate   text-slate-300">
                      {song.name}
                    </h3>
                    <p className="text-sm text-slate-400  truncate ">
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
