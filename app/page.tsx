import type { Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import { CLERK_SIGN_IN_URL } from "@/lib/auth-config";
import {
  BRAND,
  LAND_ARC_LABEL,
  LAND_ARC_SRC,
  LAND_PRODUCT_H1,
  LAND_PRODUCT_SUPPORT,
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
      <section data-surface="land-stage" className="bb-land-stage bb-atm-mesh-glow">
        <div className="bb-land-stage-grid">
          <div className="bb-land-copy">
            <h1 className="bb-land-h1">
              {LAND_PRODUCT_H1}
            </h1>
            <p className="bb-land-support">
              {LAND_PRODUCT_SUPPORT}
            </p>
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
          <div className="bb-land-arc">
            <Image
              src={LAND_ARC_SRC}
              alt={LAND_ARC_LABEL}
              width={280}
              height={72}
              unoptimized
              preload
              className="h-auto w-full max-w-[20rem]"
            />
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
