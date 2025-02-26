import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  X,
  Repeat,
  Shuffle,
  ArrowLeft,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSongs } from "@/context/songsContext";

const Player = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const {
    songs,
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
    currentSongId,
  } = useSongs();

  // Find the current song
  const currentSongIndex = songs.findIndex((song) => song.id === songId);
  const currentSong = songs[currentSongIndex];

  // Set current song if it's not already set
  useEffect(() => {
    if (songId !== currentSongId) {
      setCurrentSongId(songId);
    }
  }, [songId, currentSongId, setCurrentSongId]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-accent/20 to-background backdrop-blur-lg">
      <div className="container h-full px-4 py-8 flex flex-col justify-between">
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/search")}
            className="p-2 hover:bg-secondary rounded-full">
            <ArrowLeft size={24} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center space-y-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-72 h-72 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-xl">
            <img
              src={currentSong?.image[2]?.url || "/placeholder.svg"}
              alt={currentSong?.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="text-center space-y-2 max-w-md">
            <h1 className=" text-2xl font-bold text-primary-foreground">
              {currentSong?.name}
            </h1>
            <p className="text-muted">
              {currentSong?.primaryArtists?.join(", ")}
            </p>
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
              <div className="flex justify-between text-sm text-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <button className="p-2 text-muted hover:text-primary-foreground">
                <Shuffle size={20} />
              </button>

              <button
                className="p-2 text-muted hover:text-primary-foreground"
                onClick={playPreviousSong}
                disabled={currentSongIndex === 0}>
                <SkipBack size={28} />
              </button>

              <button
                className="p-4 rounded-full bg-accent text-white hover:bg-accent/90"
                onClick={togglePlay}>
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>

              <button
                className="p-2 text-muted hover:text-primary-foreground"
                onClick={playNextSong}
                disabled={currentSongIndex === songs.length - 1}>
                <SkipForward size={28} />
              </button>

              <button className="p-2 text-muted hover:text-primary-foreground">
                <Repeat size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <button
                className={`p-2 ${
                  isFavorite
                    ? "text-red-500"
                    : "text-muted hover:text-primary-foreground"
                }`}
                onClick={() => setIsFavorite(!isFavorite)}>
                <Heart fill={isFavorite ? "currentColor" : "none"} />
              </button>

              <div className="flex items-center space-x-2">
                <Volume2 className="text-muted" size={20} />
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
  );
};

export default Player;
