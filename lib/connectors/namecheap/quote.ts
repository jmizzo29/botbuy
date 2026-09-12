import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteNamecheapDomain(input: {
  domain?: string;
  years?: number;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const domain = (input.domain ?? input.vault?.username ?? "example.com").trim();
  return {
    ok: true,
    live: false,
    provider: "namecheap",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: "Namecheap quote stub. Listed price unverified. Not live.",
    data: {
      domain,
      years: input.years ?? 1,
      listedUsd: null,
      amountStatus: "unverified",
    },
  };
}
