import Link from "next/link";
import { HowItWorksRail } from "@/components/how-it-works";
import { ProofStrip } from "@/components/proof-strip";
import { PublicChrome } from "@/components/public-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: "BotBuy",
  description: BRAND.signupLine,
};

export default function LandPage() {
  return (
    <PublicChrome>
      <div className="pt-16 md:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge className={DEMO_PILL_CLASS}>{BRAND.pocBanner}</Badge>
            <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-muted/45">
              {BRAND.origin} · {BRAND.registration}
            </p>
            <h1 className="display mt-8 max-w-xl text-pretty">
              {BRAND.hero}
            </h1>
            <p className="mt-8 max-w-lg text-foreground/80">
              {BRAND.heroSub}
            </p>
            <div className="mt-6 max-w-lg space-y-1 text-muted">
              <p>{BRAND.easeMicro}</p>
              <p>{BRAND.channelMicro}</p>
            </div>
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
            </div>
          </div>
          <HowItWorksRail />
        </div>
        <div className="mt-16 md:mt-24">
          <ProofStrip />
        </div>
      </div>
    </PublicChrome>
  );
}
