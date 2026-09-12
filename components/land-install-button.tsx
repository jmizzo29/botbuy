"use client";

import { A2hsHowToSheet } from "@/components/a2hs-howto";
import { useA2hs } from "@/components/use-a2hs";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function LandInstallButton() {
  const { install, howTo, setHowTo, dismiss } = useA2hs();

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant="secondary"
        data-cta="land-install"
        onClick={() => void install()}
      >
        {BRAND.secondaryCta}
      </Button>
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
