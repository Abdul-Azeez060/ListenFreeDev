import React, { useState, useEffect } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show button if the user hasn't installed or dismissed before
      if (!localStorage.getItem("pwa-dismissed")) {
        setShowButton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Remind user every 30 seconds if they haven't installed
  useEffect(() => {
    if (showButton) {
      const interval = setInterval(() => {
        if (
          !localStorage.getItem("pwa-installed") &&
          !localStorage.getItem("pwa-dismissed")
        ) {
          setShowButton(true);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [showButton]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User installed the app");
          localStorage.setItem("pwa-installed", "true");
          setShowButton(false);
        } else {
          console.log("User dismissed the install prompt");
          localStorage.setItem("pwa-dismissed", "true");
        }
      });
    }
  };

  return (
    true && (
      <button
        onClick={handleInstallClick}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#000000",
          color: "white",
          padding: "12px 16px",
          borderRadius: "50px",
          fontSize: "16px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}>
        📥 Install App
      </button>
    )
  );
};

export default InstallPWA;
