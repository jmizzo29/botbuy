import { connectorsLiveEnabled } from "@/lib/connectors/http";
import { resolveGithubCreds } from "@/lib/connectors/github/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

/**
 * Repo create needs owner / name / visibility. This scaffold will not invent them.
 * Even when BOTBUY_CONNECTORS_LIVE=true after Approve, buy stays a stub.
 */
export async function buyGithub(input: {
  query?: string;
  product?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.product ?? input.query ?? "").trim();
  const creds = resolveGithubCreds(input.vault);
  const liveMutations = Boolean(creds && connectorsLiveEnabled() && query);

  return {
    ok: true,
    live: false,
    provider: "github",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: liveMutations
      ? "GitHub create stays stub after Approve. Repo create needs owner/name/visibility — not invented. Not live."
      : "GitHub create stub. Deal was approved. Execution is not live.",
    data: {
      query: query || null,
      mutationsLiveEnabled: connectorsLiveEnabled(),
      spend: false,
    },
  };
}
