import Link from "next/link";
import { HOW_IT_WORKS } from "@/lib/brand";
import { CLERK_SIGN_UP_URL } from "@/lib/auth-config";

/** Land product card. Not HowItWorksRail. Not the signed-in Intent form. */
export function LandProductPreview() {
  return (
    <div className="bb-land-preview" data-surface="land-preview">
      <Link
        href={CLERK_SIGN_UP_URL}
        className="bb-land-preview-card"
        data-cta="land-preview"
      >
        <p className="bb-land-preview-kicker">Paste a listing</p>
        <p className="bb-land-preview-url">https://flippa.com/…</p>
        <p className="bb-land-preview-copy">
          BotBuyer reads it, contacts the seller, and stops at money.
        </p>
        <ol className="bb-land-preview-steps">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <li key={step.title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {step.title}
            </li>
          ))}
        </ol>
      </Link>
    </div>
  );
}
