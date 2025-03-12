import { toggleFavorite } from "@/appwrite/databaseActions";
import { useSongs } from "@/context/songsContext";
import { useCurrentUserData } from "@/context/userContext";
import { Heart } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import debounce from "lodash.debounce";

function IsFavoriteHeartComponent() {
  const { user } = useCurrentUserData();
  const { isFavorite, setIsFavorite, currentSongId, currentSong } = useSongs();
  const pendingRequestRef = useRef(false);
  // Store the latest state to ensure we're working with current values
  const currentStateRef = useRef(isFavorite);

  // Create the debounced function (only created once)
  const debouncedApiCall = useRef(
    debounce(async (songId, userId, newState) => {
      if (pendingRequestRef.current) return;

      pendingRequestRef.current = true;
      try {
        const result = await toggleFavorite(songId, userId, currentSong);

        if (result.success) {
          toast(result.message);
        } else {
          // If the API call fails, revert the UI
          setIsFavorite(!newState);
          toast("Couldn't update favorites: " + result.message);
        }
      } catch (error) {
        // Handle any exceptions
        setIsFavorite(!newState);
        toast("Couldn't add to favorite. Sign up to save");
        console.error("Favorite operation failed:", error);
      } finally {
        pendingRequestRef.current = false;
      }
    }, 3) // 300ms debounce time
  ).current;

  const handleFavoriteChange = () => {
    // Immediately update UI (optimistic update)
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
