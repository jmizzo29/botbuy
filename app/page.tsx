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
          {BRAND.signupLine}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/home">My deals</Link>
          </Button>
        </div>
        <ProofStrip />
      </div>
    </PublicChrome>
  );
}
