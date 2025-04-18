import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useSearchSongs } from "@/context/searchContext";
import { Album } from "@/types/music";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import AlbumComponent from "./AlbumComponent";

function AlbumResult({isLoading}) {
  return (
    <div className="flex flex-wrap justify-center  scrollbar-hide mb-32">
      <AlbumComponent isLoading={isLoading}  />
    </div>
  );
}

export default AlbumResult;
