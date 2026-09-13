import { httpJsonKeysConfigured } from "@/lib/connectors/http-json/search";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteHttpJson(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const keysConfigured = httpJsonKeysConfigured(input.vault);
  return {
    ok: true,
    live: false,
    provider: "http_json",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason:
      "HTTP JSON catalog quote stub. Listed price unverified. Category-agnostic. Not live.",
    data: {
      query: input.query ?? input.product ?? null,
      host: input.vault?.baseUrl ?? null,
      keysConfigured,
      catalog: "official_https_json",
      categoryAgnostic: true,
      listedUsd: null,
      amountStatus: "unverified",
    },
  };
}
