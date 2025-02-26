// 1. First, let's move the audio element to the context itself

// songsContext.jsx
import { Song } from "@/types/music";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SongsContextProps {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  currentSongId: string | null;
  setCurrentSongId: (id: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  duration: number;
  isPlaying: boolean;
  isFavorite: boolean;
  setIsFavorite: (isFavorite: boolean) => void;
  currentTime: number;
  togglePlay: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  seekTo: (percentage: number) => void;
  addSong: (song: Song) => void;
}
const SongsContext = createContext<SongsContextProps | undefined>(undefined);

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio element reference stored in context
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Get current song

  const currentSongIndex = songs.findIndex((song) => song.id === currentSongId);
  const currentSong = songs[currentSongIndex] || null;

  // Add song to playlist
  const addSong = (song) => {
    setSongs([...songs, song]);
    // console.log("Song added to playlist:", song);
  };
  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) => console.error("Playback error:", err));
      }

      setIsPlaying(!isPlaying);
    }
  };

  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
      audioRef.current.src = currentSong.downloadUrl[4].url;

      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.error("Playback error:", err));
      }
    }
  }, [currentSongId, currentSong]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle time updates
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Play next/previous
  const playNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      // console.log(songs[currentSongIndex + 1], "this is the next song");
      setCurrentSongId(songs[currentSongIndex + 1].id);
      navigate(`/player/${songs[currentSongIndex + 1].id}`);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongId(songs[currentSongIndex - 1].id);
      navigate(`/player/${songs[currentSongIndex - 1].id}`);
    }
  };

  // Seek to position
  const seekTo = (percentage) => {
    if (audioRef.current) {
      const newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <SongsContext.Provider
      value={{
        songs,
        setSongs,
        currentSongId,
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
        addSong,
      }}>
      {/* Single audio element for the entire app */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNextSong}
        onDurationChange={() => setDuration(audioRef.current.duration)}
      />
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => useContext(SongsContext);
