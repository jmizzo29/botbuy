import { namecheapKeysConfigured } from "@/lib/connectors/keys";
import { namecheapCommand, resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function parseNamecheapAvailability(body: string, domain: string) {
  const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const scoped =
    body.match(
      new RegExp(`Domain="${escaped}"[^>]*Available="(true|false)"`, "i"),
    ) ?? body.match(/Available="(true|false)"/i);
  if (!scoped) {
    return {
      available: null as boolean | null,
      candidates: [] as {
        domain: string;
        available: true;
        amountStatus: "unverified";
      }[],
    };
  }
  const available = scoped[1].toLowerCase() === "true";
  return {
    available,
    candidates: available
      ? [{ domain, available: true as const, amountStatus: "unverified" as const }]
      : [],
  };
}

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
          candidates: parsed.candidates,
          amountStatus: "unverified",
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
    },
  };
}
