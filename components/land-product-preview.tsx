import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CLERK_SIGN_IN_URL, CLERK_SIGN_UP_URL } from "@/lib/auth-config";

const HUNTS = [
  {
    kicker: "Digital \u00b7 live",
    title: "Under $1k Flippa-style",
    meta: "Cap $1k \u00b7 3 scored \u00b7 2 in chase",
    lead: "Lead 82 \u00b7 InboxTriage \u2014 Gmail label rules as a service",
  },
  {
    kicker: "Vehicle \u00b7 live",
    title: "A clean Tesla Model 3",
    meta: "Cap $35k \u00b7 3 scored \u00b7 1 in chase",
    lead: "Lead 74 \u00b7 2021 Model 3 Long Range \u2014 one owner",
  },
] as const;

/** Public Hunts screen. Signup is the door. */
export function LandProductPreview() {
  return (
    <div className="w-full max-w-lg" data-surface="land-preview">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-[2rem] font-semibold tracking-tight text-white">Hunts</h2>
        <Link
          href={CLERK_SIGN_UP_URL}
          data-cta="land-preview"
          className="inline-flex h-11 items-center rounded-full bg-[#2DD4BF] px-4 text-sm font-semibold text-[#042F2E] no-underline"
        >
          New hunt
        </Link>
      </div>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
        Acts for you. Spends only with your OK. The agent contacts sellers. You approve money.
      </p>
      <ul className="mt-5 grid list-none gap-3 p-0">
        {HUNTS.map((hunt) => (
          <li key={hunt.title}>
            <Link
              href={CLERK_SIGN_UP_URL}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/15 bg-[#163556] p-4 no-underline"
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {hunt.kicker}
                </p>
                <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-white">
                  {hunt.title}
                </p>
                <p className="mt-2 font-mono text-sm text-white/60">{hunt.meta}</p>
                <p className="mt-2 truncate text-sm text-white/90">{hunt.lead}</p>
              </div>
              <ChevronRight className="mt-1 size-5 shrink-0 text-white/40" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-white/70">
        Already in?{" "}
        <Link href={CLERK_SIGN_IN_URL} className="text-white underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
