import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { PublicChrome } from "@/components/public-chrome";
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
      <div className="mx-auto max-w-md pt-16 md:pt-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {SIGN_IN_H1}
        </p>
        <h1 className="display mt-8">{SIGN_IN_H1}</h1>
        <div className="mt-10">
          {isClerkPublishableConfigured() ? (
            <SignIn
              appearance={CLERK_APPEARANCE}
              fallbackRedirectUrl={CLERK_AFTER_SIGN_IN_URL}
              signUpUrl={CLERK_SIGN_UP_URL}
            />
          ) : (
            <ClerkMissingKeys />
          )}
        </div>
        <p className="mt-8 text-sm text-muted">
          New here?{" "}
          <Link href={CLERK_SIGN_UP_URL} className="text-foreground underline-offset-2 hover:underline">
            Sign up
          </Link>
        </p>
        <Link href="/" className="mt-8 inline-block text-xs text-muted hover:text-foreground">
          ← Land
        </Link>
      </div>
    </PublicChrome>
  );
}

function ClerkMissingKeys() {
  return (
    <p className="text-sm leading-relaxed text-muted">
      Clerk keys are not configured. Add{" "}
      <code className="text-foreground">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
      and <code className="text-foreground">CLERK_SECRET_KEY</code> in Vercel
      before production beta sign-in works.
    </p>
  );
}
