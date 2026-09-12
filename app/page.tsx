import Image from "next/image";
import Link from "next/link";
import { LandInstallButton } from "@/components/land-install-button";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import {
  BRAND,
  LAND_ARC_LABEL,
  LAND_ARC_SRC,
  LAND_META_LINE,
  LAND_PRODUCT_H1,
  LAND_PRODUCT_SUPPORT,
} from "@/lib/brand";
import { redirectSignedInFromLand } from "@/lib/land-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: BRAND.name,
  description: BRAND.signupLine,
};

export default async function LandPage() {
  await redirectSignedInFromLand();

  return (
    <PublicChrome land>
      <section data-surface="land-stage" className="bb-land-stage">
        <div className="bb-land-stage-grid">
          <div className="bb-land-copy">
            <h1 className="bb-land-h1">
              {LAND_PRODUCT_H1}
            </h1>
            <p className="bb-land-support">
              {LAND_PRODUCT_SUPPORT}
            </p>
            <p className="bb-land-meta">
              {LAND_META_LINE}
            </p>
            <div className="bb-land-cta flex w-full flex-col items-center gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-x-5">
              <Button asChild size="lg" className="w-full lg:w-auto">
                <Link href="/signup" data-cta="land-signup">
                  {BRAND.primaryCta}
                </Link>
              </Button>
              <LandInstallButton tone="onDark" />
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
