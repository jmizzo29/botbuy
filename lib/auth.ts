import type { User } from "@/lib/types";

/**
 * POC session. John Mitchell (Build Star Labs) is customer #1 and owner.
 * Replace with real auth before any non-demo deploy.
 */
export const DEMO_USER: User = {
  id: "john-mitchell",
  name: "John Mitchell",
  email: "john.mitchell@buildstarlabs.com",
  company: "Build Star Labs",
  role: "admin",
};

export function getCurrentUser(): User {
  return DEMO_USER;
}

export function isAdmin(user: User = getCurrentUser()) {
  return user.role === "admin";
}
