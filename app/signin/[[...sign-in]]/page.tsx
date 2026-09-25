import type { Viewport } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { AuthDoor } from "@/components/auth-door";
import { AuthQuietForm } from "@/components/auth-quiet-form";
import { PublicChrome } from "@/components/public-chrome";
import { getCurrentUser } from "@/lib/auth";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_SIGN_UP_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import {
  AUTH_LOGIN_ALT_LEAD,
  AUTH_LOGIN_ALT_LINK,
  AUTH_LOGIN_CTA,
  AUTH_LOGIN_H1,
  AUTH_LOGIN_SUB,
} from "@/lib/auth-copy";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AUTH_LOGIN_H1,
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function SignInPage() {
  if (await getCurrentUser()) {
    redirect(CLERK_AFTER_SIGN_IN_URL);
  }

  return (
    <PublicChrome auth authScreen="login">
      <AuthDoor
        title={AUTH_LOGIN_H1}
        lead={AUTH_LOGIN_SUB}
        foot={
          <p className="bb-auth-alt">
            {AUTH_LOGIN_ALT_LEAD}{" "}
            <Link href={CLERK_SIGN_UP_URL}>{AUTH_LOGIN_ALT_LINK}</Link>
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
          <AuthQuietForm primary={AUTH_LOGIN_CTA} />
        )}
      </AuthDoor>
    </PublicChrome>
  );
}
