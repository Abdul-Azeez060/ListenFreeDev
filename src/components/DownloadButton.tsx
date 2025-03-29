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
import { Song } from "@/types/music";
import { Download } from "lucide-react";
import { AlertDescription } from "./ui/alert";
import { useCurrentUserData } from "@/context/userContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export function DownloadButton({ currentSong }: { currentSong: Song }) {
  const { user } = useCurrentUserData();
  const navigate = useNavigate();
  async function handleSongDownload() {
    if (!user) {
      toast(
        <div className="flex justify-between w-full items-center">
          <h1 className="text-sm md:text-md font-medium">
            Sign in to download
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
    try {
  const url = currentSong.downloadUrl[4].url;
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `${currentSong.name || "download"}`; // Set filename with .mp4 extension
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup the blob URL
  URL.revokeObjectURL(blobUrl);
} catch (error) {
  console.log(error);
}


  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-transparent">
          <Download size={24} />
        </Button>
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
            onClick={handleSongDownload}
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
