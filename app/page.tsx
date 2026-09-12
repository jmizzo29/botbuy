import Image from "next/image";
import Link from "next/link";
import { HowItWorksRail } from "@/components/how-it-works";
import { LandInstallButton } from "@/components/land-install-button";
import { ProofStrip } from "@/components/proof-strip";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import {
  BRAND,
  LAND_INSTALL_HELPER,
  LAND_META_LINE,
  LAND_PRODUCT_H1,
} from "@/lib/brand";
import {
  LAND_FINDABILITY,
  MY_DEALS_HREF,
  MY_DEALS_LABEL,
} from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";

export const metadata = {
  title: "BotBuy",
  description: BRAND.signupLine,
};

export default async function LandPage() {
  const signedIn = await hasPublicSession();

  return (
    <PublicChrome land>
      <div className="lg:grid lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-center lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section
          data-surface="land-door"
          className="flex flex-col items-center pt-1 text-center lg:items-start lg:pt-0 lg:text-left"
        >
          <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-[1.65rem] bg-surface shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
            <Image
              src="/brand/botbuy-mark.svg"
              alt=""
              width={56}
              height={56}
              unoptimized
              priority
            />
          </div>
          <h1 className="mt-5 text-[2.75rem] font-semibold tracking-tight md:mt-6 md:text-6xl">
            {LAND_PRODUCT_H1}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/75">
            {LAND_META_LINE}
          </p>
          <p className="mt-3 text-sm text-muted">{BRAND.trustLine}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-8 lg:justify-start">
            {signedIn ? (
              <Button asChild size="lg">
                <Link href={MY_DEALS_HREF} data-cta="land-my-deals">
                  {BRAND.myDealsCta}
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/signup" data-cta="land-signup">
                  {BRAND.primaryCta}
                </Link>
              </Button>
            )}
            <LandInstallButton />
          </div>
          <p className="mt-2 max-w-md text-sm text-muted">
            {LAND_FINDABILITY.replace(MY_DEALS_LABEL, "").trim()}{" "}
            <Link
              href={MY_DEALS_HREF}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {MY_DEALS_LABEL}
            </Link>
          </p>
          <p className="mt-2 max-w-md text-sm text-muted lg:hidden">
            {LAND_INSTALL_HELPER}
          </p>
        </section>
        <aside className="mt-8 lg:mt-0">
          <HowItWorksRail />
          <div className="mt-4">
            <ProofStrip />
          </div>
        </aside>
      </div>
    </PublicChrome>
  );
}
