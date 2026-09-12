import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { PublicChrome } from "@/components/public-chrome";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL,
  CLERK_SIGN_IN_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import { BRAND } from "@/lib/brand";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  if (await getCurrentUser()) {
    redirect(CLERK_AFTER_SIGN_IN_URL);
  }

  return (
    <PublicChrome>
      <div className="mx-auto max-w-md pt-16 md:pt-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Sign up
          </p>
          <Badge className={`mt-6 ${DEMO_PILL_CLASS}`}>
            {BRAND.pocBanner}
          </Badge>
          <h1 className="display mt-8">{BRAND.signupLine}</h1>
        </div>
        <div className="mt-10" data-cta="clerk-signup">
          {isClerkPublishableConfigured() ? (
            <SignUp
              appearance={CLERK_APPEARANCE}
              fallbackRedirectUrl={CLERK_AFTER_SIGN_UP_URL}
              signInUrl={CLERK_SIGN_IN_URL}
            />
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Clerk keys are not configured. Add{" "}
              <code className="text-foreground">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              </code>{" "}
              and <code className="text-foreground">CLERK_SECRET_KEY</code> in
              Vercel before production beta sign-up works.
            </p>
          )}
        </div>
        <p className="mt-8 text-sm text-muted">
          Already have an account?{" "}
          <Link
            href={CLERK_SIGN_IN_URL}
            className="text-foreground underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Email sign-up creates a live Clerk account. 2FA is phase-2. No paid
          Stripe. {BRAND.origin} is not an announced launch.
        </p>
        <Link href="/" className="mt-8 inline-block text-xs text-muted hover:text-foreground">
          ← Land
        </Link>
      </div>
    </PublicChrome>
  );
}
