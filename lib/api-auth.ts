import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function requireApiUser(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, error: null };
}

export async function requireApiAdmin(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const gated = await requireApiUser();
  if (gated.error || !gated.user) return gated;
  if (!(await isAdmin(gated.user))) {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return gated;
}
