import type { Viewport } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthDoor } from "@/components/auth-door";
import { AuthQuietForm } from "@/components/auth-quiet-form";
import { PublicChrome } from "@/components/public-chrome";
import { getCurrentUser } from "@/lib/auth";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL,
  CLERK_SIGN_IN_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import {
  AUTH_REQUEST_ALT_LEAD,
  AUTH_REQUEST_ALT_LINK,
  AUTH_REQUEST_CTA,
  AUTH_REQUEST_H1,
  AUTH_REQUEST_SUB,
} from "@/lib/auth-copy";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AUTH_REQUEST_H1,
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function RequestAccessPage() {
  if (await getCurrentUser()) {
    redirect(CLERK_AFTER_SIGN_IN_URL);
  }

  return (
    <PublicChrome auth authScreen="request">
      <AuthDoor
        title={AUTH_REQUEST_H1}
        lead={AUTH_REQUEST_SUB}
        foot={
          <p className="bb-auth-alt">
            {AUTH_REQUEST_ALT_LEAD}{" "}
            <Link href={CLERK_SIGN_IN_URL}>{AUTH_REQUEST_ALT_LINK}</Link>
          </p>
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
            <AuthQuietForm primary={AUTH_REQUEST_CTA} />
          )}
        </div>
      </AuthDoor>
    </PublicChrome>
  );
}
