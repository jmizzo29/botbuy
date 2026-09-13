import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { CONNECT_ACCOUNTS_HONESTY } from "@/lib/connectors/copy";
import { shopifyOauthConfigured } from "@/lib/connectors/http";
import { normalizeShopifyShop } from "@/lib/connectors/shopify";

/**
 * OAuth start. Prefer Shopify OAuth when a partner app client is present.
 * POC · not live — no callback exchange is claimed public.
 */
export async function GET(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const clientId = process.env.SHOPIFY_OAUTH_CLIENT_ID?.trim();
  const redirect = process.env.SHOPIFY_OAUTH_REDIRECT_URL?.trim();
  const shop = normalizeShopifyShop(
    new URL(request.url).searchParams.get("shop"),
  );
  if (!shopifyOauthConfigured() || !clientId || !shop) {
    return NextResponse.json(
      {
        error:
          "Shopify OAuth is preferred but not configured. Admin API token connect is OK for this POC. Pass ?shop=store.myshopify.com when a client id is set.",
        honesty: CONNECT_ACCOUNTS_HONESTY,
        live: false,
      },
      { status: 501 },
    );
  }
  const authorize = new URL(`https://${shop}/admin/oauth/authorize`);
  authorize.searchParams.set("client_id", clientId);
  if (redirect) authorize.searchParams.set("redirect_uri", redirect);
  authorize.searchParams.set("scope", "read_products,write_draft_orders");
  authorize.searchParams.set("state", "botbuy-poc");
  return NextResponse.redirect(authorize);
}
