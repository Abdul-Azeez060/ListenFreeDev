import { motion } from "framer-motion";
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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSongs } from "@/context/songsContext";
import useCustomBackNavigation from "@/lib/BackNavigation";
import SongDetails from "@/components/SongDetails";
import usePreventPullToRefresh from "@/components/PreventReload";
import SongsQueue from "@/components/SongsQueue";
import IsFavoriteHeartComponent from "@/components/IsFavoriteHeartComponent";
import { DownloadButton } from "@/components/DownloadButton";

const Player = () => {
  const { songId } = useParams();
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   console.log("first");
  //   getLyrics();
  // }, [currentSongId]);

  // async function getLyrics() {
  //   if (currentSong?.hasLyrics) {
  //     const response = await fetchSongLyrics(currentSong.id);
  //   }
  // }

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
              <ArrowLeft size={32} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4 mb-16">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-72 h-72 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-black shadow-2xl">
              <img
                src={currentSong?.image[2]?.url || Logo}
                alt={currentSong?.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
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

              <div className="flex items-center justify-center space-x-6">
                <button className="p-2  text-white hover:text-primary-foreground">
                  <Shuffle size={20} />
                </button>

                <button
                  className="p-2  text-white "
                  onClick={playPreviousSong}
                  disabled={currentSongIndex === 0}>
                  <SkipBack size={28} />
                </button>

                <button
                  className="p-4 rounded-full  text-white bg-slate-400/90"
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
                  className="p-2  text-white "
                  onClick={playNextSong}
                  disabled={currentSongIndex === songs.length - 1}>
                  <SkipForward size={28} />
                </button>

                {/* <button className="p-2  text-white hover:text-primary-foreground">
                  <Repeat size={20} />
                </button> */}
                <DownloadButton currentSong={currentSong} />
              </div>

              <div className="flex items-center justify-between px-4">
                <div>
                  <IsFavoriteHeartComponent />
                </div>

                <div className="relative left-12">
                  <SongsQueue />
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
    </div>
  );
};

export default Player;
