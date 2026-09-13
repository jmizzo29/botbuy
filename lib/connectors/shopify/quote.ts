import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteShopifyProduct(input: {
  query?: string;
  product?: string;
  sku?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  return {
    ok: true,
    live: false,
    provider: "shopify",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: "Shopify quote stub. Listed price unverified. Not live.",
    data: {
      query: input.query ?? input.product ?? null,
      sku: input.sku ?? null,
      shopDomain: input.vault?.shopDomain ?? null,
      listedUsd: null,
      amountStatus: "unverified",
    },
  };
}
