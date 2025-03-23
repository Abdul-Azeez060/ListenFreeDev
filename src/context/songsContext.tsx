// 1. First, let's move the audio element to the context itself

// songsContext.jsx
import { Song } from "@/types/music";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserData } from "./userContext";
import { fetchSongSuggestions } from "@/lib/api";
import he from "he";

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
  isPlayerLoading: boolean;
  currentSong: Song;
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
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);

  // Audio element reference stored in context
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const { user, favoriteSongIds } = useCurrentUserData();

  // Get current song

  const currentSongIndex = useMemo(() => {
    return songs?.findIndex((song) => song?.id === currentSongId);
  }, [songs, currentSongId]);
  const currentSong = songs[currentSongIndex] || null;

  // Add song to playlist
  const addSong = (song) => {
    setSongs((prevSongs) => {
      if (prevSongs.length == 0) {
        setCurrentSongId(song.id);
        setSongs([...prevSongs, song]);
      }
      const filteredSongs = prevSongs.filter(
        (currentSong) => currentSong.id !== song.id
      );
      return [...filteredSongs, song];
    });
  };

  useEffect(() => {
    let decodedName = he.decode(currentSong?.name || "ListenFree");
    let decodedArtistsName = he.decode(
      currentSong?.artists.primary.map((artist) => artist.name).join(", ") ||
        "ListenFree"
    );
    if ("mediaSession" in navigator && currentSong !== undefined) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: decodedName,
        artist: decodedArtistsName,
        album: currentSong?.album?.name || "ListenFree",
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
      // console.log("played successfull");
      setIsPlaying(true);
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // console.log("paused successfull");
      setIsPlaying(false);
    }
  };

  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
      setTimeout(() => {
        audioRef.current.src = currentSong.downloadUrl[4].url;

        if (isPlaying) {
          audioRef.current
            .play()
            .catch((err) => console.error("Playback error:", err));
        }
      }, 200);
    }
  }, [currentSongId, currentSong]);

  // Update audio source when song changes  + onLoad ??
  // useEffect(() => {
  //   if (audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
  //     setTimeout(() => {
  //       audioRef.current.src = currentSong.downloadUrl[4].url;
  //       console.log(audioRef.current.src, "this is the source");

  //       if (isPlaying) {
  //         audioRef.current
  //           .play()
  //           .catch((err) => console.error("Playback error:", err));
  //       }
  //     }, 200);
  //   }

  //   // Handle network disconnection
  //   const handleStalled = () => {
  //     console.warn("Audio stalled due to network issue");
  //     setIsPlaying(true);

  //     setTimeout(() => {
  //       console.log("Retrying playback...");
  //       audioRef.current.load(); // Reload the audio source
  //       audioRef.current
  //         .play()
  //         .catch((err) => console.error("Retry playback error:", err));
  //     }, 2000); // Retry after 2 seconds
  //   };

  //   const handleOnline = () => {
  //     console.log("Internet reconnected, resuming playback...");
  //     setIsPlaying(true);
  //     console.log("isPlaying", isPlaying);

  //     audioRef.current.load();
  //     audioRef.current
  //       .play()
  //       .catch((err) => console.error("Reconnection playback error:", err));
  //   };

  //   audioRef.current?.addEventListener("stalled", handleStalled);
  //   window.addEventListener("online", handleOnline);

  //   return () => {
  //     audioRef.current?.removeEventListener("stalled", handleStalled);
  //     window.removeEventListener("online", handleOnline);
  //   };
  // }, [currentSongId, currentSong]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  //handle isFavorite function
  useEffect(() => {
    setIsFavorite(false);
    async function checkIsFavorite() {
      if (user) {
        for (let song of favoriteSongIds) {
          if (song === currentSongId) {
            setIsFavorite(true);
          }
        }
      }
    }
    checkIsFavorite();
  }, [currentSongId]);

  useEffect(() => {
    if (currentSongIndex > 10) {
      setSongs((preSongs) => preSongs.splice(0, 10));
    }
    if (playedSongs.current.size > 30) {
      const songIdsInQueue = new Set(songs.map((song) => song.id));

      playedSongs.current.forEach((songId: string) => {
        if (!songIdsInQueue.has(songId)) {
          playedSongs.current.delete(songId);
        }
      });
    }
    getSongSuggestions();
  }, [currentSongIndex]);

  const playedSongs = useRef<Set<String>>(new Set());

  // change this for non duplicate songs
  async function getSongSuggestions() {
    console.log("Inside the suggesstions ");
    if (currentSongId && currentSongIndex > songs.length - 4) {
      const response = await fetchSongSuggestions(currentSongId);
      console.log(response.data, "this is the response");

      if (response?.data) {
        const filteredSongs = response.data.filter((song) => {
          return !playedSongs.current.has(song.id); // ✅ Exclude already played songs
        });

        // ✅ Add only new songs to playedSongs
        filteredSongs.forEach((song) => playedSongs.current.add(song.id));

        //@ts-ignore
        setSongs((prevSongs) => {
          const newSongs = filteredSongs.filter(
            (song) =>
              !prevSongs.some((existingSong) => existingSong.id === song.id)
          );
          return [...prevSongs, ...newSongs];
        });
      }
    }
  }

  // Handle time updates
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Play next/previous
  const playNextSong = () => {
    if (songs.length > 0) {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongId(songs[nextIndex].id);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongId(songs[currentSongIndex - 1].id);
      navigate(`player/${songs[currentSongIndex - 1].id}`);
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
        isPlayerLoading,
        currentSong,
      }}>
      {/* Single audio element for the entire app */}
      <audio
        ref={audioRef}
        onLoadStart={() => setIsPlayerLoading(true)}
        onCanPlay={() => setIsPlayerLoading(false)}
        onLoad={() => setIsPlayerLoading(true)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNextSong}
        onDurationChange={() => setDuration(audioRef.current.duration)}
      />
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => useContext(SongsContext);
