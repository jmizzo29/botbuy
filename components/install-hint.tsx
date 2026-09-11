"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  A2HS_ACTION,
  A2HS_COPY,
  A2HS_IOS,
} from "@/lib/cpo-techlux";
import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "bb-a2hs-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function appHasBottomNav(pathname: string) {
  return /^(?:\/home|\/deals|\/intent|\/vault|\/settings|\/agents|\/admin)(?:\/|$)/.test(
    pathname,
  );
}

function subscribeNoop() {
  return () => {};
}

function iosHintSnapshot() {
  if (isStandaloneDisplay()) return false;
  if (sessionStorage.getItem(DISMISS_KEY) === "1") return false;
  return isIosDevice();
}

export function InstallHint() {
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);
  const iosHint = useSyncExternalStore(
    subscribeNoop,
    iosHintSnapshot,
    () => false,
  );

  useEffect(() => {
    if (isStandaloneDisplay()) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const open = !dismissed && (deferred !== null || iosHint);
  if (!open) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  return (
    <div
      role="status"
      className={cn(
        "fixed inset-x-3 z-30 rounded-[var(--bb-radius)] bg-surface/95 px-3 py-3 backdrop-blur",
        SURFACE_RING_CLASS,
        appHasBottomNav(pathname)
          ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-4"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <p className="text-xs leading-relaxed text-muted">
        {deferred ? A2HS_COPY : A2HS_IOS}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {deferred ? (
          <Button type="button" size="sm" onClick={() => void install()}>
            {A2HS_ACTION}
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
