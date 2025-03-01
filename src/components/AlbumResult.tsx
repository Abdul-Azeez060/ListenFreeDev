import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useSearchSongs } from "@/context/searchContext";
import { Album } from "@/types/music";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

function AlbumResult() {
  const { searchSongsResult, setUrl } = useSearchSongs();
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap justify-center  scrollbar-hide mb-32">
      {searchSongsResult?.map((album: Album) => (
        <motion.div
          key={album?.id}
          className="relative group cursor-pointer size-40 md:size-60  mb-16 mx-auto p-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setUrl(album?.url);
            navigate(`/album/${album.id}`);
          }}>
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
          <p className="text-xs text-muted w-[9rem] md:w-[15rem] truncate">
            {album?.year} • {album?.language} •{" "}
            {Array.isArray(album?.artists?.primary)
              ? album?.artists.primary.map((artist) => artist.name).join(", ")
              : "Various Artists"}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export default AlbumResult;
