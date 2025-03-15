import { useEffect } from "react";

const usePreventPullToRefresh = () => {
  useEffect(() => {
    let lastTouchY = 0;

    const preventSwipeReload = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;

      // If user swipes down while at the top of the page, prevent refresh
      if (touchY - lastTouchY > 1 && window.scrollY === 0) {
        e.preventDefault(); // Stops pull-to-refresh
      }

      lastTouchY = touchY;
    };

    document.addEventListener("touchmove", preventSwipeReload, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventSwipeReload);
    };
  }, []);
};

export default usePreventPullToRefresh;
