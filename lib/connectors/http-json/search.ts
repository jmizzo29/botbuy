import {
  httpJsonRequest,
  resolveHttpJsonCreds,
} from "@/lib/connectors/http-json/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function searchHttpJson(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveHttpJsonCreds(input.vault);
  if (creds) {
    const path = `search?q=${encodeURIComponent(query)}`;
    const http = await httpJsonRequest(creds, path);
    if (http.ok) {
      return {
        ok: true,
        live: false,
        provider: "http_json",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "HTTP JSON search returned. POC · not live — not a public connector.",
        data: { query, host: creds.baseUrl.hostname, httpStatus: http.status },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "http_json",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: "HTTP JSON search stub. Official API path only. Not live.",
    data: { query, results: [], amountStatus: "unverified" },
  };
}
