import { useSearchSongs } from "@/context/searchContext";
import { Song } from "@/types/music";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
function ArtistResult() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchSongsResult } = useSearchSongs();
  return (
    <>
      {searchSongsResult.map((artist: Song) => (
        <motion.div
          key={artist.id}
          className="flex items-center justify-between space-x-4 p-2 hover:text-black hover:bg-muted rounded-lg cursor-pointer"
          whileHover={{ scale: 1.01 }}>
          <div
            className="flex items-center w-[calc(100vw-5rem)]"
            onClick={() => {
              navigate(`/player/${artist.id}`);
            }}>
            <img
              src={artist.image[2].url}
              alt={artist.name}
              className="w-12 mr-3 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium  text-slate-300">{artist.name}</h3>
              <p className="text-sm text-muted">
                {Array.isArray(artist.primaryArtists)
                  ? artist.primaryArtists.join(", ")
                  : artist.primaryArtists}
              </p>
            </div>
          </div>
          <div></div>
        </motion.div>
      ))}
    </>
  );
}

export default ArtistResult;
