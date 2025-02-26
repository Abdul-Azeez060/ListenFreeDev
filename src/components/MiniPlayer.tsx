import { useNavigate } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Heart, X } from "lucide-react";
import { useSongs } from "@/context/songsContext";
import { memo } from "react"; // Add memo to prevent unnecessary re-renders

const MiniPlayer = memo(() => {
  const navigate = useNavigate();
  const {
    songs,
    currentSongId,
    isPlaying,
    isFavorite,
    setIsFavorite,
    togglePlay,
    playNextSong,
    playPreviousSong,
  } = useSongs();

  const currentSongIndex = songs.findIndex((song) => song.id === currentSongId);
  const currentSong = songs[currentSongIndex];

  // If no song is playing, don't render the mini player
  if (!currentSong) return null;

  return (
    <div className="w-full bg-gradient-to-b from-accent/20 to-background backdrop-blur-lg shadow-md z-50">
      <div className="container px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate(`/player/${currentSongId}`)}>
          <img
            src={currentSong?.image?.[2]?.url || "/placeholder.svg"}
            alt={currentSong?.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex flex-col text-center">
            <h1 className="text-sm md:text-lg font-bold text-primary-foreground truncate w-[150px] md:w-auto">
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
            <Heart
              size={24}
              fill={isFavorite ? "currentColor" : "none"}
              className={isFavorite ? "text-red-500" : "text-muted"}
            />
          </button>
        </div>
      </div>
    </div>
  );
});

export default MiniPlayer;
