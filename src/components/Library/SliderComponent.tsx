import { useSongs } from "@/context/songsContext";
import { Slider } from "@/components/ui/slider";
import React, { useCallback, useState } from "react";
import { debounce } from "lodash";

function SliderComponent() {
  const { audioRef } = useSongs();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle time updates
  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(audioRef?.current?.currentTime);
    setDuration(audioRef?.current?.duration);
  }, [audioRef?.current?.currentTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const seekTo = (value) => {
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
  };

  const handleDurationUpdate = useCallback(
    () => setDuration(audioRef.current.duration),
    [audioRef?.current?.duration]
  );

  audioRef?.current?.addEventListener("timeupdate", handleTimeUpdate);
  audioRef?.current?.addEventListener("ondurationchange", handleDurationUpdate);

  return (
    <div className="space-y-2">
      <Slider
        value={[currentTime ? (currentTime / duration) * 100 : 0]}
        onValueChange={(newValue) => seekTo(newValue[0])}
        max={100}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-sm  text-white">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default SliderComponent;
