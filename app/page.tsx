import Link from "next/link";
import { ProofStrip } from "@/components/proof-strip";
import { PublicChrome } from "@/components/public-chrome";
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
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {BRAND.origin} · {BRAND.registration}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-pretty sm:text-6xl">
          {BRAND.hero}
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
          {BRAND.heroSub}
        </p>
        <p className="max-w-lg text-sm text-zinc-500">
          {BRAND.easeMicro}{" "}
          <span className="text-zinc-600">·</span> {BRAND.channelMicro}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">{BRAND.primaryCta}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="#how-it-works">{BRAND.secondaryCta}</Link>
          </Button>
        </div>
        <section id="how-it-works" className="max-w-lg space-y-3">
          <h2 className="text-lg font-medium tracking-tight">How it works</h2>
          <ol className="space-y-2 text-sm leading-relaxed text-zinc-400">
            <li>
              <span className="text-zinc-200">Set spend.</span> Your limit.
              BotBuy stays inside it.
            </li>
            <li>
              <span className="text-zinc-200">Set intent.</span> Any software.
              Any channel.
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
