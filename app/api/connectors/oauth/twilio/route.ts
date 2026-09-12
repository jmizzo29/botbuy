import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { CONNECT_ACCOUNTS_HONESTY } from "@/lib/connectors/copy";
import { twilioOauthConfigured } from "@/lib/connectors/http";

/**
 * OAuth start. Prefer Twilio OAuth when env is present.
 * POC · not live — no callback exchange is claimed public.
 */
export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const clientId = process.env.TWILIO_OAUTH_CLIENT_ID?.trim();
  const redirect = process.env.TWILIO_OAUTH_REDIRECT_URL?.trim();
  if (!twilioOauthConfigured() || !clientId) {
    return NextResponse.json(
      {
        error:
          "Twilio OAuth is preferred but not configured. API key connect is OK for this POC.",
        honesty: CONNECT_ACCOUNTS_HONESTY,
        live: false,
      },
      { status: 501 },
    );
  }
  const authorize = new URL("https://www.twilio.com/authorize");
  authorize.searchParams.set("client_id", clientId);
  if (redirect) authorize.searchParams.set("redirect_uri", redirect);
  authorize.searchParams.set("response_type", "code");
  return NextResponse.redirect(authorize);
}
