import type { Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import { CLERK_SIGN_IN_URL } from "@/lib/auth-config";
import {
  BRAND,
  LAND_PRODUCT_H1,
  LAND_PRODUCT_SUPPORT,
  LAND_SKY_MARK_SRC,
  SIGN_IN_H1,
} from "@/lib/brand";
import { redirectSignedInFromLand } from "@/lib/land-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: BRAND.name,
  description: LAND_PRODUCT_SUPPORT,
  openGraph: {
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    images: [
      {
        url: "/brand/logo-soft-spine/og/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    images: ["https://botbuyer.ai/brand/logo-soft-spine/og/og-1200x630.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function LandPage() {
  await redirectSignedInFromLand();

  return (
    <PublicChrome land>
      <section data-surface="land-stage" className="bb-land-stage">
        <div
          className="bb-land-atm atm bb-atm-richer-mesh-deep"
          aria-hidden="true"
        />
        <div data-zone="sky" className="bb-land-sky">
          <Image
            src={LAND_SKY_MARK_SRC}
            alt=""
            width={148}
            height={148}
            unoptimized
            preload
            aria-hidden="true"
            className="bb-mark-hero"
          />
        </div>
        <div data-zone="panel" className="bb-land-panel">
          <div className="bb-land-copy">
            <h1 className="bb-land-h1">{LAND_PRODUCT_H1}</h1>
            <p className="bb-land-support">{LAND_PRODUCT_SUPPORT}</p>
          </div>
          <div className="bb-land-cta">
            <Button asChild className="bb-land-signup">
              <Link href="/signup" data-cta="land-signup">
                {BRAND.primaryCta}
              </Link>
            </Button>
            <Link
              href={CLERK_SIGN_IN_URL}
              data-cta="land-signin"
              className="bb-land-signin"
            >
              {SIGN_IN_H1}
            </Link>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
