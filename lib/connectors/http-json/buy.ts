import { connectorsLiveEnabled } from "@/lib/connectors/http";
import {
  httpJsonRequest,
  resolveHttpJsonCreds,
} from "@/lib/connectors/http-json/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function buyHttpJson(input: {
  query?: string;
  product?: string;
  dealId: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.product ?? input.query ?? "").trim();
  const creds = resolveHttpJsonCreds(input.vault);

  if (creds && connectorsLiveEnabled() && query) {
    const http = await httpJsonRequest(creds, "buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        dealId: input.dealId,
        live: false,
      }),
    });
    return {
      ok: http.ok,
      live: false,
      provider: "http_json",
      tool: "buy",
      dealId: input.dealId,
      result: http.ok ? "http" : "error",
      reason: http.ok
        ? "HTTP JSON buy called after human approve. Still not a public live connector."
        : "HTTP JSON buy failed. Not live.",
      data: { query, httpStatus: http.status },
    };
  }

  return {
    ok: true,
    live: false,
    provider: "http_json",
    tool: "buy",
    dealId: input.dealId,
    result: "stub",
    reason: "HTTP JSON buy stub. Deal was approved. Execution is not live.",
    data: { query: query || null },
  };
}
