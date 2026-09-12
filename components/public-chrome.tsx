import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { InstallHint } from "@/components/install-hint";
import { SiteFooter } from "@/components/site-footer";
import { BRAND } from "@/lib/brand";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";
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
      <div className={land ? "bb-land-content" : undefined}>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8">
          <Link href="/" className="flex items-center" aria-label="BotBuy home">
            <BrandLockup priority />
          </Link>
          <PublicNav land={land} />
        </header>
        <InstallHint />
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

async function PublicNav({ land }: { land: boolean }) {
  const session = await hasPublicSession();
  return (
    <div className="flex items-center gap-3 text-sm">
      {land ? (
        <Link href="/beta" className="text-xs text-muted hover:text-foreground">
          {BRAND.landHonesty}
        </Link>
      ) : null}
      {session ? (
        <Link
          href={MY_DEALS_HREF}
          className="text-muted hover:text-foreground"
        >
          {MY_DEALS_LABEL}
        </Link>
      ) : (
        <Link href="/signup" className="text-muted hover:text-foreground">
          Sign up
        </Link>
      )}
    </div>
  );
}
