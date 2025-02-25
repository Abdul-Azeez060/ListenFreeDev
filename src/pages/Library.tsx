
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const Library = () => {
  return (
    <div className="container px-4 py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button className="p-2 rounded-full bg-accent text-white">
          <Plus />
        </button>
      </motion.div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
          <div className="grid gap-4">
            {/* Playlist items will go here */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-accent transition-colors">
              <h3 className="font-medium">Create New Playlist</h3>
              <p className="text-sm text-gray-500">Add your favorite songs</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
          <div className="grid gap-4">
            {/* Recently played items will go here */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
