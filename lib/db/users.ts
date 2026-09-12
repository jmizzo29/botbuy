import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { spendLimits, users } from "@/lib/db/schema";
import { SEED_OWNER } from "@/lib/auth-owner";
import { rememberDirectoryUser } from "@/lib/user-directory";
import { SPEND_DEFAULTS, SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import type { User, UserRole } from "@/lib/types";

export interface ClerkIdentity {
  clerkUserId: string;
  email: string;
  name: string;
}

function ownerEmail(email: string) {
  return email.trim().toLowerCase() === SEED_OWNER.email.toLowerCase();
}

function toUser(row: {
  id: string;
  email: string;
  name: string;
  company: string | null;
  role: string;
  clerkUserId?: string | null;
}): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company ?? "",
    role: row.role === "admin" ? "admin" : "customer",
    clerkUserId: row.clerkUserId ?? null,
  };
}

function roleForEmail(email: string): UserRole {
  return ownerEmail(email) ? "admin" : "customer";
}

function newUserId(identity: ClerkIdentity) {
  return ownerEmail(identity.email) ? SEED_OWNER.id : `usr_${identity.clerkUserId}`;
}

async function ensureSpendLimits(userId: string) {
  const db = getDb();
  if (!db) return;
  await db
    .insert(spendLimits)
    .values({
      userId,
      hardGateUsd: String(SPEND_HARD_GATE_USD),
      dailyLimitUsd: String(SPEND_DEFAULTS.dailyLimitUsd),
      weeklyLimitUsd: String(SPEND_DEFAULTS.weeklyLimitUsd),
      monthlyLimitUsd: String(SPEND_DEFAULTS.monthlyLimitUsd),
      perDealLimitUsd: String(SPEND_DEFAULTS.perDealLimitUsd),
      autoApprove: false,
    })
    .onConflictDoNothing();
}

export async function resolveOrCreateAppUser(
  identity: ClerkIdentity,
): Promise<User> {
  const email = identity.email.trim().toLowerCase();
  const name = identity.name.trim() || email;
  const db = getDb();

  if (db) {
    const byClerk = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, identity.clerkUserId))
      .limit(1);
    if (byClerk[0]) {
      const user = toUser(byClerk[0]);
      rememberDirectoryUser(user);
      return user;
    }

    const byEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (byEmail[0]) {
      const [updated] = await db
        .update(users)
        .set({ clerkUserId: identity.clerkUserId, name })
        .where(eq(users.id, byEmail[0].id))
        .returning();
      const user = toUser(updated ?? { ...byEmail[0], clerkUserId: identity.clerkUserId });
      rememberDirectoryUser(user);
      return user;
    }

    const id = newUserId({ ...identity, email });
    const [inserted] = await db
      .insert(users)
      .values({
        id,
        clerkUserId: identity.clerkUserId,
        email,
        name: ownerEmail(email) ? SEED_OWNER.name : name,
        company: ownerEmail(email) ? SEED_OWNER.company : null,
        role: roleForEmail(email),
      })
      .returning();
    await ensureSpendLimits(id);
    const user = toUser(
      inserted ?? {
        id,
        email,
        name: ownerEmail(email) ? SEED_OWNER.name : name,
        company: ownerEmail(email) ? SEED_OWNER.company : null,
        role: roleForEmail(email),
        clerkUserId: identity.clerkUserId,
      },
    );
    rememberDirectoryUser(user);
    return user;
  }

  const user: User = {
    id: newUserId({ ...identity, email }),
    email,
    name: ownerEmail(email) ? SEED_OWNER.name : name,
    company: ownerEmail(email) ? SEED_OWNER.company : "",
    role: roleForEmail(email),
    clerkUserId: identity.clerkUserId,
  };
  rememberDirectoryUser(user);
  return user;
}

export async function listPersistedUsers(): Promise<User[] | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(users);
  return rows.map(toUser);
}
