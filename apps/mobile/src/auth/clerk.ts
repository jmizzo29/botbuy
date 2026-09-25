import { clerkPublishableKey, isClerkPublishableConfigured } from "../config";

export type HomeAuth = {
  keysConfigured: boolean;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  email?: string | null;
  busy?: boolean;
  message?: string | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

export function clerkAuthState() {
  const publishableKey = clerkPublishableKey();
  const keysConfigured = isClerkPublishableConfigured();
  return {
    publishableKey,
    keysConfigured,
    honesty: `keysConfigured=${String(keysConfigured)}`,
  };
}
