import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSongs } from "@/context/songsContext";

const MiniPlayer = () => {
  const navigate = useNavigate();
  const { songs, currentSongId } = useSongs();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentSongIndex = songs.findIndex((song) => song.id === currentSongId);
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback error:", err));
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      navigate(`/player/${songs[currentSongIndex + 1].id}`);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      navigate(`/player/${songs[currentSongIndex - 1].id}`);
    }
  };

  return (
    <div className=" w-full bg-gradient-to-b from-accent/20 to-background backdrop-blur-lg shadow-md z-50">
      <div className="container px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-full">
          <X className="text-primary-foreground" />
        </button>

        <div className="flex items-center space-x-4">
          <img
            src={currentSong?.image?.[2]?.url || "/placeholder.svg"}
            alt={currentSong?.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex flex-col text-center">
            <h1 className="text-lg font-bold text-primary-foreground">
              {currentSong?.name}
            </h1>
            <p className="text-muted text-sm">
              {currentSong?.primaryArtists?.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2"
            onClick={playPreviousSong}
            disabled={currentSongIndex === 0}>
            <SkipBack size={24} />
          </button>
          <button className="p-2" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            className="p-2"
            onClick={playNextSong}
            disabled={currentSongIndex === songs.length - 1}>
            <SkipForward size={24} />
          </button>
          <button className="p-2" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={isFavorite ? "text-red-500" : "text-muted"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
