import { safeProviderFetch } from "@/lib/connectors/http";
import type { VaultSecretPayload } from "@/lib/connectors/types";

export const SHOPIFY_API_VERSION = "2026-04";

const SHOP_HOST =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.myshopify\.com$/;

export function normalizeShopifyShop(raw?: string | null): string | null {
  const trimmed = (raw ?? "").trim().toLowerCase();
  if (!trimmed) return null;
  const host = trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!SHOP_HOST.test(host)) return null;
  return host;
}

export function resolveShopifyCreds(vault: VaultSecretPayload | null) {
  const shopDomain =
    normalizeShopifyShop(vault?.shopDomain) ||
    normalizeShopifyShop(process.env.SHOPIFY_SHOP_DOMAIN);
  const token =
    vault?.oauthAccess?.trim() ||
    vault?.apiKey?.trim() ||
    process.env.SHOPIFY_ADMIN_TOKEN?.trim();
  if (!shopDomain || !token) return null;
  return { shopDomain, token };
}

export async function shopifyAdminRequest(
  creds: NonNullable<ReturnType<typeof resolveShopifyCreds>>,
  path: string,
  init?: RequestInit,
) {
  const url = `https://${creds.shopDomain}/admin/api/${SHOPIFY_API_VERSION}${path}`;
  return safeProviderFetch(url, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": creds.token,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}
