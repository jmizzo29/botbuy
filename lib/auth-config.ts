/** Edge-safe Clerk config. No DB, no Clerk server SDK. */

export function isClerkPublishableConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export function isClerkConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
}

export const CLERK_SIGN_IN_URL = "/sign-in";
export const CLERK_SIGN_UP_URL = "/signup";
export const CLERK_AFTER_SIGN_IN_URL = "/home";
export const CLERK_AFTER_SIGN_UP_URL = "/onboarding/intent";
