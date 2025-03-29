import LoginButton from "@/appwrite/LoginButton";
import LogOutButton from "@/appwrite/LogOutButton";
import usePreventPullToRefresh from "@/components/PreventReload";
import { useCurrentUserData } from "@/context/userContext";
import { motion } from "framer-motion";
import { Settings, Music, Clock } from "lucide-react";
import InstallPWA from "@/components/InstallPwa";

const Profile = () => {
  const { user } = useCurrentUserData();

  usePreventPullToRefresh();

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen text-center px-6">
        <div className="p-4 max-w-md">
          <h1 className="text-white text-3xl font-semibold">
            Your Music, Your Favorites, Your Way! 🎶
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            We only store your{" "}
            <span className="font-medium text-white">name and email</span> to
            save your favorites and playlists—nothing more! No tracking, no
            extra data. Just music. 🎧
          </p>
          <p className="text-slate-400 mt-2">
            Your privacy matters. You can trust us. 🔒
          </p>
        </div>
        <LoginButton />
<InstallPWA />
      </div>
    );
  } else {
    return (
      <div className="container px-4 py-6 space-y-8 bg-[#12121e]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center">
          <div className="w-24 text-6xl h-24 align-middle mx-auto p-4 rounded-full bg-gray-200 mb-4">
            <span className="w-full h-full">{user.name.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <Music className="text-black" />
              <span>Your Music</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <Clock className="text-black" />
              <span>Listening History</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <Settings className="text-black" />
              <span>Settings</span>
            </div>
          </motion.div>
          <div className="flex justify-center">
            <LogOutButton />
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
