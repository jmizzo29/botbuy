import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { hasPublicSession } from "@/lib/session";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#09090b] text-stone-100">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-[13px] font-semibold text-accent ring-1 ring-accent/25">
            B
          </span>
          <span className="text-sm font-medium tracking-tight">{BRAND.domain}</span>
        </Link>
        <PublicNav />
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-8">{children}</main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-xs text-zinc-600 md:px-8">
        {BRAND.origin} · {BRAND.registration} · {BRAND.footerHold} · No paid
        Stripe
      </footer>
    </div>
  );
}

async function PublicNav() {
  const session = await hasPublicSession();
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/signup" className="text-zinc-400 hover:text-white">
        Sign up
      </Link>
      {session ? (
        <Link href="/home" className="text-zinc-600 hover:text-zinc-400">
          My deals
        </Link>
      ) : null}
    </div>
  );
}
