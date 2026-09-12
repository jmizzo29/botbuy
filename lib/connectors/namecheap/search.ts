import { namecheapCommand, resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function searchNamecheapDomains(input: {
  query?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const domain = (input.query ?? "").trim().toLowerCase() || "example.com";
  const creds = resolveNamecheapCreds(input.vault);
  if (creds) {
    const http = await namecheapCommand(creds, "namecheap.domains.check", {
      DomainList: domain,
    });
    if (http.ok) {
      return {
        ok: true,
        live: false,
        provider: "namecheap",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Namecheap check returned. POC · not live — not a public connector.",
        data: { domain, httpStatus: http.status },
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
    reason: "Namecheap search stub. Not live.",
    data: { domain, available: null, amountStatus: "unverified" },
  };
}
