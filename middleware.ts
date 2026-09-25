import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { CLERK_SIGN_IN_URL, isClerkConfigured } from "@/lib/auth-config";

/**
 * Next.js 16 still accepts middleware.ts (deprecated alias of proxy.ts).
 * Clerk 7 `clerkMiddleware` is the request gate. Authorization also lives
 * next to data via `requireUser()` / `requireApiUser()`.
 *
 * Missing Clerk keys: do not invoke clerkMiddleware (it throws). Pass
 * through so CI/`next build`/`next start` complete. Protected routes then
 * fail closed in layouts and APIs (no DEMO_USER).
 *
 * Do not use Clerk protect-rewrite here. Unsigned GETs (curl, missing
 * Sec-Fetch-Dest / Accept: text/html) become HTTP 404 instead of a
 * sign-in redirect. App pages 3xx to `/signin`; APIs 401.
 *
 * `/start` stays public. The page sends a session to My deals and everyone
 * else to the landing. `/api/ingest` uses its own bearer, not Clerk.
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
  return clerkMiddleware(
    async (auth, request) => {
      if (!isProtectedRoute(request)) return;

      const { userId } = await auth();
      if (userId) return;

      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.redirect(new URL(CLERK_SIGN_IN_URL, request.url));
    },
    { signInUrl: CLERK_SIGN_IN_URL },
  )(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
