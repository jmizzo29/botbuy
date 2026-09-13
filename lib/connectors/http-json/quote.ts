import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteHttpJson(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  return {
    ok: true,
    live: false,
    provider: "http_json",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: "HTTP JSON quote stub. Listed price unverified. Not live.",
    data: {
      query: input.query ?? input.product ?? null,
      host: input.vault?.baseUrl ?? null,
      listedUsd: null,
      amountStatus: "unverified",
    },
  };
}
