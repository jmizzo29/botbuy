import { requireApiUser } from "@/lib/api-auth";
import { completeConnectorOauth } from "@/lib/connectors/oauth";

/**
 * OAuth callback. Encrypt-at-rest via BOTBUY_VAULT_KEY. Never log tokens.
 * Fail-closed without vault key or OAuth env. Not a live public connector.
 */
export async function GET(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return completeConnectorOauth({
    request,
    userId: gated.user.id,
    clerkUserId: gated.user.clerkUserId,
    provider: "shopify",
  });
}
