import { useEffect } from "react";

const useSessionReload = () => {
  useEffect(() => {
    if (!sessionStorage.getItem("sessionStarted")) {
      sessionStorage.setItem("sessionStarted", "true");
      window.location.reload(); // Reload on new session
    }
  }, []);
};

export default useSessionReload;
