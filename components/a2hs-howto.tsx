"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND, LAND_META_LINE } from "@/lib/brand";
import {
  A2HS_COPY,
  A2HS_GOT_IT,
  A2HS_HOW,
  A2HS_STEPS,
  A2HS_TITLE,
  LAND_A2HS_COPY,
} from "@/lib/cpo-techlux";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function A2hsHowToSheet({
  onClose,
  onDismiss,
  publicLand = false,
}: {
  onClose: () => void;
  onDismiss: () => void;
  publicLand?: boolean;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50" data-surface="a2hs-howto">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--bb-veil)]"
        aria-label="Close install help"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-[1.15rem] bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6",
          "md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[1.15rem]",
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
            className="h-16 w-16 rounded-2xl bg-[#0B1F3A]"
          />
        </div>
        <p className="mt-4 text-center text-xl font-semibold tracking-tight">
          {A2HS_TITLE}
        </p>
        <p className="mt-2 text-center text-sm text-muted">{A2HS_HOW}</p>
        {publicLand ? (
          <p className="mt-3 text-center text-sm text-muted">{BRAND.trustLine}</p>
        ) : (
          <div className="mt-3 flex justify-center gap-2">
            <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
            <Badge className={DEMO_PILL_CLASS}>{BRAND.trustLine}</Badge>
          </div>
        )}
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
          onClick={onDismiss}
        >
          {A2HS_GOT_IT}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">{LAND_META_LINE}</p>
        <p className="mt-1 text-center text-xs text-muted">
          {publicLand ? LAND_A2HS_COPY : A2HS_COPY}
        </p>
      </div>
    </div>,
    document.body,
  );
}
