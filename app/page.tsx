import Link from "next/link";
import { HowItWorksRail } from "@/components/how-it-works";
import { ProofStrip } from "@/components/proof-strip";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import {
  LAND_FINDABILITY,
  MY_DEALS_HREF,
  MY_DEALS_LABEL,
} from "@/lib/cpo-techlux";

export const metadata = {
  title: "BotBuy",
  description: BRAND.signupLine,
};

const HERO_LINES = BRAND.hero.split(/(?<=\.)\s+/);

export default function LandPage() {
  return (
    <PublicChrome land>
      <div className="pt-16 md:pt-24">
        <div className="relative z-10 max-w-xl">
          <h1 className="display text-pretty">
            {HERO_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <span
            aria-hidden="true"
            className="mt-6 block h-0.5 w-16 rounded-full bg-primary"
          />
          <p className="mt-8 max-w-lg text-foreground/80">
            {BRAND.heroSub}
          </p>
          <div className="mt-10 space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">{BRAND.primaryCta}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#how">{BRAND.secondaryCta}</Link>
              </Button>
            </div>
            <p className="text-sm text-muted">{BRAND.trustLine}</p>
            <p className="text-sm text-muted">
              {LAND_FINDABILITY.replace(MY_DEALS_LABEL, "").trim()}{" "}
              <Link
                href={MY_DEALS_HREF}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {MY_DEALS_LABEL}
              </Link>
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-16 md:mt-24">
          <HowItWorksRail />
        </div>
        <div className="relative z-10 mt-16 md:mt-24">
          <ProofStrip />
        </div>
      </div>
    </PublicChrome>
  );
}
