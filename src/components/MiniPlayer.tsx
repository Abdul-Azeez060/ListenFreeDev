import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  X,
  Loader2,
} from "lucide-react";
import { useSongs } from "@/context/songsContext";
import { memo, useEffect } from "react"; // Add memo to prevent unnecessary re-renders
import { Song } from "@/types/music";
import IsFavoriteHeartComponent from "./IsFavoriteHeartComponent";
import LazyImage from "./LazyImage";
const MiniPlayer = memo(() => {
  const navigate = useNavigate();
  const {
    songs,
    currentSongId,
    isPlaying,
    togglePlay,
    playNextSong,
    togglePause,
    isPlayerLoading,
  } = useSongs();

  const currentSongIndex = songs.findIndex((song) => song.id === currentSongId);
  const currentSong = songs[currentSongIndex];

  // If no song is playing, don't render the mini player
  if (!currentSong) return null;

  return (
    <div
      className="w-full  shadow-md z-50"
      style={{
        backgroundImage: `url(${currentSong?.image[2]?.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className=" inset-0 backdrop-blur-3xl bg-black/60">
        <div className="container px-4 py-2 flex items-center justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer w-[80%]"
            onClick={() => navigate(`/player/${currentSongId}`)}>
            <LazyImage
              src={
                currentSong?.image?.[2]?.url ||
               ""
              }
              alt={currentSong?.name}
              className="w-11 h-11 rounded-lg object-cover"
            />
            <div className="flex flex-col ">
              <h1 className="text-sm font-extrabold text-white w-28 truncate ">
                {currentSong?.name}
              </h1>
              <p className="text-white text-xs h-5 overflow-hidden">
                {currentSong?.artists.primary
                  .map((artist) => artist.name)
                  .join(", ")
                  .slice(0, 20)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-white"
              onClick={isPlaying ? togglePause : togglePlay}>
              {isPlayerLoading ? (
                <span>
                  <Loader2 className=" animate-spin" />
                </span>
              ) : (
                <>{isPlaying ? <Pause size={32} /> : <Play size={32} />}</>
              )}
            </button>
            <button
              className="p-2 text-white"
              onClick={playNextSong}
              disabled={currentSongIndex === songs.length - 1}>
              <SkipForward size={24} />
            </button>
            <IsFavoriteHeartComponent />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MiniPlayer;
