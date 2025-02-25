
import { motion } from "framer-motion";
import { Settings, Music, Clock } from "lucide-react";

const Profile = () => {
  return (
    <div className="container px-4 py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4" />
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-gray-500">john.doe@example.com</p>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Music className="text-accent" />
            <span>Your Music</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Clock className="text-accent" />
            <span>Listening History</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Settings className="text-accent" />
            <span>Settings</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
