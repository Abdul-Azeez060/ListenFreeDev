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
  togglePause: () => void;
}
const SongsContext = createContext<SongsContextProps | undefined>(undefined);

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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

  useEffect(() => {
    if ("mediaSession" in navigator && currentSong !== undefined) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong?.name,
        artist: currentSong?.artists.primary
          .map((artist) => artist.name)
          .join(", "),
        album: currentSong?.album.name,
        artwork: currentSong?.image?.[2]?.url
          ? [
              {
                src: currentSong.image[2].url,
                sizes: "150x150",
                type: "image/jpeg",
              },
            ]
          : [],
      });

      navigator.mediaSession.setActionHandler("play", togglePlay);
      navigator.mediaSession.setActionHandler("pause", togglePause);
      navigator.mediaSession.setActionHandler("seekbackward", seekTo);
      navigator.mediaSession.setActionHandler("seekforward", seekTo);
      navigator.mediaSession.setActionHandler(
        "previoustrack",
        playPreviousSong
      );
      navigator.mediaSession.setActionHandler("nexttrack", playNextSong);
    }

    // Cleanup media session on unmount
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    };
  }, [currentSong, currentSongId]);
  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback error:", err));
      console.log("played successfull");
      setIsPlaying(true);
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      console.log("paused successfull");
      setIsPlaying(false);
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
      setCurrentSongId(songs[(currentSongIndex + 1) % songs.length].id);
      navigate(`/player/${songs[(currentSongIndex + 1) % songs.length].id}`);
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
        togglePause,
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
