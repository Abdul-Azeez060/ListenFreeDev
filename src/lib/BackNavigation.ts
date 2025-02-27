import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useCustomBackNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault(); // Prevent default back behavior

      // If the previous page is a `/player/:songId`, skip it
      if (location.pathname.startsWith("/player/")) {
        navigate("/search", { replace: true }); // Redirect to search
      } else {
        navigate(-1); // Otherwise, go back normally
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location, navigate]);
};

export default useCustomBackNavigation;
