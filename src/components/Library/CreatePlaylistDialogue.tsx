import { createPlaylist } from "@/appwrite/databaseActions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserData } from "@/context/userContext";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreatePlaylistDialogue() {
  const { user, setPlaylists } = useCurrentUserData();
  const [creating, setCreating] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>();
  async function handleCreatePlaylist() {
    setCreating(true);
    const res: any = await createPlaylist(playlistName, user.$id);
    if (res.success) {
      const metadata = JSON.parse(localStorage.getItem("PlaylistMetadata"));
      if (metadata) {
        metadata.push({
          id: res.playlist.$id,
          name: res.playlist.name,
          userId: res.playlist.userId,
        });
        setPlaylists(metadata);
        setPlaylistName("");
        toast("Playlist Created Successfully 🔥");
      }
    } else {
      toast("Couldn't create Playlist 😬");
      console.log(res);
    }
    setCreating(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {" "}
          Create Playlist
          <Plus className="text-[#12121e]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#12121e]"> Create Playlist</DialogTitle>
          <DialogDescription>
            Enter the name of your playlist 😊
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3 text-[#12121e]"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreatePlaylist}
            disabled={creating}>
            {creating ? (
              <span className="animate-spin">
                <Loader2 />
              </span>
            ) : (
              "Launch 🚀"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
