import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../logo.jpeg";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  X,
  Repeat,
  Shuffle,
  ArrowLeft,
  Loader2,
  Download,
  ArrowDown,
  ArrowBigDownDash,
  ChevronDown,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSongs } from "@/context/songsContext";
import useCustomBackNavigation from "@/lib/BackNavigation";
import SongDetails from "@/components/SongDetails";
import usePreventPullToRefresh from "@/components/PreventReload";
import SongsQueue from "@/components/SongsQueue";
import IsFavoriteHeartComponent from "@/components/IsFavoriteHeartComponent";
import { DownloadButton } from "@/components/DownloadButton";
import { AddToPlaylist } from "@/components/AddToPlaylist";
import LazyImage from "@/components/LazyImage";

const Player = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next

  const {
    songs,
    setSongs,
    setCurrentSongId,
    volume,
    setVolume,
    duration,
    isPlaying,
    isFavorite,
    setIsFavorite,
    currentTime,
    togglePlay,
    playNextSong,
    playPreviousSong,
    seekTo,
    togglePause,
    currentSongId,
    isPlayerLoading,
  } = useSongs();

  const [lyrics, setlyrics] = useState("");

  // Find the current song
  const currentSongIndex = songs.findIndex(
    (song) => song?.id === currentSongId
  );
  const currentSong = songs[currentSongIndex];
  useCustomBackNavigation();

  // Set current song if it's not already set
  useEffect(() => {
    if (songId !== currentSongId) {
      setCurrentSongId(currentSongId);
    }

    const recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];

    if (!recentSongs.some((song) => song?.id === currentSongId)) {
      localStorage.setItem(
        "recentSongs",
        JSON.stringify([...recentSongs, currentSong])
      );
    }
  }, [songId, currentSongId, setCurrentSongId]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const disableReload = (e) => {
      if (
        e.key === "F5" ||
        (e.ctrlKey && e.key === "r") || // Windows/Linux
        (e.metaKey && e.key === "r") // Mac ⌘ + R
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", disableReload);
    return () => window.removeEventListener("keydown", disableReload);
  }, []);

  usePreventPullToRefresh();

  // Custom handlers for song navigation with direction setting
  const handleNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setDirection(1); // Set direction to forward
      playNextSong();
    }
  };

  const handlePreviousSong = () => {
    if (currentSongIndex > 0) {
      setDirection(-1); // Set direction to backward
      playPreviousSong();
    }
  };

  return (
    <div
      className="fixed inset-0"
      style={{
        backgroundImage: `url(${currentSong?.image[2]?.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgb(0,0,0))`,
          backdropFilter: "blur(100px)",
        }}>
        <div className="container h-full px-4 py-8 flex flex-col justify-between">
          <div className="flex justify-start">
            <button
              onClick={() => navigate("/search")}
              className="p-2 text-white hover:bg-secondary rounded-full">
              <ChevronDown size={24} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4 mb-16">
            {/* Image with slide animation */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSongId}
                custom={direction}
                initial={{
                  x: direction * 300, // Enter from right or left based on direction
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: direction * -300, // Exit to opposite direction
                  opacity: 0,
                }}
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.1 },
                }}
                className="w-80 h-80 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-black shadow-2xl">
                {/* <img
                  src={currentSong?.image[2]?.url || Logo}
                  alt={currentSong?.name}
                  className="w-full h-full object-cover"
                /> */}
                <LazyImage
                  src={currentSong?.image[2]?.url}
                  alt={currentSong?.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="w-72 md:w-80">
              <SongDetails currentSong={currentSong} />
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <Slider
                  value={[currentTime ? (currentTime / duration) * 100 : 0]}
                  onValueChange={(newValue) => seekTo(newValue[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm  text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center  justify-center space-x-6">
                <div className="relative left-2">
                  <DownloadButton currentSong={currentSong} />
                </div>

                <button
                  className="p-2 text-white"
                  onClick={handlePreviousSong}
                  disabled={currentSongIndex === 0}>
                  <SkipBack size={28} />
                </button>

                <button
                  className="p-4 rounded-full text-white bg-slate-400/90"
                  onClick={isPlaying ? togglePause : togglePlay}>
                  {isPlayerLoading ? (
                    <span>
                      <Loader2 className="animate-spin" />
                    </span>
                  ) : (
                    <>{isPlaying ? <Pause size={32} /> : <Play size={32} />}</>
                  )}
                </button>

                <button
                  className="p-2 text-white"
                  onClick={handleNextSong}
                  disabled={currentSongIndex === songs.length - 1}>
                  <SkipForward size={28} />
                </button>
                <div className="pr-6">
                  <AddToPlaylist songId={currentSongId} />
                </div>
              </div>

              <div className="flex items-center justify-between px-4">
                <div>
                  <IsFavoriteHeartComponent />
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="text-white" size={20} />
                  <Slider
                    value={[volume * 100]}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="flex justify-center w-screen ml-4 bg-white">
        <div className="absolute bottom-4">
          <SongsQueue />
        </div>
      </div>
    </div>
  );
};

export default Player;
