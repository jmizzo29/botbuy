import { resolveTwilioCreds, twilioRequest } from "@/lib/connectors/twilio/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function parseTwilioCandidates(body: string, country: string) {
  try {
    const json = JSON.parse(body) as {
      available_phone_numbers?: {
        phone_number?: string;
        iso_country?: string;
      }[];
    };
    const rows = Array.isArray(json.available_phone_numbers)
      ? json.available_phone_numbers
      : [];
    const candidates = rows
      .map((row) => ({
        phoneNumber:
          typeof row.phone_number === "string" ? row.phone_number : "",
        country:
          typeof row.iso_country === "string" ? row.iso_country : country,
        amountStatus: "unverified" as const,
      }))
      .filter((row) => row.phoneNumber)
      .slice(0, 5);
    return { available: candidates, candidates };
  } catch {
    return { available: [], candidates: [] };
  }
}

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
      const parsed = parseTwilioCandidates(http.body ?? "", country);
      return {
        ok: true,
        live: false,
        provider: "twilio",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Twilio search returned. POC · not live — not a public connector.",
        data: {
          country,
          query,
          httpStatus: http.status,
          available: parsed.available,
          candidates: parsed.candidates,
          amountStatus: "unverified",
        },
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
    data: {
      country,
      query,
      available: [],
      candidates: [],
      amountStatus: "unverified",
    },
  };
}
