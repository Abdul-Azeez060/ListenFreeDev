import { addSongToPlaylist } from "@/appwrite/databaseActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUserData } from "@/context/userContext";
import { ListPlus, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AddToPlaylist({ songId }) {
  const [loading, setIsLoading] = useState(false);
  const [currentPlaylistId, setPlaylistId] = useState<string>();
  const { playlists } = useCurrentUserData();
  const { user } = useCurrentUserData();
  const navigate = useNavigate();

  async function handleAddPlaylist(playlistId: string) {
    setPlaylistId(playlistId);
    setIsLoading(true);
    // console.log(playlists, "these re the playlist ");
    // console.log(songId, "this is the songId in the add to playoist");
    // console.log("button clicked");
    const res = await addSongToPlaylist(songId, playlistId);
    if (res.success) {
      toast("Song added to the playlist ");
      const playlist: any[] = JSON.parse(
        localStorage.getItem(`playlist:${playlistId}`)
      );
      playlist.push(songId);
      localStorage.setItem(`playlist:${playlistId}`, JSON.stringify(playlist));
    } else {
      console.log(res.error);
      if (res.error.type == "document_already_exits") {
        toast("Song already exits");
      }
      if (res.error) toast(`Could not add song ${res.error.type}`);
    }
    setIsLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative top-1">
          <ListPlus className="text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[380px] rounded-md bg-black sm:max-w-[425px]">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">
                Select the playlist based on your mood
              </DialogTitle>
              <DialogDescription className="text-white">
                Add songs
              </DialogDescription>
            </DialogHeader>

            {playlists.map((playlist: any) => (
              <div
                className="p-2 bg-black mt-2 rounded-md flex justify-between items-center"
                key={playlist.$id}>
                <h2 className=" text-white text-lg px-2">{playlist.name}</h2>
                <button
                  className="bg-[#E2BBE9] p-1 rounded-md"
                  onClick={() => handleAddPlaylist(playlist.$id)}
                  disabled={loading}>
                  {loading && playlist.$id == currentPlaylistId ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex justify-between w-full items-center">
            <h1 className="text-sm md:text-md font-medium text-slate-200">
              Sign in to add to playlist
            </h1>
            <Button
              className="bg-slate-200 text-black"
              onClick={() => {
                navigate("/profile");
              }}>
              Sign in
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
