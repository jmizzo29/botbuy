import Link from "next/link";
import { ProofStrip } from "@/components/proof-strip";
import { PublicChrome } from "@/components/public-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "BotBuy",
  description: BRAND.signupLine,
};

export default function LandPage() {
  return (
    <PublicChrome>
      <div className="space-y-10 pt-10 md:pt-16">
        <Badge className="bg-amber-500/10 text-amber-100 ring-amber-400/35">
          {BRAND.pocBanner}
        </Badge>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {BRAND.origin} · {BRAND.registration}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-pretty sm:text-6xl">
          {BRAND.hero}
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-zinc-300">
          {BRAND.heroSub}
        </p>
        <div className="max-w-lg space-y-1 text-sm text-zinc-400">
          <p>{BRAND.easeMicro}</p>
          <p>{BRAND.channelMicro}</p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">{BRAND.primaryCta}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#how">{BRAND.secondaryCta}</Link>
            </Button>
          </div>
          <p className="text-sm text-zinc-400">{BRAND.trustLine}</p>
        </div>
        <section id="how" className="max-w-lg scroll-mt-8 space-y-3">
          <h2 className="text-lg font-medium tracking-tight">How it works</h2>
          <ol className="space-y-2 text-sm leading-relaxed text-zinc-400">
            <li>
              <span className="text-zinc-200">Set spend.</span> Your limit.
              BotBuy stays inside it.
            </li>
            <li>
              <span className="text-zinc-200">Set intent.</span> Any software,
              any channel.
            </li>
            <li>
              <span className="text-zinc-200">Vault it.</span> Then BotBuy
              searches, purchases, and closes.
            </li>
          </ol>
        </section>
        <ProofStrip />
      </div>
    </PublicChrome>
  );
}
