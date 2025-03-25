import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useCurrentUserData } from "@/context/userContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertDescription } from "../ui/alert";
import { deletePlaylist } from "@/appwrite/databaseActions";
export function DeletePlaylistDialogue({ playlistId }: { playlistId: string }) {
  const { user } = useCurrentUserData();
  const navigate = useNavigate();
  async function handlePlaylistDelete() {
    if (!user) {
      toast(
        <div className="flex justify-between w-full items-center">
          <h1 className="text-sm md:text-md font-medium">
            Sign in to delete playlist
          </h1>
          <Button
            className=" bg-slate-500/90"
            onClick={() => {
              navigate("/profile");
            }}>
            Sign in
          </Button>
        </div>
      );

      return;
    }

    const res = await deletePlaylist(playlistId);
    if (res.success) {
      toast("Playlist Deleted Successfully");
    } else {
      toast("Couldn't delete playlist");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-slate-200 text-black">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to download this song?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDescription>
          this will be downloaded in your local device.
        </AlertDescription>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handlePlaylistDelete}
            className=" bg-slate-500/90">
            {" "}
            Yes
          </AlertDialogAction>

          <AlertDialogCancel>No</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
