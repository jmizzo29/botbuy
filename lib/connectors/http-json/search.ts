import {
  httpJsonRequest,
  resolveHttpJsonCreds,
} from "@/lib/connectors/http-json/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function stringField(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

/** Map official HTTPS JSON search bodies into unverified candidate rows. */
export function parseHttpJsonCandidates(body: string) {
  try {
    const json = JSON.parse(body) as unknown;
    const root =
      Array.isArray(json)
        ? { results: json }
        : json && typeof json === "object"
          ? (json as Record<string, unknown>)
          : {};
    const nested =
      root.data && typeof root.data === "object" && !Array.isArray(root.data)
        ? (root.data as Record<string, unknown>)
        : null;
    const pools = [
      root.candidates,
      root.results,
      root.products,
      root.items,
      Array.isArray(root.data) ? root.data : null,
      nested?.candidates,
      nested?.results,
      nested?.products,
      nested?.items,
    ];
    const rows: {
      title: string;
      handle: string;
      sku: string;
      amountStatus: "unverified";
    }[] = [];
    const seen = new Set<string>();
    for (const pool of pools) {
      if (!Array.isArray(pool)) continue;
      for (const row of pool) {
        if (!row || typeof row !== "object") continue;
        const record = row as Record<string, unknown>;
        const title =
          stringField(record, "title") ||
          stringField(record, "name") ||
          stringField(record, "id") ||
          stringField(record, "sku") ||
          stringField(record, "handle");
        if (!title || seen.has(title.toLowerCase())) continue;
        seen.add(title.toLowerCase());
        rows.push({
          title,
          handle: stringField(record, "handle"),
          sku: stringField(record, "sku"),
          amountStatus: "unverified",
        });
        if (rows.length >= 5) return rows;
      }
    }
    return rows;
  } catch {
    return [];
  }
}

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
      const candidates = parseHttpJsonCandidates(http.body ?? "");
      return {
        ok: true,
        live: false,
        provider: "http_json",
        tool: "search",
        dealId: null,
        result: "http",
        reason: "HTTP JSON search returned. POC · not live — not a public connector.",
        data: {
          query,
          host: creds.baseUrl.hostname,
          httpStatus: http.status,
          results: candidates,
          candidates,
          amountStatus: "unverified",
        },
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
    data: { query, results: [], candidates: [], amountStatus: "unverified" },
  };
}
