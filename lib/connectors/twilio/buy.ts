import { connectorsLiveEnabled } from "@/lib/connectors/http";
import { resolveTwilioCreds, twilioRequest } from "@/lib/connectors/twilio/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function buyTwilioNumber(input: {
  phoneNumber?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const phoneNumber = (input.phoneNumber ?? "").trim();
  const creds = resolveTwilioCreds(input.vault);

  if (creds && connectorsLiveEnabled() && phoneNumber) {
    const http = await twilioRequest(creds, "/IncomingPhoneNumbers.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ PhoneNumber: phoneNumber }).toString(),
    });
    return {
      ok: http.ok,
      live: false,
      provider: "twilio",
      tool: "buy",
      dealId: input.dealId,
      result: http.ok ? "http" : "error",
      reason: http.ok
        ? "Twilio buy called after human approve. Still not a public live connector."
        : "Twilio buy failed. Not live.",
      data: { phoneNumber, httpStatus: http.status },
    };
  }

  return {
    ok: true,
    live: false,
    provider: "twilio",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: "Twilio buy stub. Deal was approved. Execution is not live.",
    data: { phoneNumber: phoneNumber || null },
  };
}
