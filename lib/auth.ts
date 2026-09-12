import { cache } from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured, CLERK_SIGN_IN_URL } from "@/lib/auth-config";
import { SEED_OWNER } from "@/lib/auth-owner";
import { resolveOrCreateAppUser } from "@/lib/db/users";
import type { User } from "@/lib/types";

export { SEED_OWNER };
export {
  isClerkConfigured,
  isClerkPublishableConfigured,
} from "@/lib/auth-config";

/** @deprecated Seed owner only. Do not use as session identity. */
export const DEMO_USER = SEED_OWNER;

function clerkDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
}): string {
  const full = user.fullName?.trim();
  if (full) return full;
  const parts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (parts) return parts;
  if (user.username) return user.username;
  return user.primaryEmailAddress?.emailAddress ?? "Buyer";
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isClerkConfigured()) return null;
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      "";
    return resolveOrCreateAppUser({
      clerkUserId: clerkUser.id,
      email,
      name: clerkDisplayName(clerkUser),
    });
  } catch {
    return null;
  }
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(CLERK_SIGN_IN_URL);
  return user;
}

export async function isAdmin(user?: User | null) {
  const resolved = user === undefined ? await getCurrentUser() : user;
  return resolved?.role === "admin";
}

export async function getClerkUserId() {
  if (!isClerkConfigured()) return null;
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}
