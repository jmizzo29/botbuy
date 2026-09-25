import {
  digitalOceanRequest,
  resolveDigitalOceanCreds,
} from "@/lib/connectors/digitalocean/client";
import { digitalOceanKeysConfigured } from "@/lib/connectors/keys";
import { unverifiedListedUsd } from "@/lib/connectors/search-handoff";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

function parseDigitalOceanSizeUsd(body: string, query?: string): number | null {
  try {
    const json = JSON.parse(body) as {
      sizes?: { slug?: string; price_monthly?: number; available?: boolean }[];
    };
    const rows = Array.isArray(json.sizes) ? json.sizes : [];
    const needle = (query ?? "").trim().toLowerCase();
    const match =
      rows.find(
        (row) =>
          needle &&
          typeof row.slug === "string" &&
          row.slug.toLowerCase().includes(needle),
      ) ?? rows.find((row) => row.available !== false);
    const monthly = match?.price_monthly;
    return typeof monthly === "number" ? unverifiedListedUsd(monthly) : null;
  } catch {
    return null;
  }
}

export async function quoteDigitalOcean(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const keysConfigured = digitalOceanKeysConfigured(input.vault);
  const creds = resolveDigitalOceanCreds(input.vault);
  if (creds) {
    const http = await digitalOceanRequest(creds, "sizes?per_page=5");
    if (http.ok) {
      const listedUsd = parseDigitalOceanSizeUsd(http.body ?? "", query);
      return {
        ok: true,
        live: false,
        provider: "digitalocean",
        tool: "quote",
        dealId: null,
        result: "http",
        reason:
          "DigitalOcean sizes returned. Listed monthly price unverified. Not a verified price. Not live.",
        data: {
          query: query || null,
          keysConfigured: true,
          httpStatus: http.status,
          listedUsd,
          amountStatus: "unverified",
          verified: false,
        },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "digitalocean",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: keysConfigured
      ? "DigitalOcean keys present but quote stayed a stub. Listed price unverified. Not live."
      : "DigitalOcean quote stub. keysConfigured=false · listed price unverified · not live.",
    data: {
      query: query || null,
      keysConfigured,
      listedUsd: null,
      amountStatus: "unverified",
      verified: false,
    },
  };
}
