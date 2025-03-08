import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DialogDemo from "@/components/ui/create-playlist-popup";

const Library = () => {
  return (
    <div className="container px-4 py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-bold">Your Library</h1>
        <button className="p-2 rounded-full bg-accent text-white">
          <Plus />
        </button>
      </motion.div>

      <div className="space-y-6 ">
        <section className="w-full">
          <h2 className="text-xl text-white font-semibold mb-4">
            Join a Space
          </h2>

          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" className="text-muted" placeholder="Space Id" />
            <Button
              type="submit"
              className="bg-white text-black hover:bg-green-300">
              Join
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Create a Space
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
    </div>
  );
};

export default Library;
