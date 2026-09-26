import { SEED_OWNER } from "@/lib/auth-owner";
import type { User } from "@/lib/types";

function directoryMap(): Map<string, User> {
  const globalStore = globalThis as typeof globalThis & {
    __botbuyUsers?: Map<string, User>;
  };
  if (!globalStore.__botbuyUsers) {
    globalStore.__botbuyUsers = new Map([[SEED_OWNER.id, SEED_OWNER]]);
  }
  if (!globalStore.__botbuyUsers.has(SEED_OWNER.id)) {
    globalStore.__botbuyUsers.set(SEED_OWNER.id, SEED_OWNER);
  }
  return globalStore.__botbuyUsers;
}

export function rememberDirectoryUser(user: User) {
  directoryMap().set(user.id, user);
}

export function getDirectoryUser(userId: string): User | undefined {
  return directoryMap().get(userId);
}

export function findDirectoryUser(match: {
  clerkUserId?: string | null;
  email?: string | null;
}): User | undefined {
  return [...directoryMap().values()].find((user) => {
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
  return [...directoryMap().values()];
}
