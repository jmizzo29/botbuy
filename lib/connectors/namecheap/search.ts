import { namecheapKeysConfigured } from "@/lib/connectors/keys";
import { namecheapCommand, resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import { parseNamecheapAvailability } from "@/lib/connectors/namecheap/xml";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function searchNamecheapDomains(input: {
  query?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const domain = (input.query ?? "").trim().toLowerCase() || "example.com";
  const creds = resolveNamecheapCreds(input.vault);
  const keysConfigured = namecheapKeysConfigured(input.vault);
  if (creds) {
    const http = await namecheapCommand(creds, "namecheap.domains.check", {
      DomainList: domain,
    });
    if (http.ok) {
      const parsed = parseNamecheapAvailability(http.body ?? "", domain);
      return {
        ok: true,
        live: false,
        provider: "namecheap",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Namecheap check returned. POC · not live — not a public connector.",
        data: {
          domain,
          keysConfigured: true,
          httpStatus: http.status,
          available: parsed.available,
          premium: parsed.premium,
          listedUsd: parsed.listedUsd,
          candidates: parsed.candidates,
          amountStatus: "unverified",
          verified: false,
        },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "namecheap",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: keysConfigured
      ? "Namecheap keys present but search stayed a stub. NAMECHEAP_CLIENT_IP or API HTTP failed. Not live."
      : "Namecheap search stub. keysConfigured=false · official API only · not live.",
    data: {
      domain,
      keysConfigured,
      available: null,
      candidates: [],
      amountStatus: "unverified",
      verified: false,
    },
  };
}
