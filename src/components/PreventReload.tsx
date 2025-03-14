import { useEffect } from "react";

const usePreventPullToRefresh = () => {
  useEffect(() => {
    let startY = 0;
    let isAtTop = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isAtTop = window.scrollY === 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isAtTop && e.touches[0].clientY > startY) {
        e.preventDefault(); // Block pull-to-refresh only when at the top
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Efficiently prevent pull-to-refresh using CSS
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);
};

export default usePreventPullToRefresh;
