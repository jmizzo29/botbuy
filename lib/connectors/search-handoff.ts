/** Structured search → human-review handoff. Soft HOLD. Never invent verified prices. */

import { CONNECTOR_TECH_LOCK_NOTE } from "@/lib/connectors/tech-lock";
import type { DealEvent } from "@/lib/types";

export const SEARCH_ACT_HANDOFF_KIND = "search_act_handoff" as const;

export type SearchActCandidateKind =
  | "domain"
  | "phone"
  | "product"
  | "listing"
  | "result";

export interface SearchActCandidate {
  label: string;
  kind: SearchActCandidateKind;
  provider: string;
  available: boolean | null;
  listedUsd: number | null;
  amountStatus: "unverified";
  verified: false;
  domain?: string;
  phoneNumber?: string;
  title?: string;
  handle?: string;
  sku?: string;
  listingId?: string;
  vin?: string;
  address?: string;
}

export interface SearchActQuote {
  provider: string;
  listedUsd: number | null;
  amountStatus: "unverified";
  verified: false;
}

export interface SearchActHandoff {
  kind: typeof SEARCH_ACT_HANDOFF_KIND;
  live: false;
  provider: string;
  fixture?: boolean;
  candidates: SearchActCandidate[];
  quote: SearchActQuote | null;
}

export const HUMAN_REVIEW_BLOCKER =
  "Designated-holder Approve sheet required. Auto-approve OFF." as const;

export const SEARCH_ACT_HOLD_NOTE =
  `Candidates attached · Needs you · human review · not bought · auto-approve OFF. ${CONNECTOR_TECH_LOCK_NOTE}` as const;

export function connectorCandidatesEventId(dealId: string) {
  return `evt_${dealId}_connector_candidates`;
}

export function searchActHandoffEventId(dealId: string) {
  return `evt_${dealId}_search_act`;
}

