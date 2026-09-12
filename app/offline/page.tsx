import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <PublicChrome>
      <div className="mx-auto max-w-md pt-16 md:pt-24">
        <Badge className={DEMO_PILL_CLASS}>{BRAND.pocBanner}</Badge>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Cached BotBuyer pages still open. This is the Demo shell — not a live
          purchase rail.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={MY_DEALS_HREF}>{MY_DEALS_LABEL}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/">Land</Link>
          </Button>
        </div>
      </div>
    </PublicChrome>
  );
}
