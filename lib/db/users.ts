import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { spendLimits, users } from "@/lib/db/schema";
import { SEED_OWNER } from "@/lib/auth-owner";
import {
  displayAccountEmail,
  isPendingClerkEmail,
} from "@/lib/john-ux";
import {
  findDirectoryUser,
  getDirectoryUser,
  rememberDirectoryUser,
} from "@/lib/user-directory";
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

function persistableEmail(email: string, clerkUserId: string) {
  const trimmed = email.trim().toLowerCase();
  if (trimmed) return trimmed;
  return `pending+${clerkUserId}@users.noreply.botbuyer.ai`;
}

function toUser(row: {
  id: string;
  email: string;
  name: string;
  company: string | null;
  role: string;
  clerkUserId?: string | null;
  notificationEmail?: string | null;
  phone?: string | null;
}): User {
  const email = displayAccountEmail(row.email);
  return {
    id: row.id,
    email,
    name: row.name,
    company: row.company ?? "",
    role: row.role === "admin" ? "admin" : "customer",
    clerkUserId: row.clerkUserId ?? null,
    notificationEmail: row.notificationEmail ?? email,
    phone: row.phone ?? "",
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
  const storedEmail = persistableEmail(email, identity.clerkUserId);
  const name = identity.name.trim() || email || "Buyer";
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

    const byEmail = email
      ? await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
      : [];
    if (byEmail[0] && !isPendingClerkEmail(storedEmail)) {
      const [updated] = await db
        .update(users)
        .set({ clerkUserId: identity.clerkUserId })
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
        email: storedEmail,
        name: ownerEmail(email) ? SEED_OWNER.name : name,
        company: ownerEmail(email) ? SEED_OWNER.company : null,
        notificationEmail: email || null,
        role: roleForEmail(email),
      })
      .returning();
    await ensureSpendLimits(id);
    const user = toUser(
      inserted ?? {
        id,
        email: storedEmail,
        name: ownerEmail(email) ? SEED_OWNER.name : name,
        company: ownerEmail(email) ? SEED_OWNER.company : null,
        role: roleForEmail(email),
        clerkUserId: identity.clerkUserId,
        notificationEmail: email || null,
      },
    );
    rememberDirectoryUser(user);
    return user;
  }

  const existing = findDirectoryUser({
    clerkUserId: identity.clerkUserId,
    email: email || null,
  });
  if (existing) {
    const merged: User = {
      ...existing,
      email: email || existing.email,
      clerkUserId: identity.clerkUserId,
    };
    rememberDirectoryUser(merged);
    return merged;
  }

  const user: User = {
    id: newUserId({ ...identity, email: storedEmail }),
    email,
    name: ownerEmail(email) ? SEED_OWNER.name : name,
    company: ownerEmail(email) ? SEED_OWNER.company : "",
    role: roleForEmail(email),
    clerkUserId: identity.clerkUserId,
    notificationEmail: email || "",
    phone: "",
  };
  rememberDirectoryUser(user);
  return user;
}

export async function updateAppUserProfile(
  userId: string,
  patch: {
    name?: string;
    notificationEmail?: string | null;
    phone?: string | null;
    company?: string | null;
  },
): Promise<User | null> {
  const current = getDirectoryUser(userId);
  const db = getDb();

  if (db) {
    const [updated] = await db
      .update(users)
      .set({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.notificationEmail !== undefined
          ? { notificationEmail: patch.notificationEmail || null }
          : {}),
        ...(patch.phone !== undefined ? { phone: patch.phone || null } : {}),
        ...(patch.company !== undefined ? { company: patch.company || null } : {}),
      })
      .where(eq(users.id, userId))
      .returning();
    if (updated) {
      const user = toUser(updated);
      rememberDirectoryUser(user);
      return user;
    }
  }

  if (!current) return null;
  const next: User = {
    ...current,
    name: patch.name ?? current.name,
    notificationEmail:
      patch.notificationEmail !== undefined
        ? patch.notificationEmail
        : current.notificationEmail,
    phone: patch.phone !== undefined ? patch.phone : current.phone,
    company: patch.company !== undefined ? patch.company ?? "" : current.company,
  };
  rememberDirectoryUser(next);
  return next;
}

export async function listPersistedUsers(): Promise<User[] | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(users);
  return rows.map(toUser);
}
