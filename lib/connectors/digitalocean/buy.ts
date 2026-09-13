import { connectorsLiveEnabled } from "@/lib/connectors/http";
import { resolveDigitalOceanCreds } from "@/lib/connectors/digitalocean/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

/**
 * Droplet create needs region/size/image. This scaffold will not invent them.
 * Even when BOTBUY_CONNECTORS_LIVE=true after Approve, buy stays a stub.
 */
export async function buyDigitalOcean(input: {
  query?: string;
  product?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.product ?? input.query ?? "").trim();
  const creds = resolveDigitalOceanCreds(input.vault);
  const liveMutations = Boolean(creds && connectorsLiveEnabled() && query);

  return {
    ok: true,
    live: false,
    provider: "digitalocean",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: liveMutations
      ? "DigitalOcean buy stays stub after Approve. Droplet create needs region/size/image — not invented. Not live."
      : "DigitalOcean buy stub. Deal was approved. Execution is not live.",
    data: {
      query: query || null,
      mutationsLiveEnabled: connectorsLiveEnabled(),
      spend: false,
    },
  };
}
