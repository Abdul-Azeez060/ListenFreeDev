import React from "react";
import he from "he";
import { Song } from "@/types/music";

function LongNames({ song }: { song: Song }) {
  return (
    <div>
      <h3 className="font-medium text-slate-300">
        {he.decode(song.name).length > 25
          ? he.decode(song.name).slice(0, 25) + "..."
          : he.decode(song.name)}
      </h3>
      <p className="text-sm text-slate-400">
        {song?.artists?.primary?.map((artist) => artist.name).join(", ")
          .length > 25
          ? he.decode(
              song?.artists?.primary
                ?.map((artist) => artist.name)
                .join(", ")
                .slice(0, 25)
            ) + "..."
          : he.decode(
              song?.artists?.primary?.map((artist) => artist.name).join(", ")
            )}
      </p>
    </div>
  );
}

export default LongNames;
