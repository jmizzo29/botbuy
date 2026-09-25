import { githubKeysConfigured } from "@/lib/connectors/keys";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteGithub(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const keysConfigured = githubKeysConfigured(input.vault);
  return {
    ok: true,
    live: false,
    provider: "github",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason:
      "GitHub quote stub. Repos and marketplace listings stay unverified. Not a listed price. Not live.",
    data: {
      query: input.query ?? input.product ?? null,
      keysConfigured,
      listedUsd: null,
      amountStatus: "unverified",
      verified: false,
    },
  };
}
