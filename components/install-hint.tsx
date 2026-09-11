"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND, LAND_META_LINE } from "@/lib/brand";
import {
  A2HS_ACTION,
  A2HS_BAR_SUB,
  A2HS_BAR_TITLE,
  A2HS_COPY,
  A2HS_GOT_IT,
  A2HS_HOW,
  A2HS_STEPS,
  A2HS_TITLE,
} from "@/lib/cpo-techlux";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
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

function subscribeNoop() {
  return () => {};
}

function persistDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* quota / private mode */
  }
}

function dismissedSnapshot() {
  if (isStandaloneDisplay()) return true;
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function InstallHint() {
  const pathname = usePathname();
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

  const open = !dismissed && !hidden;
  if (!open) return null;

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

  const onLand = pathname === "/";

  return (
    <>
      <div
        role="status"
        data-surface="a2hs"
        className={cn(
          "md:hidden",
          onLand
            ? "fixed inset-x-3 z-30 bottom-[max(1rem,env(safe-area-inset-bottom))]"
            : "px-4 pb-1 pt-2",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-[var(--bb-radius)] bg-surface px-3 py-2.5",
            SURFACE_RING_CLASS,
          )}
        >
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-[0.7rem] bg-foreground"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium tracking-tight">{A2HS_BAR_TITLE}</p>
            <p className="text-xs text-muted">{A2HS_BAR_SUB}</p>
          </div>
          <Button type="button" size="sm" className="min-h-11" onClick={() => void install()}>
            {A2HS_ACTION}
          </Button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted"
            aria-label="Dismiss install"
            onClick={dismiss}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {howTo && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 md:hidden" data-surface="a2hs-howto">
              <button
                type="button"
                className="absolute inset-0 bg-[var(--bb-veil)]"
                aria-label="Close install help"
                onClick={() => setHowTo(false)}
              />
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-t-[1.15rem] bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6",
                  SURFACE_RING_CLASS,
                )}
              >
                <div className="flex justify-center">
                  <Image
                    src="/icons/icon-192.png"
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-2xl bg-foreground"
                  />
                </div>
                <p className="mt-4 text-center text-xl font-semibold tracking-tight">
                  {A2HS_TITLE}
                </p>
                <p className="mt-2 text-center text-sm text-muted">{A2HS_HOW}</p>
                <div className="mt-3 flex justify-center gap-2">
                  <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
                  <Badge className={DEMO_PILL_CLASS}>{BRAND.trustLine}</Badge>
                </div>
                <ol className="mt-5 space-y-3">
                  {A2HS_STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-xs">
                        {index + 1}
                      </span>
                      <span>
                        <span className="font-medium">{step.title}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Button
                  type="button"
                  size="lg"
                  className="mt-5 min-h-11 w-full"
                  onClick={dismiss}
                >
                  {A2HS_GOT_IT}
                </Button>
                <p className="mt-3 text-center text-xs text-muted">
                  {LAND_META_LINE}
                </p>
                <p className="mt-1 text-center text-xs text-muted">{A2HS_COPY}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
