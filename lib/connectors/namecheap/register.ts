import { connectorsLiveEnabled } from "@/lib/connectors/http";
import { namecheapCommand, resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function registerNamecheapDomain(input: {
  domain?: string;
  years?: number;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const domain = (input.domain ?? "").trim().toLowerCase();
  const creds = resolveNamecheapCreds(input.vault);

  if (creds && connectorsLiveEnabled() && domain) {
    const http = await namecheapCommand(creds, "namecheap.domains.create", {
      DomainName: domain,
      Years: String(input.years ?? 1),
    });
    return {
      ok: http.ok,
      live: false,
      provider: "namecheap",
      tool: "register",
      dealId: input.dealId,
      result: http.ok ? "http" : "error",
      reason: http.ok
        ? "Namecheap create called after human approve. Still not a public live connector."
        : http.reason,
      data: { domain, httpStatus: http.status },
    };
  }

  return {
    ok: true,
    live: false,
    provider: "namecheap",
    tool: "register",
    dealId: input.dealId,
    result: "stub",
    reason:
      "Namecheap register stub. Deal was approved. Execution is not live.",
    data: { domain: domain || null, years: input.years ?? 1 },
  };
}
