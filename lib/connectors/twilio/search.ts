import { resolveTwilioCreds, twilioRequest } from "@/lib/connectors/twilio/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function searchTwilioNumbers(input: {
  query?: string;
  country?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const country = (input.country ?? "US").toUpperCase();
  const query = (input.query ?? "").trim();
  const creds = resolveTwilioCreds(input.vault);
  if (creds) {
    const path = `/AvailablePhoneNumbers/${country}/Local.json${
      query ? `?Contains=${encodeURIComponent(query)}` : ""
    }`;
    const http = await twilioRequest(creds, path);
    if (http.ok) {
      return {
        ok: true,
        live: false,
        provider: "twilio",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Twilio search returned. POC · not live — not a public connector.",
        data: { country, query, httpStatus: http.status },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "twilio",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: "Twilio number search stub. Not live.",
    data: { country, query, available: [], amountStatus: "unverified" },
  };
}
