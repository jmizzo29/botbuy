"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export const A2HS_DISMISS_KEY = "bb-a2hs-dismissed";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function subscribeNoop() {
  return () => {};
}

export function persistDismiss() {
  try {
    localStorage.setItem(A2HS_DISMISS_KEY, "1");
  } catch {
    /* quota / private mode */
  }
}

export function dismissedSnapshot() {
  if (isStandaloneDisplay()) return true;
  try {
    return localStorage.getItem(A2HS_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function useA2hs() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);
  const [howTo, setHowTo] = useState(false);
  const hidden = useSyncExternalStore(
    subscribeNoop,
    dismissedSnapshot,
    () => true,
  );

  useEffect(() => {
    if (dismissedSnapshot()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice.catch(() => ({
          outcome: "dismissed" as const,
        }));
        setDeferred(null);
        if (choice.outcome === "accepted") {
          setDismissed(true);
          persistDismiss();
          return;
        }
      } catch {
        setDeferred(null);
      }
    }
    setHowTo(true);
  }

  function dismiss() {
    setHowTo(false);
    setDismissed(true);
    persistDismiss();
  }

  return {
    deferred,
    dismissed,
    howTo,
    hidden,
    install,
    dismiss,
    setHowTo,
  };
}
