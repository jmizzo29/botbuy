import { connectorsLiveEnabled } from "@/lib/connectors/http";
import { resolveShopifyCreds } from "@/lib/connectors/shopify/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

/**
 * Draft-order create is a spend mutation. Approve-gate + BOTBUY_CONNECTORS_LIVE
 * still do not unlock a live Admin API buy. This scaffold stays a stub.
 */
export async function buyShopifyProduct(input: {
  query?: string;
  product?: string;
  sku?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const title = (input.product ?? input.query ?? "").trim();
  const creds = resolveShopifyCreds(input.vault);
  const liveMutations = Boolean(creds && connectorsLiveEnabled() && title);

  return {
    ok: true,
    live: false,
    provider: "shopify",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: liveMutations
      ? "Shopify Admin API buy stays stub after Approve. Draft order is not a live public purchase. Not live."
      : "Shopify buy stub. Deal was approved. Execution is not live.",
    data: {
      title: title || null,
      sku: input.sku ?? null,
      mutationsLiveEnabled: connectorsLiveEnabled(),
      spend: false,
    },
  };
}
