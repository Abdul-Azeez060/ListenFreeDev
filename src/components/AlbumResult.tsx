import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useSearchSongs } from "@/context/searchContext";

function AlbumResult() {
  const { searchSongsResult } = useSearchSongs();
  return (
    <>
      {searchSongsResult?.map((album: any) => (
        <motion.div
          key={album?.id}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={album?.image[2].url}
              alt={album?.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium truncate text-white">
            {album?.name}
          </h3>
          <p className="text-xs text-muted">
            {Array.isArray(album?.artists.primaryArtists)
              ? album?.artists.primaryArtists
                  .map((artist) => artist.name)
                  .join(", ")
              : album?.artists.primaryArtists}
          </p>
        </motion.div>
      ))}
    </>
  );
}

export default AlbumResult;
