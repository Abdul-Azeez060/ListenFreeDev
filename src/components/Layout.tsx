import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Home, Search, Library, User } from "lucide-react";
import MiniPlayer from "./MiniPlayer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Store original pushState function

    // Override browser's back button behavior
    const handlePopState = (event) => {
      // Prevent default back navigation
      event.preventDefault();

      // Navigate to search page instead
      if (location.pathname.startsWith("/player/")) {
        navigate("/search"); // Redirect to search instead of navigating back
      } else {
        navigate(-1); // Navigate to previous page normally
      }
    };

    // Add custom event listener for back button
    window.addEventListener("popstate", handlePopState);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  const isPlayerRoute = matchPath("/player/:songId", location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <motion.main
        className="pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}>
        {children}
      </motion.main>
      <div className="fixed bottom-16 w-full z-100 ">
        {!isPlayerRoute && <MiniPlayer />}
      </div>
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200">
        <div className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 ${
                  location.pathname === item.path
                    ? "text-accent"
                    : "text-gray-500"
                }`}>
                <Icon size={24} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
