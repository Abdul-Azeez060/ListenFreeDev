import { motion } from "framer-motion";

function AlbumLoader() {
  return (
    <>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            className="relative group cursor-pointer size-40 md:size-60 mb-16 mx-auto p-1 animate-pulse"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2 }}>
            {/* Image Placeholder */}
            <div className="relative aspect-square bg-gray-700 rounded-lg overflow-hidden"></div>

            {/* Play Button Placeholder */}
            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
            </div>

            {/* Album Name Placeholder */}
            <div className="mt-2 h-4 bg-gray-600 rounded w-3/4"></div>

            {/* Album Details Placeholder */}
            <div className="mt-1 h-3 bg-gray-600 rounded w-1/2"></div>
          </motion.div>
        ))}
    </>
  );
}

export default AlbumLoader;
