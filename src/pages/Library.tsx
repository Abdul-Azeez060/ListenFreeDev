import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const Library = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="container px-4 py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-bold">Your Library</h1>
        <button
          className="p-2 rounded-full bg-accent text-white"
          onClick={() => setIsOpen(true)}>
          <Plus />
        </button>
      </motion.div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl text-white font-semibold mb-4">
            Your Playlists
          </h2>
          <div className="grid gap-4">
            {/* Playlist items will go here */}
            <div
              className="p-4 rounded-lg border border-gray-200 hover:border-accent transition-colors"
              onClick={() => {}}>
              <h3 className="font-medium text-white">Create New Playlist</h3>
              <p className="text-sm text-gray-500">Add your favorite songs</p>
            </div>
          </div>
        </section>

        <div className="">
          <h2 className="text-white">Pop up</h2>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Your Playlists
          </h2>
          <div className="grid gap-4">
            {/* Playlist items will go here */}
            <h1>hi how ar </h1>
            <div className="p-4 rounded-lg border border-gray-200 hover:border-accent transition-colors">
              <h3 className="font-medium text-white">Create New Playlist</h3>
              <p className="text-sm text-gray-500">Add your favorite songs</p>
            </div>
          </div>
        </section>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5">
          <div className="bg-black p-6 rounded-lg shadow-lg w-96 text-center border border-slate-100">
            <h2 className="text-lg font-semibold text-white">
              Create a playlist
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
