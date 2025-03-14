const SongLoader = () => (
  <div className="relative flex flex-col items-center cursor-pointer">
    <div className="aspect-square rounded-lg overflow-hidden size-36 md:size-60 mx-2 bg-gray-700 animate-pulse" />
    <h3 className="mt-2 w-[9rem] md:w-[15rem] h-4 bg-gray-700 animate-pulse rounded-md" />
    <p className="mt-1 w-20 h-3 bg-gray-700 animate-pulse rounded-md" />
  </div>
);

export default SongLoader;
