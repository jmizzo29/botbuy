import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteFooter } from "@/components/site-footer";
import { BRAND } from "@/lib/brand";
import { hasPublicSession } from "@/lib/session";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <Link href="/" className="flex items-center" aria-label="BotBuy home">
          <BrandLockup priority />
        </Link>
        <PublicNav />
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-8">{children}</main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8">
        <SiteFooter />
        <p className="mt-4 text-[10px] leading-relaxed text-muted/60">
          {BRAND.origin} · {BRAND.registration} · {BRAND.footerHold} · No paid
          Stripe
        </p>
      </footer>
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
        <Link href="/home" className="text-muted/70 hover:text-muted">
          My deals
        </Link>
      ) : null}
    </div>
  );
}
