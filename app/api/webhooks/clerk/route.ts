import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { resolveOrCreateAppUser } from "@/lib/db/users";

export const dynamic = "force-dynamic";

/**
 * Optional user sync. Lazy resolve-on-request still works without this.
 * Set CLERK_WEBHOOK_SECRET (or CLERK_WEBHOOK_SIGNING_SECRET) in Vercel
 * and point Clerk at /api/webhooks/clerk.
 */
export async function POST(request: NextRequest) {
  const secret =
    process.env.CLERK_WEBHOOK_SECRET ??
    process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not configured" },
      { status: 503 },
    );
  }

  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(request, { signingSecret: secret });
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const data = event.data;
  const email =
    data.email_addresses.find((row) => row.id === data.primary_email_address_id)
      ?.email_address ?? data.email_addresses[0]?.email_address;
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 422 });
  }

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();
  await resolveOrCreateAppUser({
    clerkUserId: data.id,
    email,
    name: name || email,
  });

  return NextResponse.json({ ok: true });
}
