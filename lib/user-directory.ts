import { SEED_OWNER } from "@/lib/auth-owner";
import type { User } from "@/lib/types";

const directory = new Map<string, User>([[SEED_OWNER.id, SEED_OWNER]]);

export function rememberDirectoryUser(user: User) {
  directory.set(user.id, user);
}

export function getDirectoryUser(userId: string): User | undefined {
  return directory.get(userId);
}

export function findDirectoryUser(match: {
  clerkUserId?: string | null;
  email?: string | null;
}): User | undefined {
  return [...directory.values()].find((user) => {
    if (match.clerkUserId && user.clerkUserId === match.clerkUserId) {
      return true;
    }
    if (match.email && user.email.toLowerCase() === match.email.toLowerCase()) {
      return true;
    }
    return false;
  });
}

export function listMemoryUsers(): User[] {
  return [...directory.values()];
}
