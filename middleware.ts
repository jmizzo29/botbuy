import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/auth-config";

/**
 * Next.js 16 still accepts middleware.ts (deprecated alias of proxy.ts).
 * Clerk 7 `clerkMiddleware` is the request gate. Authorization also lives
 * next to data via `requireUser()` / `requireApiUser()`.
 *
 * Missing Clerk keys: do not invoke clerkMiddleware (it throws). Pass
 * through so CI/`next build`/`next start` complete. Protected routes then
 * fail closed in layouts and APIs (no DEMO_USER).
 *
 * `/start` stays public. The page sends a session to My deals and everyone
 * else to the landing. Protecting it sent the home-screen icon to Sign in.
 */
const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/deals(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/vault(.*)",
  "/agents(.*)",
  "/onboarding(.*)",
  "/intent(.*)",
  "/api/deals(.*)",
  "/api/intents(.*)",
  "/api/profile(.*)",
  "/api/spend(.*)",
  "/api/vault(.*)",
  "/api/agents(.*)",
  "/api/audit(.*)",
  "/api/connectors(.*)",
  "/api/admin(.*)",
  "/api/verification(.*)",
]);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  return clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  })(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
