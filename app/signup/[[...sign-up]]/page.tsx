import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthDoor } from "@/components/auth-door";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL,
  CLERK_SIGN_IN_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import { SIGNUP_CTA, SIGNUP_FOOT, SIGNUP_H1, SIGNUP_SUB } from "@/lib/brand";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";

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
      <AuthDoor
        eyebrow="Sign up"
        title={SIGNUP_H1}
        lead={SIGNUP_SUB}
        foot={
          <>
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                href={CLERK_SIGN_IN_URL}
                className="text-foreground underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p className="text-xs leading-relaxed text-muted">{SIGNUP_FOOT}</p>
            <Link href="/" className="inline-block text-xs text-muted hover:text-foreground">
              ← Land
            </Link>
          </>
        }
      >
        <div data-cta="clerk-signup">
          {isClerkPublishableConfigured() ? (
            <SignUp
              appearance={CLERK_APPEARANCE}
              fallbackRedirectUrl={CLERK_AFTER_SIGN_UP_URL}
              signInUrl={CLERK_SIGN_IN_URL}
            />
          ) : (
            <div className="grid gap-4">
              <p className="text-sm leading-relaxed text-muted">
                Clerk keys are not configured. Add{" "}
                <code className="text-foreground">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                </code>{" "}
                and <code className="text-foreground">CLERK_SECRET_KEY</code> in
                Vercel before production beta sign-up works.
              </p>
              <Button type="button" size="lg" className="w-full" disabled>
                {SIGNUP_CTA}
              </Button>
            </div>
          )}
        </div>
      </AuthDoor>
    </PublicChrome>
  );
}
