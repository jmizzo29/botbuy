import { requireApiUser } from "@/lib/api-auth";
import { startConnectorOauth } from "@/lib/connectors/oauth";

/**
 * OAuth start. Prefer Shopify OAuth when vault key + app client + shop are present.
 * Fail-closed without BOTBUY_VAULT_KEY. POC · not live — Connected ≠ live.
 */
export async function GET(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return startConnectorOauth({
    request,
    userId: gated.user.id,
    provider: "shopify",
    shop: new URL(request.url).searchParams.get("shop"),
  });
}
