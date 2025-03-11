import { useRef, useState, useEffect } from "react";
import he from "he";

const ScrollingText = ({ text, className }) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setShouldScroll(textWidth > containerWidth);
    }
  }, [text]);

  // Safely decodes &quot; → "

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative w-full">
      <div
        ref={textRef}
        className={`inline-block px-4 ${
          shouldScroll ? "animate-marquee" : ""
        } ${className}`}>
        {he.decode(text)}
      </div>
    </div>
  );
};

export default function SongDetails({ currentSong }) {
  return (
    <div className="text-center space-y-2">
      {/* Scrolling Title */}
      <ScrollingText
        text={currentSong?.name}
        className="text-2xl text-white font-bold text-primary"
      />

      {/* Scrolling Artist Names */}
      <ScrollingText
        text={currentSong?.artists.primary
          ?.map((artist) => artist.name)
          .join(", ")}
        className="text-white"
      />
    </div>
  );
}

function decodeHtmlEntities(html: string): string {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
}

// Example usage:
const songTitle = `Tum Kya Mile - Pritam' s Version (From &quot;Rocky Aur Rani Kii Prem Kahaani&quot;)`;
const decodedTitle = decodeHtmlEntities(songTitle);

console.log(decodedTitle);
// Output: Tum Kya Mile - Pritam' s Version (From "Rocky Aur Rani Kii Prem Kahaani")
