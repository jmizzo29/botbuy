import { DEFAULT_API_BASE, resolveApiBase } from "./api/botbuyer";

export { DEFAULT_API_BASE };

export function clerkPublishableKey() {
  return process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
}

/** Honest fail-closed: missing or non-pk keys never mount ClerkProvider. */
export function isClerkPublishableConfigured() {
  return clerkPublishableKey().startsWith("pk_");
}

export function apiBase() {
  return resolveApiBase(process.env.EXPO_PUBLIC_API_BASE);
}
