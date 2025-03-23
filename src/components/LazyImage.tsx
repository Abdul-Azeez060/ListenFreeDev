import { useState } from "react";
import { useInView } from "react-intersection-observer";

const LazyImage = ({
  src,
  alt,
  className: styling,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} className={`relative ${styling} bg-black overflow-hidden`}>
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full bg-gray-800 animate-pulse" />
      )}

      {/* Load image only when in view */}
      {inView && (
        <img
          src={
            src ||
            "https://res.cloudinary.com/djanknlys/image/upload/v1742619937/ListenFreeLogo.jpg"
          }
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default LazyImage;
