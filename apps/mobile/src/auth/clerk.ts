import { clerkPublishableKey, isClerkPublishableConfigured } from "../config";

export function clerkAuthState() {
  const publishableKey = clerkPublishableKey();
  const keysConfigured = isClerkPublishableConfigured();
  return {
    publishableKey,
    keysConfigured,
    honesty: `keysConfigured=${String(keysConfigured)}`,
  };
}