export function dealHasSearchActHandoff(
  dealId: string,
  events: Pick<DealEvent, "id">[],
) {
  return events.some((event) => event.id === searchActHandoffEventId(dealId));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Only copy an explicit listedUsd number. Never invent or mark verified. */
export function unverifiedListedUsd(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

function stringField(row: Record<string, unknown>, key: string): string | undefined {
  const value = row[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function collectCandidateRows(
  data: Record<string, unknown> | undefined,
): Record<string, unknown>[] {
  if (!data) return [];
  const rows: Record<string, unknown>[] = [];
  const pools = [
    data.candidates,
    data.products,
    data.results,
    data.items,
    data.listings,
  ];
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    for (const row of pool) {
      const record = asRecord(row);
      if (record) rows.push(record);
    }
  }
  if (Array.isArray(data.available)) {
    for (const row of data.available) {
      const record = asRecord(row);
      if (record) rows.push(record);
    }
  }
  if (data.available === true && typeof data.domain === "string" && data.domain) {
    rows.push({
      domain: data.domain,
      available: true,
      amountStatus: "unverified",
    });
  }
  return rows;
}

export function normalizeSearchCandidates(
  data: Record<string, unknown> | undefined,
  provider: string,
): SearchActCandidate[] {
  const seen = new Set<string>();
  const out: SearchActCandidate[] = [];
  for (const row of collectCandidateRows(data)) {
    const domain = stringField(row, "domain");
    const phoneNumber = stringField(row, "phoneNumber");
    const title = stringField(row, "title");
    const handle = stringField(row, "handle");
    const sku = stringField(row, "sku");
    const name = stringField(row, "name");
    const id = stringField(row, "id");
    const listingId = stringField(row, "listingId");
    const vin = stringField(row, "vin");
    const address = stringField(row, "address") || stringField(row, "location");
    const make = stringField(row, "make");
    const model = stringField(row, "model");
    const vehicle = [make, model].filter(Boolean).join(" ");
    const label =
      title ||
      handle ||
      sku ||
      domain ||
      phoneNumber ||
      address ||
      vehicle ||
      vin ||
      listingId ||
      name ||
      id;
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const listing = Boolean(listingId || vin || address || vehicle);
    const kind: SearchActCandidateKind = domain
      ? "domain"
      : phoneNumber
        ? "phone"
        : listing
          ? "listing"
          : title || handle || sku
            ? "product"
            : "result";
    out.push({
      label,
      kind,
      provider,
      available:
        row.available === true ? true : row.available === false ? false : null,
      listedUsd: unverifiedListedUsd(row.listedUsd),
      amountStatus: "unverified",
      verified: false,
      domain,
      phoneNumber,
      title,
      handle,
      sku,
      listingId,
      vin,
      address,
    });
    if (out.length >= 8) break;
  }
  return out;
}

export function normalizeSearchQuote(
  data: Record<string, unknown> | undefined,
  provider: string,
): SearchActQuote | null {
  if (!data) return null;
  return {
    provider,
    listedUsd: unverifiedListedUsd(data.listedUsd),
    amountStatus: "unverified",
    verified: false,
  };
}

export function buildSearchActHandoff(input: {
  provider: string;
  searchData?: Record<string, unknown>;
  quoteData?: Record<string, unknown> | null;
  fixture?: boolean;
}): SearchActHandoff {
  return {
    kind: SEARCH_ACT_HANDOFF_KIND,
    live: false,
    provider: input.provider,
    fixture: input.fixture === true,
    candidates: normalizeSearchCandidates(input.searchData, input.provider),
    quote: normalizeSearchQuote(input.quoteData ?? undefined, input.provider),
  };
}

export function formatSearchActDetail(handoff: SearchActHandoff): string {
  const labels = handoff.candidates.map((row) => row.label).join("; ") || "none";
  const listed =
    handoff.quote?.listedUsd == null
      ? "null"
      : String(handoff.quote.listedUsd);
  return [
    "live:false",
    handoff.fixture ? "fixture=true" : null,
    `provider=${handoff.provider}`,
    `candidates=${handoff.candidates.length}`,
    `labels=${labels}`,
    `quoteListedUsd=${listed}`,
    "amountStatus=unverified",
    "verified=false",
    "not a verified price",
    CONNECTOR_TECH_LOCK_NOTE,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function readSearchActHandoff(
  events: DealEvent[],
): SearchActHandoff | null {
  for (const event of events) {
    const meta = event.metadata;
    if (!meta || meta.kind !== SEARCH_ACT_HANDOFF_KIND) continue;
    const candidates = Array.isArray(meta.candidates) ? meta.candidates : [];
    const rows = candidates
      .map((row) => asRecord(row))
      .filter((row): row is Record<string, unknown> => Boolean(row))
      .map((row) => ({
        label: typeof row.label === "string" ? row.label : "",
        kind: (typeof row.kind === "string" ? row.kind : "result") as SearchActCandidateKind,
        provider: typeof row.provider === "string" ? row.provider : "none",
        available:
          row.available === true ? true : row.available === false ? false : null,
        listedUsd: unverifiedListedUsd(row.listedUsd),
        amountStatus: "unverified" as const,
        verified: false as const,
        domain: typeof row.domain === "string" ? row.domain : undefined,
        phoneNumber:
          typeof row.phoneNumber === "string" ? row.phoneNumber : undefined,
        title: typeof row.title === "string" ? row.title : undefined,
        handle: typeof row.handle === "string" ? row.handle : undefined,
        sku: typeof row.sku === "string" ? row.sku : undefined,
        listingId: typeof row.listingId === "string" ? row.listingId : undefined,
        vin: typeof row.vin === "string" ? row.vin : undefined,
        address: typeof row.address === "string" ? row.address : undefined,
      }))
      .filter((row) => row.label);
    if (!rows.length) continue;
    const quoteRecord = asRecord(meta.quote);
    return {
      kind: SEARCH_ACT_HANDOFF_KIND,
      live: false,
      provider: typeof meta.provider === "string" ? meta.provider : "none",
      fixture: meta.fixture === true,
      candidates: rows,
      quote: quoteRecord
        ? {
            provider:
              typeof quoteRecord.provider === "string"
                ? quoteRecord.provider
                : "none",
            listedUsd: unverifiedListedUsd(quoteRecord.listedUsd),
            amountStatus: "unverified",
            verified: false,
          }
        : null,
    };
  }
  return null;
}
