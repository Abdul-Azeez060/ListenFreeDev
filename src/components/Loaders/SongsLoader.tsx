const SongsLoader = () => (
  <div className="flex items-center justify-between space-x-4 p-2 bg-gray-800 rounded-lg animate-pulse">
    <div className="flex items-center w-[calc(100vw-5rem)]">
      <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
      <div className="ml-3 space-y-2">
        <div className="w-32 h-4 bg-gray-700 rounded"></div>
        <div className="w-24 h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="w-6 h-6 bg-gray-700 rounded"></div>
  </div>
);

export default SongsLoader;
