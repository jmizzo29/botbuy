import { connectorsLiveEnabled } from "@/lib/connectors/http";
import {
  resolveShopifyCreds,
  shopifyAdminRequest,
} from "@/lib/connectors/shopify/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function buyShopifyProduct(input: {
  query?: string;
  product?: string;
  sku?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const title = (input.product ?? input.query ?? "").trim();
  const creds = resolveShopifyCreds(input.vault);

  if (creds && connectorsLiveEnabled() && title) {
    const http = await shopifyAdminRequest(creds, "/draft_orders.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft_order: {
          line_items: [
            {
              title,
              quantity: 1,
              sku: input.sku ?? undefined,
            },
          ],
          note: `BotBuyer deal ${input.dealId} · not a public live connector`,
        },
      }),
    });
    return {
      ok: http.ok,
      live: false,
      provider: "shopify",
      tool: "buy",
      dealId: input.dealId,
      result: http.ok ? "http" : "error",
      reason: http.ok
        ? "Shopify draft order called after human approve. Still not a public live connector."
        : "Shopify buy failed. Not live.",
      data: { title, httpStatus: http.status },
    };
  }

  return {
    ok: true,
    live: false,
    provider: "shopify",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: "Shopify buy stub. Deal was approved. Execution is not live.",
    data: { title: title || null, sku: input.sku ?? null },
  };
}
