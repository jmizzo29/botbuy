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
