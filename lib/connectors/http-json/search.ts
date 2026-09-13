import { httpJsonEnvPresent } from "@/lib/connectors/http";
import {
  httpJsonRequest,
  resolveHttpJsonCreds,
} from "@/lib/connectors/http-json/client";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function stringField(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export type HttpJsonCandidate = {
  title: string;
  handle: string;
  sku: string;
  listingId: string;
  vin: string;
  make: string;
  model: string;
  address: string;
  location: string;
  amountStatus: "unverified";
};

function listingTitle(record: Record<string, unknown>): string {
  const make = stringField(record, "make");
  const model = stringField(record, "model");
  const year = stringField(record, "year");
  const vehicle = [year, make, model].filter(Boolean).join(" ");
  return (
    stringField(record, "title") ||
    stringField(record, "name") ||
    stringField(record, "address") ||
    stringField(record, "location") ||
    vehicle ||
    stringField(record, "vin") ||
    stringField(record, "listingId") ||
    stringField(record, "id") ||
    stringField(record, "sku") ||
    stringField(record, "handle")
  );
}

/** Map official HTTPS JSON search bodies into unverified listing rows. */
export function parseHttpJsonCandidates(body: string): HttpJsonCandidate[] {
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
      root.listings,
      Array.isArray(root.data) ? root.data : null,
      nested?.candidates,
      nested?.results,
      nested?.products,
      nested?.items,
      nested?.listings,
    ];
    const rows: HttpJsonCandidate[] = [];
    const seen = new Set<string>();
    for (const pool of pools) {
      if (!Array.isArray(pool)) continue;
      for (const row of pool) {
        if (!row || typeof row !== "object") continue;
        const record = row as Record<string, unknown>;
        const title = listingTitle(record);
        if (!title || seen.has(title.toLowerCase())) continue;
        seen.add(title.toLowerCase());
        rows.push({
          title,
          handle: stringField(record, "handle"),
          sku: stringField(record, "sku"),
          listingId: stringField(record, "listingId") || stringField(record, "id"),
          vin: stringField(record, "vin"),
          make: stringField(record, "make"),
          model: stringField(record, "model"),
          address: stringField(record, "address"),
          location: stringField(record, "location") || stringField(record, "city"),
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

export function httpJsonKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveHttpJsonCreds(vault) || httpJsonEnvPresent());
}

function honestyData(input: {
  query: string;
  keysConfigured: boolean;
  host: string | null;
  httpStatus?: number | null;
  candidates: HttpJsonCandidate[];
}) {
  return {
    query: input.query,
    keysConfigured: input.keysConfigured,
    host: input.host,
    httpStatus: input.httpStatus ?? null,
    catalog: "official_https_json",
    categoryAgnostic: true,
    results: input.candidates,
    candidates: input.candidates,
    listings: input.candidates,
    amountStatus: "unverified" as const,
    live: false as const,
  };
}

export async function searchHttpJson(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveHttpJsonCreds(input.vault);
  const keysConfigured = Boolean(creds);
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
        reason:
          "HTTP JSON catalog search returned. Category-agnostic · POC · not live — not a public connector.",
        data: honestyData({
          query,
          keysConfigured: true,
          host: creds.baseUrl.hostname,
          httpStatus: http.status,
          candidates,
        }),
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
    reason:
      keysConfigured
        ? "HTTP JSON catalog keys present but search stayed a stub. Official API path only. Not live."
        : "HTTP JSON catalog search stub. keysConfigured=false · official HTTPS JSON only · category-agnostic · not live.",
    data: honestyData({
      query,
      keysConfigured,
      host: creds?.baseUrl.hostname ?? null,
      candidates: [],
    }),
  };
}
