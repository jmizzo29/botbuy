import { ClerkProvider } from "@clerk/nextjs";
import {
  CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL,
  CLERK_SIGN_IN_URL,
  CLERK_SIGN_UP_URL,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";
import { CLERK_APPEARANCE } from "@/lib/clerk-ui";

export function ClerkAppProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkPublishableConfigured()) {
    return children;
  }
  return (
    <ClerkProvider
      appearance={CLERK_APPEARANCE}
      signInUrl={CLERK_SIGN_IN_URL}
      signUpUrl={CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={CLERK_AFTER_SIGN_UP_URL}
    >
      {children}
    </ClerkProvider>
  );
}
