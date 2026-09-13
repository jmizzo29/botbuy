import {
  githubRequest,
  resolveGithubCreds,
} from "@/lib/connectors/github/client";
import { githubKeysConfigured } from "@/lib/connectors/keys";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export type GithubCandidate = {
  title: string;
  kind: "repository";
  handle: string;
  listingId: string;
  htmlUrl: string;
  amountStatus: "unverified";
};

function stringField(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function matchesQuery(title: string, query: string) {
  if (!query) return true;
  return title.toLowerCase().includes(query.toLowerCase());
}

/** Map official GitHub Search JSON into unverified repo rows. No invented prices. */
export function parseGithubCandidates(body: string, query = ""): GithubCandidate[] {
  try {
    const json = JSON.parse(body) as { items?: unknown };
    const rows = Array.isArray(json.items) ? json.items : [];
    const out: GithubCandidate[] = [];
    for (const raw of rows) {
      if (!raw || typeof raw !== "object") continue;
      const record = raw as Record<string, unknown>;
      const title =
        stringField(record, "full_name") ||
        stringField(record, "name") ||
        String(record.id ?? "");
      if (!title || !matchesQuery(title, query)) continue;
      out.push({
        title,
        kind: "repository",
        handle: stringField(record, "full_name") || stringField(record, "name"),
        listingId: String(record.id ?? title),
        htmlUrl: stringField(record, "html_url"),
        amountStatus: "unverified",
      });
      if (out.length >= 5) break;
    }
    return out;
  } catch {
    return [];
  }
}

function honestyData(input: {
  query: string;
  keysConfigured: boolean;
  httpStatus?: number | null;
  candidates: GithubCandidate[];
}) {
  return {
    query: input.query,
    keysConfigured: input.keysConfigured,
    catalog: "github",
    httpStatus: input.httpStatus ?? null,
    repositories: input.candidates,
    candidates: input.candidates,
    amountStatus: "unverified" as const,
    live: false as const,
  };
}

export async function searchGithub(input: {
  query?: string;
  product?: string;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const query = (input.query ?? input.product ?? "").trim();
  const creds = resolveGithubCreds(input.vault);
  const keysConfigured = githubKeysConfigured(input.vault);
  if (creds && query) {
    const path = `search/repositories?q=${encodeURIComponent(query)}&per_page=5`;
    const http = await githubRequest(creds, path);
    if (http.ok) {
      const candidates = parseGithubCandidates(http.body ?? "", query);
      return {
        ok: true,
        live: false,
        provider: "github",
        tool: "search",
        dealId: null,
        result: "http",
        reason:
          "GitHub repository search returned. Official API · POC · not live — not a public connector.",
        data: honestyData({
          query,
          keysConfigured: true,
          httpStatus: http.status,
          candidates,
        }),
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "github",
    tool: "search",
    dealId: null,
    result: "stub",
    reason: keysConfigured
      ? query
        ? "GitHub keys present but search stayed a stub. Official API only. Not live."
        : "GitHub search stub. Query required — no invented catalog. Official API only. Not live."
      : "GitHub repository search stub. keysConfigured=false · official API only · not live.",
    data: honestyData({
      query,
      keysConfigured,
      candidates: [],
    }),
  };
}
