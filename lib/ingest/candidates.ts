import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";
import type { Deal, DealEvent } from "@/lib/types";

export const INGEST_TOKEN_ENV = "BOTBUY_INGEST_TOKEN";
export const INGEST_OWNER_ENV = "BOTBUY_INGEST_OWNER_USER_ID";

export const INGEST_MAX_BYTES = 64 * 1024;
export const INGEST_MAX_ITEMS = 25;
export const INGEST_MAX_PER_MINUTE = 30;

export const LISTING_STATUSES = ["new", "price_cut", "ended", "sold"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

const httpsUrl = z
  .string()
  .trim()
  .url()
  .max(500)
  .refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Listing URL must be https");

const money = z.number().finite().nonnegative().max(50_000_000);
const stamp = z
  .string()
  .trim()
  .max(40)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid timestamp");

export const ingestItemSchema = z
  .object({
    marketplace: z.string().trim().min(1).max(80),
    url: httpsUrl,
    title: z.string().trim().min(1).max(200),
    askPriceUsd: money,
    binUsd: money.optional(),
    reserveUsd: money.optional(),
    claimedMonthlyProfitUsd: money.optional(),
    claimedMonthlyRevenueUsd: money.optional(),
    traffic: z.union([z.string().trim().max(120), z.number().finite()]).optional(),
    status: z.enum(LISTING_STATUSES),
    notes: z.string().trim().max(2000).optional(),
    verdict: z.string().trim().max(500).optional(),
    firstSeenAt: stamp.optional(),
    updatedAt: stamp.optional(),
  })
  .strict();

export const ingestBodySchema = z
  .object({
    items: z.array(ingestItemSchema).min(1).max(INGEST_MAX_ITEMS),
  })
  .strict();

export type IngestItem = z.infer<typeof ingestItemSchema>;

/** Hash both sides so length differences still compare in constant time. */
export function ingestTokensMatch(provided: string, expected: string) {
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function readIngestBearer(header: string | null) {
  if (!header) return "";
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return match?.[1] ?? "";
}

export function canonicalListingUrl(raw: string) {
  const url = new URL(raw.trim());
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }
  return url.toString();
}

export function ingestDealId(marketplace: string, url: string) {
  const key = `${marketplace.trim().toLowerCase()}\n${canonicalListingUrl(url)}`;
  return `ing_${createHash("sha256").update(key).digest("hex").slice(0, 24)}`;
}

export function listingStatusFromNotes(notes: string | null | undefined) {
  const match = notes?.match(/listing_status=([a-z_]+)/);
  return match?.[1] ?? null;
}

const hits = new Map<string, number[]>();

export function ingestRateLimit(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((at) => now - at < 60_000);
  if (recent.length >= INGEST_MAX_PER_MINUTE) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** Test hook. */
export function resetIngestRateLimit() {
  hits.clear();
}

export function buildIngestDeal(item: IngestItem, ownerUserId: string) {
  const url = canonicalListingUrl(item.url);
  const id = ingestDealId(item.marketplace, url);
  const at = item.updatedAt ?? new Date().toISOString();
  const traffic = item.traffic == null ? null : String(item.traffic);
  const notes = [
    "Imported scan · unverified · not spend · auto-approve OFF.",
    `listing_status=${item.status}`,
    `Listing ${url}`,
    `Ask $${item.askPriceUsd} · unverified · not booked as spend.`,
    item.binUsd != null ? `BIN $${item.binUsd} unverified.` : null,
    item.reserveUsd != null ? `Reserve $${item.reserveUsd} unverified.` : null,
    item.claimedMonthlyProfitUsd != null
      ? `Claimed monthly profit $${item.claimedMonthlyProfitUsd} unverified.`
      : null,
    item.claimedMonthlyRevenueUsd != null
      ? `Claimed monthly revenue $${item.claimedMonthlyRevenueUsd} unverified.`
      : null,
    traffic ? `Traffic ${traffic} unverified.` : null,
    item.verdict ? `Verdict: ${item.verdict}` : null,
    item.notes ? `Scanner: ${item.notes}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const deal: Deal = {
    id,
    userId: ownerUserId,
    title: item.title.slice(0, 80),
    category: "general",
    marketplace: item.marketplace.trim().toLowerCase(),
    status: "Needs you",
    priceUsd: item.askPriceUsd,
    currency: "USD",
    openedAt: item.firstSeenAt ?? at,
    closedAt: null,
    parentDealId: null,
    receipt: null,
    escrow: null,
    domainTransfer: null,
    blockers: [
      "Needs your approval before any spend. Auto-approve OFF.",
      ...(item.status === "sold" || item.status === "ended"
        ? [`Listing status: ${item.status}. BotBuyer did not buy this.`]
        : []),
    ],
    notes,
    source: "imported",
    agentExecuted: false,
    priceVerified: false,
    amountVerified: false,
    amountStatus: "imported_unverified",
    evidencePath: url,
    verification: {
      passed: false,
      skipped_reason: null,
      artifacts: [],
      receipt_refs: { listing_url: url },
    },
    timeline: [],
  };

  const event: DealEvent = {
    id: `evt_${id}_${createHash("sha256").update(`${item.status}|${item.askPriceUsd}|${at}`).digest("hex").slice(0, 12)}`,
    dealId: id,
    type: "import",
    stage: "gate",
    title:
      item.status === "new"
        ? "Scanner found a listing"
        : "Scanner updated this listing",
    detail: `${item.title} · listing_status=${item.status} · listed $${item.askPriceUsd} unverified · ${url}`,
    at,
    status: "blocked",
    actor: "imported",
    toStatus: "Needs you",
  };

  return { deal, event };
}

export function ingestClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}
