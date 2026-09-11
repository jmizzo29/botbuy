import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/lib/brand";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function PublicChrome({
  children,
  land = false,
}: {
  children: React.ReactNode;
  land?: boolean;
}) {
  return (
    <div
      className={cn(
        land ? "bb-land-shell text-foreground" : "min-h-dvh bg-background text-foreground",
      )}
    >
      {land ? (
        <>
          <div className="bb-land-air" aria-hidden="true" data-bg="techlux-air" />
          <div className="bb-land-veil" aria-hidden="true" />
        </>
      ) : null}
      <div className={land ? "bb-land-content" : undefined}>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8">
          <Link href="/" className="flex items-center" aria-label="BotBuy home">
            <BrandLockup priority />
          </Link>
          <div className="flex items-center gap-3">
            {land ? (
              <Badge className={DEMO_PILL_CLASS}>{BRAND.pocBanner}</Badge>
            ) : null}
            <PublicNav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-8">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8">
          <SiteFooter />
          <p className="mt-4 text-[10px] leading-relaxed text-muted/80">
            {BRAND.origin} · {BRAND.registration} · {BRAND.footerHold} · No paid
            Stripe
          </p>
        </footer>
      </div>
    </div>
  );
}

async function PublicNav() {
  const session = await hasPublicSession();
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/signup" className="text-muted hover:text-foreground">
        Sign up
      </Link>
      {session ? (
        <Link href={MY_DEALS_HREF} className="text-muted hover:text-foreground">
          {MY_DEALS_LABEL}
        </Link>
      ) : null}
    </div>
  );
}
