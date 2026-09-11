"use client";

import { useEffect } from "react";

function markStandalone() {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
  document.documentElement.classList.toggle("bb-standalone", standalone);
  document.documentElement.dataset.standalone = standalone ? "true" : "false";
}

export function PwaRegister() {
  useEffect(() => {
    markStandalone();
    const media = window.matchMedia("(display-mode: standalone)");
    const onChange = () => markStandalone();
    media.addEventListener("change", onChange);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .catch(() => {
        // Installability still works via manifest if SW registration fails.
      });
    }

    return () => media.removeEventListener("change", onChange);
  }, []);

  return null;
}
