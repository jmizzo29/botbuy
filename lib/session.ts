import { getSignupSession } from "@/lib/store";

export const SIGNUP_COOKIE = "bb_signup";

export async function writeSignupCookie(email: string) {
  if (typeof window !== "undefined") return;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    jar.set(SIGNUP_COOKIE, email, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // Writable from server actions / route handlers only.
  }
}

/** Session or onboarding persist — used to quiet land chrome until then. */
export async function hasPublicSession() {
  if (getSignupSession()) return true;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    return Boolean(jar.get(SIGNUP_COOKIE)?.value);
  } catch {
    return false;
  }
}
