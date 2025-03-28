import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Home, Search, Library, User, ListMusic } from "lucide-react";
import MiniPlayer from "./MiniPlayer";
import useCustomBackNavigation from "@/lib/BackNavigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Replace the last history entry so "/player/:songId" is not stored
    window.history.replaceState({}, "", location.pathname);

    const handleBack = () => {
      navigate("/search", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [location, navigate]);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  const isPlayerRoute = matchPath("/player/:songId", location.pathname);

  return (
    <div className="h-screen bg-background bg-black  overflow-hidden scrollbar-hide">
      <motion.main
        className="h-screen overflow-y-auto scrollbar-hide bg-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}>
        {children}
      </motion.main>
      <div className="fixed bottom-[3.8rem] w-full z-100 ">
        {!isPlayerRoute && <MiniPlayer />}
      </div>
      {!isPlayerRoute && (
        <nav className="fixed bottom-0  w-full bg-[#E2BBE9] backdrop-blur-lg border-t border-black">
          <div className="flex justify-around  items-center py-3  px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center ${
                    location.pathname === item.path
                      ? "text-[#2f3660]"
                      : "text-gray-500"
                  }`}>
                  <Icon size={22} />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
