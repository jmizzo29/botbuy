"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AUTH_LOGIN_CTA, AUTH_REQUEST_CTA } from "@/lib/auth-copy";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL,
  CLERK_SIGN_IN_URL,
  CLERK_SIGN_UP_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import { CLERK_APPEARANCE, CLERK_AUTH_LOCALIZATION } from "@/lib/clerk-ui";

export function ClerkAppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const request = pathname === "/signup" || pathname.startsWith("/signup/");
  const localization = useMemo(
    () => ({
      ...CLERK_AUTH_LOCALIZATION,
      formButtonPrimary: request ? AUTH_REQUEST_CTA : AUTH_LOGIN_CTA,
    }),
    [request],
  );

  if (!isClerkPublishableConfigured()) {
    return children;
  }
  return (
    <ClerkProvider
      appearance={CLERK_APPEARANCE}
      localization={localization}
      signInUrl={CLERK_SIGN_IN_URL}
      signUpUrl={CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={CLERK_AFTER_SIGN_UP_URL}
    >
      {children}
    </ClerkProvider>
  );
}
