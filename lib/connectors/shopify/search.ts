import { shopifyKeysConfigured } from "@/lib/connectors/keys";
import {
  resolveShopifyCreds,
  shopifyAdminRequest,
} from "@/lib/connectors/shopify/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function parseShopifyProducts(body: string) {
  try {
    const json = JSON.parse(body) as {
      products?: { title?: string; handle?: string }[];
    };
    const rows = Array.isArray(json.products) ? json.products : [];
    return rows
      .map((row) => ({
        title: typeof row.title === "string" ? row.title : "",
        handle: typeof row.handle === "string" ? row.handle : "",
        amountStatus: "unverified" as const,
      }))
      .filter((row) => row.title || row.handle)
      .slice(0, 5);
  } catch {
    return [];
  }
}

export async function searchShopifyProducts(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveShopifyCreds(input.vault);
  const keysConfigured = shopifyKeysConfigured(input.vault);
  if (creds) {
    const path = `/products.json?limit=5${
      query ? `&title=${encodeURIComponent(query)}` : ""
    }`;
    const http = await shopifyAdminRequest(creds, path);
    if (http.ok) {
      const candidates = parseShopifyProducts(http.body ?? "");
      return {
        ok: true,
        live: false,
        provider: "shopify",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Shopify product search returned. POC · not live — not a public connector.",
        data: {
          query,
          keysConfigured: true,
          shopDomain: creds.shopDomain,
          httpStatus: http.status,
          products: candidates,
          candidates,
          amountStatus: "unverified",
        },
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
    reason: keysConfigured
      ? "Shopify keys present but search stayed a stub. Official Admin API only. Not live."
      : "Shopify product search stub. keysConfigured=false · official Admin API only · not live.",
    data: {
      query,
      keysConfigured,
      products: [],
      candidates: [],
      amountStatus: "unverified",
    },
  };
}
