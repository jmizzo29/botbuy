import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { AuthDoor } from "@/components/auth-door";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_SIGN_UP_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import { SIGN_IN_H1 } from "@/lib/brand";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
};

export default async function SignInPage() {
  if (await getCurrentUser()) {
    redirect(CLERK_AFTER_SIGN_IN_URL);
  }

  return (
    <PublicChrome>
      <AuthDoor
        eyebrow={SIGN_IN_H1}
        title={SIGN_IN_H1}
        foot={
          <>
            <p className="text-sm text-muted">
              New here?{" "}
              <Link
                href={CLERK_SIGN_UP_URL}
                className="text-foreground underline-offset-2 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link href="/" className="inline-block text-xs text-muted hover:text-foreground">
              ← Land
            </Link>
          </>
        }
      >
        {isClerkPublishableConfigured() ? (
          <SignIn
            appearance={CLERK_APPEARANCE}
            fallbackRedirectUrl={CLERK_AFTER_SIGN_IN_URL}
            signUpUrl={CLERK_SIGN_UP_URL}
          />
        ) : (
          <div className="grid gap-4">
            <p className="text-sm leading-relaxed text-muted">
              Clerk keys are not configured. Add{" "}
              <code className="text-foreground">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              </code>{" "}
              and <code className="text-foreground">CLERK_SECRET_KEY</code> in
              Vercel before production beta sign-in works.
            </p>
            <Button type="button" size="lg" className="w-full" disabled>
              {SIGN_IN_H1}
            </Button>
          </div>
        )}
      </AuthDoor>
    </PublicChrome>
  );
}
