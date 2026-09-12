"use client";

import { A2hsHowToSheet } from "@/components/a2hs-howto";
import { useA2hs } from "@/components/use-a2hs";
import { BRAND } from "@/lib/brand";

export function LandInstallButton() {
  const { install, howTo, setHowTo, dismiss } = useA2hs();

  return (
    <>
      <button
        type="button"
        data-cta="land-install"
        className="inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
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
