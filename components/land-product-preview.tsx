import Link from "next/link";
import { CLERK_SIGN_UP_URL } from "@/lib/auth-config";
import { HOW_IT_WORKS } from "@/lib/brand";

/** Land product card. Not HowItWorksRail. Not the signed-in Intent form. */
export function LandProductPreview() {
  return (
    <div className="mt-10 w-full max-w-md" data-surface="land-preview">
      <Link
        href={CLERK_SIGN_UP_URL}
        className="block rounded-2xl border border-white/15 bg-[#122a46] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] no-underline"
        data-cta="land-preview"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
          Paste a listing
        </p>
        <p className="mt-3 rounded-lg border border-white/12 bg-[#0b1f3a] px-3 py-3 font-mono text-[13px] text-teal-200/90">
          https://flippa.com/…
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-white/75">
          BotBuyer reads it, contacts the seller, and stops at money.
        </p>
        <ol className="mt-5 list-none space-y-2 p-0">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <li
              key={step.title}
              className="flex items-baseline gap-3 text-[14px] text-white"
            >
              <span className="font-mono text-[11px] text-teal-300/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step.title}
            </li>
          ))}
        </ol>
      </Link>
    </div>
  );
}
