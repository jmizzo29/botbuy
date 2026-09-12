import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth-config";

/**
 * Next.js 16 still accepts middleware.ts (deprecated alias of proxy.ts).
 * Clerk 7 `clerkMiddleware` is the request gate. Authorization also lives
 * next to data via `requireUser()` / `requireApiUser()`.
 *
 * Missing Clerk keys: pass through so CI/`next build` can complete.
 * Protected routes then fail closed in layouts and APIs (no DEMO_USER).
 */
const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/deals(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/vault(.*)",
  "/agents(.*)",
  "/onboarding(.*)",
  "/start",
  "/intent(.*)",
  "/api/deals(.*)",
  "/api/intents(.*)",
  "/api/spend(.*)",
  "/api/vault(.*)",
  "/api/agents(.*)",
  "/api/audit(.*)",
  "/api/admin(.*)",
  "/api/verification(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
