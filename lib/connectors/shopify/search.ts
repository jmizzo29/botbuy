import {
  resolveShopifyCreds,
  shopifyAdminRequest,
} from "@/lib/connectors/shopify/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function searchShopifyProducts(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveShopifyCreds(input.vault);
  if (creds) {
    const path = `/products.json?limit=5${
      query ? `&title=${encodeURIComponent(query)}` : ""
    }`;
    const http = await shopifyAdminRequest(creds, path);
    if (http.ok) {
      return {
        ok: true,
        live: false,
        provider: "shopify",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Shopify product search returned. POC · not live — not a public connector.",
        data: { query, shopDomain: creds.shopDomain, httpStatus: http.status },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "shopify",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: "Shopify product search stub. Not live.",
    data: { query, products: [], amountStatus: "unverified" },
  };
}
