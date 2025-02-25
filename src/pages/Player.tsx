
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart,
  Volume2,
  X,
  Repeat,
  Shuffle
} from "lucide-react";
import { fetchSongDetails } from "@/lib/api";
import { Slider } from "@/components/ui/slider";

const Player = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: song } = useQuery({
    queryKey: ['song', songId],
    queryFn: () => fetchSongDetails(songId!),
    enabled: !!songId,
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (newPosition: number[]) => {
    if (audioRef.current) {
      const newTime = (newPosition[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-accent/20 to-background backdrop-blur-lg">
      <div className="container h-full px-4 py-8 flex flex-col justify-between">
        <div className="flex justify-end">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full"
          >
            <X className="text-primary-foreground" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src={song?.image || "/placeholder.svg"}
              alt={song?.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="text-center space-y-2 max-w-md">
            <h1 className="text-2xl font-bold text-primary-foreground">{song?.name}</h1>
            <p className="text-muted">
              {song?.primaryArtists?.join(", ")}
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            <audio
              ref={audioRef}
              src={song?.downloadUrl?.[4]?.link}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="space-y-2">
              <Slider
                value={[currentTime ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSliderChange}
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
              
              <button className="p-2 text-muted hover:text-primary-foreground">
                <SkipBack size={28} />
              </button>
              
              <button 
                className="p-4 rounded-full bg-accent text-white hover:bg-accent/90"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>

              <button className="p-2 text-muted hover:text-primary-foreground">
                <SkipForward size={28} />
              </button>

              <button className="p-2 text-muted hover:text-primary-foreground">
                <Repeat size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <button
                className={`p-2 ${isFavorite ? 'text-red-500' : 'text-muted hover:text-primary-foreground'}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
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
