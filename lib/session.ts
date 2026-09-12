import { cookies } from "next/headers";
import { getClerkUserId } from "@/lib/auth";

/**
 * Legacy cookie. Not identity. May be written only as an ephemeral
 * onboarding hint — never treat as a signed-in session.
 */
export const SIGNUP_COOKIE = "bb_signup";

export async function writeOnboardingHint(email: string) {
  if (typeof window !== "undefined") return;
  try {
    const jar = await cookies();
    jar.set(SIGNUP_COOKIE, email, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // Writable from server actions / route handlers only.
  }
}

/** Clerk session only. `bb_signup` is not auth. */
export async function hasPublicSession() {
  return Boolean(await getClerkUserId());
}
