import React from "react";
import { useSearchSongs } from "@/context/searchContext";
import { Playlist, Song } from "@/types/music";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle } from "lucide-react";
import { useSongs } from "@/context/songsContext";
import AlbumLoader from "./Loaders/AlbumLoader";
function PlaylistResult({ isLoading }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchSongsResult, setUrl } = useSearchSongs();

  return (
    <div className="flex flex-wrap justify-around items-center mb-32 scrollbar-hide  ">
      {isLoading ? (
        <AlbumLoader />
      ) : (
        searchSongsResult?.map((playlist: Playlist) => (
          <motion.div
            key={playlist?.id}
            className="relative group cursor-pointer size-40 md:size-60 p-1 mb-14 "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setUrl(playlist.url);
              navigate(`/playlist/${playlist.id}`);
            }}>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={
                  playlist?.image[2].url ||
                  playlist?.image[1].url ||
                  playlist?.image[0].url
                }
                alt={playlist?.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h3 className="mt-2 text-sm font-medium truncate text-white">
              {playlist?.name}
            </h3>
            <p className="text-xs text-muted w-[9rem] md:w-[15rem] truncate">
              {playlist?.language} • {playlist?.songCount} songs
            </p>
          </motion.div>
        ))
      )}
    </div>
  );
}

export default PlaylistResult;
