import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { InstallHint } from "@/components/install-hint";
import { SiteFooter } from "@/components/site-footer";
import { CLERK_SIGN_IN_URL, CLERK_SIGN_UP_URL } from "@/lib/auth-config";
import { BRAND, LAND_WORDMARK } from "@/lib/brand";
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
      {land ? <div className="bb-land-air" aria-hidden="true" /> : null}
      <div className={land ? "bb-land-content" : undefined}>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8">
          <Link
            href="/"
            className="flex items-center"
            aria-label={`${land ? LAND_WORDMARK : BRAND.name} home`}
          >
            <BrandLockup priority />
          </Link>
          <PublicNav land={land} />
        </header>
        <InstallHint />
        <main
          className={
            land
              ? "bb-land-main mx-auto w-full max-w-6xl px-4 pb-8 md:px-8"
              : "mx-auto w-full max-w-6xl px-4 pb-20 md:px-8"
          }
        >
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pb-10 md:px-8">
          <div>
            <SiteFooter />
            <p className="mt-4 text-[10px] leading-relaxed text-muted/80">
              {BRAND.origin} · {BRAND.registration} · {BRAND.footerHold} · No paid
              Stripe
            </p>
          </div>
          {land ? (
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted/70">
              {BRAND.signalHold}
            </p>
          ) : null}
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
        <>
          <Link href="/beta" className="text-xs text-muted hover:text-foreground">
            {BRAND.landHonesty}
          </Link>
          <Link
            href="/about"
            className="hidden text-xs text-muted hover:text-foreground sm:inline"
          >
            About
          </Link>
        </>
      ) : null}
      {session ? (
        <Link
          href={MY_DEALS_HREF}
          className="text-muted hover:text-foreground"
        >
          {MY_DEALS_LABEL}
        </Link>
      ) : (
        <>
          <Link
            href={CLERK_SIGN_IN_URL}
            className="text-xs text-muted hover:text-foreground"
          >
            Sign in
          </Link>
          {land ? null : (
            <Link href={CLERK_SIGN_UP_URL} className="text-muted hover:text-foreground">
              Sign up
            </Link>
          )}
        </>
      )}
    </div>
  );
}
