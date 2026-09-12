"use client";

import { A2hsHowToSheet } from "@/components/a2hs-howto";
import { useA2hs } from "@/components/use-a2hs";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function LandInstallButton({
  tone = "default",
}: {
  tone?: "default" | "onDark";
}) {
  const { install, howTo, setHowTo, dismiss } = useA2hs();
  const onDark = tone === "onDark";

  return (
    <>
      <button
        type="button"
        data-cta="land-install"
        className={cn(
          "inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline",
          onDark
            ? "text-white/55 hover:text-white"
            : "text-muted hover:text-foreground",
        )}
        onClick={() => void install()}
      >
        {BRAND.installLink}
      </button>
      {howTo ? (
        <A2hsHowToSheet
          publicLand
          onClose={() => setHowTo(false)}
          onDismiss={dismiss}
        />
      ) : null}
    </>
  );
}
