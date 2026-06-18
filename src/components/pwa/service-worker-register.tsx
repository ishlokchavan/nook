"use client";

import { useEffect } from "react";

/**
 * Registers the service worker once, after the page is interactive. Rendered
 * near the root so every route gets offline support. No-ops in browsers
 * without service-worker support (and during local dev where it's harmless).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures shouldn't break the app; offline is a bonus.
      });
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
