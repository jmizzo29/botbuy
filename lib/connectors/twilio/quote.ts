import { twilioKeysConfigured } from "@/lib/connectors/keys";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteTwilioNumber(input: {
  phoneNumber?: string;
  country?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const keysConfigured = twilioKeysConfigured(input.vault);
  return {
    ok: true,
    live: false,
    provider: "twilio",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: "Twilio quote stub. Listed price unverified. Not live.",
    data: {
      phoneNumber: input.phoneNumber ?? null,
      country: input.country ?? "US",
      keysConfigured,
      listedUsd: null,
      amountStatus: "unverified",
    },
  };
}
