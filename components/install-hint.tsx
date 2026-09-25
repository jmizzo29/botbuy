"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { A2hsHowToSheet } from "@/components/a2hs-howto";
import { useA2hs } from "@/components/use-a2hs";
import { Button } from "@/components/ui/button";
import {
  A2HS_ACTION,
  A2HS_BAR_SUB,
  A2HS_BAR_TITLE,
} from "@/lib/cpo-techlux";
import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function InstallHint() {
  const pathname = usePathname();
  const { dismissed, hidden, howTo, install, dismiss, setHowTo } = useA2hs();
  const onLand = pathname === "/";
  const onAuth =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/signin/") ||
    pathname.startsWith("/signup/");

  if (onLand) return null;
  if (onAuth) return null;

  const open = !dismissed && !hidden;
  if (!open && !howTo) return null;

  return (
    <>
      {open ? (
        <div
          role="status"
          data-surface="a2hs"
          className="px-4 pb-1 pt-2 md:hidden"
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-[var(--bb-radius)] bg-surface px-3 py-2.5",
              SURFACE_RING_CLASS,
            )}
          >
            <Image
              src="/brand/logo-soft-spine/app-icon/icon-192.png"
              alt="BotBuyer"
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 rounded-[0.7rem] bg-[#0B1F3A]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium tracking-tight">
                {A2HS_BAR_TITLE}
              </p>
              <p className="text-xs text-muted">{A2HS_BAR_SUB}</p>
            </div>
            <Button
              type="button"
              size="sm"
              className="min-h-11"
              onClick={() => void install()}
            >
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
      ) : null}
      {howTo ? (
        <A2hsHowToSheet
          onClose={() => setHowTo(false)}
          onDismiss={dismiss}
        />
      ) : null}
    </>
  );
}
