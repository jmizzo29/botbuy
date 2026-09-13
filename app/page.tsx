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
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function LandPage() {
  await redirectSignedInFromLand();

  return (
    <PublicChrome land>
      <section data-surface="land-stage" className="bb-land-stage">
        <div data-zone="watermark" className="bb-land-watermark" aria-hidden="true">
          <Image
            src={LAND_SKY_MARK_SRC}
            alt=""
            width={280}
            height={280}
            unoptimized
            preload
            aria-hidden="true"
            className="bb-mark-watermark"
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
