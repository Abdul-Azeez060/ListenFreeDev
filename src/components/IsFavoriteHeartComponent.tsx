import {
  setIsFavorite as setIsFavoriteFunction,
  setIsNotFavorite,
} from "@/appwrite/databaseActions";
import { useSongs } from "@/context/songsContext";
import { useCurrentUserData } from "@/context/userContext";
import { Heart } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function IsFavoriteHeartComponent() {
  const { user, setFavoriteSongIds } = useCurrentUserData();
  const { isFavorite, setIsFavorite, currentSongId, currentSong } = useSongs();
  const pendingRequestRef = useRef(false);
  // Store the latest state to ensure we're working with current values
  const currentStateRef = useRef(isFavorite);

  const navigate = useNavigate();

  // Create the debounced function (only created once)
  const debouncedApiCall = useRef(
    debounce(async (songId, userId, newState) => {
      let favSongs = JSON.parse(localStorage.getItem("favorites"));
      if (pendingRequestRef.current) return;

      pendingRequestRef.current = true;
      let result = null;
      try {
        if (!newState) {
          result = await setIsNotFavorite(songId, userId, currentSong);
        } else {
          result = await setIsFavoriteFunction(userId, songId);
        }

        if (result.success) {
          toast(result.message);
          if (result.isFavorite) {
            favSongs = [...favSongs, songId];
            localStorage.setItem("favorites", JSON.stringify(favSongs));
            setFavoriteSongIds(favSongs);
          } else {
            favSongs = favSongs.filter((favSongId) => favSongId !== songId);
            localStorage.setItem("favorites", JSON.stringify(favSongs));
            setFavoriteSongIds(favSongs);
          }
        } else {
          // If the API call fails, revert the UI
          setIsFavorite(!newState);
          toast("Couldn't update favorites: " + result.message);
        }
      } catch (error) {
        // Handle any exceptions
        setIsFavorite(!newState);
        toast("Couldn't add to favorite.");
        console.error("Favorite operation failed:", error);
      } finally {
        pendingRequestRef.current = false;
      }
    }, 3) // 300ms debounce time
  ).current;

  const handleFavoriteChange = () => {
    // Immediately update UI (optimistic update)
    if (!user) {
      toast(
        <div className="flex justify-between w-full items-center">
          <h1 className="text-sm md:text-md font-medium">
            Sign in to add to favorites
          </h1>
          <Button
            className=" bg-red-500"
            onClick={() => {
              navigate("/profile");
            }}>
            Sign in
          </Button>
        </div>
      );

      return;
    }
    const newState = !currentStateRef.current;
    setIsFavorite(newState);

    // Call the debounced function
    debouncedApiCall(currentSongId, user.$id, newState);
  };

  return (
    <button
      className={`p-2 ${
        isFavorite ? "text-red-500" : "text-white hover:text-primary-foreground"
      }`}
      onClick={handleFavoriteChange}>
      <Heart fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}

export default IsFavoriteHeartComponent;
