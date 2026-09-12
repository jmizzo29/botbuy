import Image from "next/image";
import Link from "next/link";
import { HowItWorksRail } from "@/components/how-it-works";
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
      <div className="lg:grid lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-center lg:gap-16 xl:gap-20">
        <section
          data-surface="land-door"
          className="flex flex-col items-start text-left"
        >
          <h1 className="max-w-xl text-[2.75rem] font-semibold tracking-tight md:text-6xl">
            {LAND_PRODUCT_H1}
          </h1>
          <span
            aria-hidden="true"
            className="mt-5 block h-0.5 w-12 rounded-full bg-primary"
          />
          <p className="mt-5 max-w-lg text-xl font-medium tracking-tight text-muted md:text-2xl">
            {LAND_PRODUCT_SUPPORT}
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/75">
            {LAND_META_LINE}
          </p>
          <div className="mt-8 w-full max-w-sm">
            <Image
              src={LAND_ARC_SRC}
              alt={LAND_ARC_LABEL}
              width={320}
              height={72}
              unoptimized
              preload
              className="h-auto w-full"
            />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Button asChild size="lg">
              <Link href="/signup" data-cta="land-signup">
                {BRAND.primaryCta}
              </Link>
            </Button>
            <LandInstallButton />
          </div>
          <p className="mt-5 text-xs text-muted">{BRAND.landHonesty}</p>
        </section>
        <aside className="mt-12 lg:mt-0">
          <HowItWorksRail />
        </aside>
      </div>
    </PublicChrome>
  );
}
