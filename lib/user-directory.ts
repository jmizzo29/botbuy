import { SEED_OWNER } from "@/lib/auth-owner";
import type { User } from "@/lib/types";

const directory = new Map<string, User>([[SEED_OWNER.id, SEED_OWNER]]);

export function rememberDirectoryUser(user: User) {
  directory.set(user.id, user);
}

export function listMemoryUsers(): User[] {
  return [...directory.values()];
}
