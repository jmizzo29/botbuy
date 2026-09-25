import { shopifyKeysConfigured } from "@/lib/connectors/keys";
import {
  resolveShopifyCreds,
  shopifyAdminRequest,
} from "@/lib/connectors/shopify/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export type ShopifyCandidate = {
  title: string;
  handle: string;
  listingId: string;
  sku: string;
  amountStatus: "unverified";
};

function stringField(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function firstVariantSku(row: Record<string, unknown>) {
  const variants = row.variants;
  if (!Array.isArray(variants)) return "";
  for (const raw of variants) {
    if (!raw || typeof raw !== "object") continue;
    const sku = stringField(raw as Record<string, unknown>, "sku");
    if (sku) return sku;
  }
  return "";
}

function matchesQuery(title: string, handle: string, query: string) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return title.toLowerCase().includes(needle) || handle.toLowerCase().includes(needle);
}

/** Map official Admin products.json into unverified rows. No invented prices. */
export function parseShopifyProducts(body: string, query = ""): ShopifyCandidate[] {
  try {
    const json = JSON.parse(body) as { products?: unknown };
    const rows = Array.isArray(json.products) ? json.products : [];
    const out: ShopifyCandidate[] = [];
    for (const raw of rows) {
      if (!raw || typeof raw !== "object") continue;
      const record = raw as Record<string, unknown>;
      const title = stringField(record, "title");
      const handle = stringField(record, "handle");
      if (!title && !handle) continue;
      if (!matchesQuery(title, handle, query)) continue;
      out.push({
        title,
        handle,
        listingId: String(record.id ?? (handle || title)),
        sku: firstVariantSku(record),
        amountStatus: "unverified",
      });
      if (out.length >= 5) break;
    }
    return out;
  } catch {
    return [];
  }
}

function honestyData(input: {
  query: string;
  keysConfigured: boolean;
  shopDomain?: string | null;
  httpStatus?: number | null;
  candidates: ShopifyCandidate[];
}) {
  return {
    query: input.query,
    keysConfigured: input.keysConfigured,
    shopDomain: input.shopDomain ?? null,
    httpStatus: input.httpStatus ?? null,
    products: input.candidates,
    candidates: input.candidates,
    amountStatus: "unverified" as const,
    live: false as const,
    spend: false as const,
  };
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
      const candidates = parseShopifyProducts(http.body ?? "", query);
      return {
        ok: true,
        live: false,
        provider: "shopify",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "Shopify product search returned. POC · not live — not a public connector.",
        data: honestyData({
          query,
          keysConfigured: true,
          shopDomain: creds.shopDomain,
          httpStatus: http.status,
          candidates,
        }),
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
    data: honestyData({
      query,
      keysConfigured,
      shopDomain: input.vault?.shopDomain ?? null,
      candidates: [],
    }),
  };
}
