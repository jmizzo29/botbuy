import type { User } from "@/lib/types";

/**
 * Seeded customer #1 / owner row for imported ledger + demo fixtures.
 * Not a session. Identity comes from Clerk → Neon `users.clerkUserId`.
 */
export const SEED_OWNER: User = {
  id: "john-mitchell",
  name: "John Mitchell",
  email: "john.mitchell@buildstarlabs.com",
  company: "Build Star Labs",
  role: "admin",
  clerkUserId: null,
  notificationEmail: "john.mitchell@buildstarlabs.com",
  phone: "",
};
