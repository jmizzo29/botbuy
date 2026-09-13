import {
  digitalOceanRequest,
  resolveDigitalOceanCreds,
} from "@/lib/connectors/digitalocean/client";
import { digitalOceanKeysConfigured } from "@/lib/connectors/keys";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export type DigitalOceanCandidate = {
  title: string;
  kind: "droplet" | "volume";
  handle: string;
  listingId: string;
  region: string;
  sizeSlug: string;
  amountStatus: "unverified";
};

function stringField(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function regionSlug(row: Record<string, unknown>) {
  const region = row.region;
  if (typeof region === "string") return region;
  if (region && typeof region === "object") {
    return stringField(region as Record<string, unknown>, "slug");
  }
  return "";
}

function sizeSlug(row: Record<string, unknown>) {
  return (
    stringField(row, "size_slug") ||
    (row.size && typeof row.size === "object"
      ? stringField(row.size as Record<string, unknown>, "slug")
      : "")
  );
}

function matchesQuery(title: string, query: string) {
  if (!query) return true;
  return title.toLowerCase().includes(query.toLowerCase());
}

function parsePool(
  rows: unknown,
  kind: DigitalOceanCandidate["kind"],
  query: string,
): DigitalOceanCandidate[] {
  if (!Array.isArray(rows)) return [];
  const out: DigitalOceanCandidate[] = [];
  for (const raw of rows) {
    if (!raw || typeof raw !== "object") continue;
    const record = raw as Record<string, unknown>;
    const title = stringField(record, "name") || String(record.id ?? "");
    if (!title || !matchesQuery(title, query)) continue;
    out.push({
      title,
      kind,
      handle: stringField(record, "name"),
      listingId: String(record.id ?? ""),
      region: regionSlug(record),
      sizeSlug: kind === "droplet" ? sizeSlug(record) : "",
      amountStatus: "unverified",
    });
  }
  return out;
}

/** Map official DigitalOcean JSON lists into unverified droplet/volume rows. */
export function parseDigitalOceanCandidates(body: string, query = ""): DigitalOceanCandidate[] {
  try {
    const json = JSON.parse(body) as Record<string, unknown>;
    return [
      ...parsePool(json.droplets, "droplet", query),
      ...parsePool(json.volumes, "volume", query),
    ].slice(0, 5);
  } catch {
    return [];
  }
}

function honestyData(input: {
  query: string;
  keysConfigured: boolean;
  httpStatus?: number | null;
  candidates: DigitalOceanCandidate[];
}) {
  return {
    query: input.query,
    keysConfigured: input.keysConfigured,
    catalog: "digitalocean",
    httpStatus: input.httpStatus ?? null,
    droplets: input.candidates.filter((row) => row.kind === "droplet"),
    volumes: input.candidates.filter((row) => row.kind === "volume"),
    candidates: input.candidates,
    amountStatus: "unverified" as const,
    live: false as const,
  };
}

export async function searchDigitalOcean(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveDigitalOceanCreds(input.vault);
  const keysConfigured = digitalOceanKeysConfigured(input.vault);
  if (creds) {
    const dropletHttp = await digitalOceanRequest(creds, "droplets?per_page=5");
    if (dropletHttp.ok) {
      const volumeHttp = await digitalOceanRequest(creds, "volumes?per_page=5");
      const fromDroplets = parseDigitalOceanCandidates(dropletHttp.body ?? "", query);
      const fromVolumes = volumeHttp.ok
        ? parseDigitalOceanCandidates(volumeHttp.body ?? "", query)
        : [];
      const seen = new Set(fromDroplets.map((row) => `${row.kind}:${row.listingId}`));
      const candidates = [...fromDroplets];
      for (const row of fromVolumes) {
        const key = `${row.kind}:${row.listingId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.push(row);
        if (candidates.length >= 5) break;
      }
      return {
        ok: true,
        live: false,
        provider: "digitalocean",
        tool: "search",
        dealId: null,
        result: "http",
        reason:
          "DigitalOcean droplets/volumes search returned. Official API · POC · not live — not a public connector.",
        data: honestyData({
          query,
          keysConfigured: true,
          httpStatus: dropletHttp.status,
          candidates,
        }),
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "digitalocean",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: keysConfigured
      ? "DigitalOcean keys present but search stayed a stub. Official API only. Not live."
      : "DigitalOcean droplets/volumes search stub. keysConfigured=false · official API only · not live.",
    data: honestyData({
      query,
      keysConfigured,
      candidates: [],
    }),
  };
}
