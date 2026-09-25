import Link from "next/link";
import { AuthFields } from "@/components/auth-fields";
import { BrandLockup } from "@/components/brand-lockup";
import { InstallHint } from "@/components/install-hint";
import { SiteFooter } from "@/components/site-footer";
import { CLERK_SIGN_IN_URL, CLERK_SIGN_UP_URL } from "@/lib/auth-config";
import { BRAND } from "@/lib/brand";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export function PublicChrome({
  children,
  land = false,
  auth = false,
}: {
  children: React.ReactNode;
  land?: boolean;
  auth?: boolean;
}) {
  return (
    <div
      className={cn(
        land
          ? "bb-land-shell"
          : auth
            ? "bb-auth-shell"
            : "min-h-dvh bg-background text-foreground",
      )}
      data-surface={auth ? "auth-shell" : land ? "land-shell" : "public-shell"}
    >
      <div
        className={
          land ? "bb-land-content" : auth ? "bb-auth-content" : undefined
        }
      >
        <header
          className={
            land
              ? "bb-land-header"
              : auth
                ? "bb-auth-header"
                : "mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8"
          }
        >
          <Link href="/" className="flex items-center" aria-label="BotBuyer">
            <BrandLockup priority onDark={land || auth} />
          </Link>
          {auth ? null : <PublicNav land={land} />}
        </header>
        {auth ? <AuthFields /> : null}
        {land || auth ? null : <InstallHint />}
        <main
          className={
            land
              ? "bb-land-main w-full"
              : auth
                ? "bb-auth-main"
                : "mx-auto w-full max-w-6xl px-4 pb-20 md:px-8"
          }
        >
          {children}
        </main>
        {land || auth ? null : (
          <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pb-10 md:px-8">
            <div>
              <SiteFooter />
              <p className="mt-4 text-[10px] leading-relaxed text-muted/80">
                {BRAND.origin} · {BRAND.registration} · {BRAND.footerHold} · No paid
                Stripe
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function landLinkClass(extra?: string) {
  return cn("bb-land-link", extra);
}

async function PublicNav({ land }: { land: boolean }) {
  const session = await hasPublicSession();
  const link = land
    ? landLinkClass
    : (extra?: string) => cn("text-xs text-muted hover:text-foreground", extra);

  return (
    <div className={land ? "bb-land-nav" : "flex items-center gap-3 text-sm"}>
      {session ? (
        <Link href={MY_DEALS_HREF} className={land ? link() : "text-muted hover:text-foreground"}>
          {MY_DEALS_LABEL}
        </Link>
      ) : land ? (
        <Link href="/about" className={link("about")} data-nav="about">
          About
        </Link>
      ) : (
        <>
          <Link href={CLERK_SIGN_IN_URL} className={link()}>
            Sign in
          </Link>
          <Link href={CLERK_SIGN_UP_URL} className="text-muted hover:text-foreground">
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}
