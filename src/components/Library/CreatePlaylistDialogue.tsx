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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CreatePlaylistDialogue() {
  const { user, setPlaylists } = useCurrentUserData();
  const [creating, setCreating] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>();
  const navigate = useNavigate();
  async function handleCreatePlaylist() {
    setCreating(true);
    const res: any = await createPlaylist(playlistName, user.$id);
    console.log(res, "this is the new playlist");
    if (res.success) {
      const metadata = JSON.parse(localStorage.getItem("PlaylistMetadata"));
      if (metadata) {
        metadata.push({
          $id: res.playlist.$id,
          name: res.playlist.name,
          userId: res.playlist.userId,
        });
        console.log(metadata, "this is metdata");
        localStorage.setItem("PlaylistMetadata", JSON.stringify(metadata));
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
          <Plus className="text-[#12121e]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[350px] sm:max-w-[425px] rounded-md">
        {user ? (
          <>
            {" "}
            <DialogHeader>
              <DialogTitle className="text-[#12121e]">
                {" "}
                Create Playlist
              </DialogTitle>
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
          </>
        ) : (
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg md:text-md font-medium">
              Sign in to create playlist
            </h1>
            <Button
              className=" bg-black"
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
