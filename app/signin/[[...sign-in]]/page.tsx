import type { Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function SignInPage() {
  if (await getCurrentUser()) {
    redirect(CLERK_AFTER_SIGN_IN_URL);
  }

  return (
    <PublicChrome auth>
      <AuthDoor
        title={SIGN_IN_H1}
        foot={
          <p className="bb-auth-alt">
            New here? <Link href={CLERK_SIGN_UP_URL}>Sign up</Link>
          </p>
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
            <p className="bb-auth-note">
              Clerk keys are not configured. Add{" "}
              <code className="text-white">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              </code>{" "}
              and <code className="text-white">CLERK_SECRET_KEY</code> in
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
