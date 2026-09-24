import assert from "node:assert/strict";
import { POST } from "../app/api/ingest/candidates/route";
import {
  INGEST_MAX_BYTES,
  INGEST_MAX_PER_MINUTE,
  buildIngestDeal,
  canonicalListingUrl,
  ingestBodySchema,
  ingestDealId,
  ingestRateLimit,
  ingestTokensMatch,
  readIngestBearer,
  resetIngestRateLimit,
} from "../lib/ingest/candidates";

const item = {
  marketplace: "Flippa",
  url: "https://Flippa.com/example-listing/",
  title: "Example SaaS",
  askPriceUsd: 12000,
  binUsd: 15000,
  status: "price_cut" as const,
  notes: "Scanner note",
  firstSeenAt: "2026-09-24T00:00:00.000Z",
  updatedAt: "2026-09-24T12:00:00.000Z",
};

function request(body: string, headers: Record<string, string> = {}) {
  return new Request("https://botbuyer.ai/api/ingest/candidates", {
    method: "POST",
    headers,
    body,
  });
}

resetIngestRateLimit();
delete process.env.BOTBUY_INGEST_TOKEN;
delete process.env.BOTBUY_INGEST_OWNER_USER_ID;

const unconfigured = await POST(request("{}"));
const unconfiguredText = await unconfigured.text();
assert.equal(unconfigured.status, 503);
assert.match(unconfiguredText, /not configured/);
assert.doesNotMatch(unconfiguredText, /sk_|Bearer /);

process.env.BOTBUY_INGEST_TOKEN = "ingest-test-token";
resetIngestRateLimit();

const missing = await POST(
  request(JSON.stringify({ items: [item] }), {
    authorization: "Bearer",
  }),
);
assert.equal(missing.status, 401);
const wrong = await POST(
  request(JSON.stringify({ items: [item] }), {
    authorization: "Bearer wrong-token",
  }),
);
assert.equal(wrong.status, 401);
const wrongBody = await wrong.json();
assert.equal(wrongBody.error, "Unauthorized");
assert.equal(JSON.stringify(wrongBody).includes("ingest-test-token"), false);

assert.equal(readIngestBearer("Bearer ingest-test-token"), "ingest-test-token");
assert.equal(ingestTokensMatch("ingest-test-token", "ingest-test-token"), true);
assert.equal(ingestTokensMatch("short", "ingest-test-token"), false);
assert.equal(ingestTokensMatch("ingest-test-token", "ingest-test-other"), false);

const owned = await POST(
  request(JSON.stringify({ items: [item] }), {
    authorization: "Bearer ingest-test-token",
  }),
);
assert.equal(owned.status, 503);
assert.match(await owned.text(), /owner is not configured/i);

process.env.BOTBUY_INGEST_OWNER_USER_ID = "john-mitchell";
resetIngestRateLimit();

const rejected = ingestBodySchema.safeParse({
  userId: "someone-else",
  items: [item],
});
assert.equal(rejected.success, false);

const autoApprove = ingestBodySchema.safeParse({
  items: [{ ...item, autoApprove: true }],
});
assert.equal(autoApprove.success, false);

const url = canonicalListingUrl(item.url);
assert.equal(url, "https://flippa.com/example-listing");
const id = ingestDealId("Flippa", "https://flippa.com/example-listing");
assert.equal(ingestDealId("flippa", item.url), id);
assert.ok(id.startsWith("ing_"));

const built = buildIngestDeal(item, "john-mitchell");
assert.equal(built.deal.id, id);
assert.equal(built.deal.userId, "john-mitchell");
assert.equal(built.deal.status, "Needs you");
assert.equal(built.deal.source, "imported");
assert.equal(built.deal.priceVerified, false);
assert.equal(built.deal.amountVerified, false);
assert.equal(built.deal.amountStatus, "imported_unverified");
assert.equal(built.deal.agentExecuted, false);
assert.equal(built.deal.priceUsd, 12000);
assert.match(built.deal.notes, /listing_status=price_cut/);
assert.match(built.deal.notes, /auto-approve OFF/);
assert.equal(built.event.toStatus, "Needs you");

const rescan = buildIngestDeal(
  { ...item, askPriceUsd: 9000, status: "sold" },
  "john-mitchell",
);
assert.equal(rescan.deal.id, built.deal.id);
assert.equal(rescan.deal.status, "Needs you");
assert.equal(rescan.deal.priceUsd, 9000);
assert.match(rescan.deal.notes, /listing_status=sold/);
assert.notEqual(rescan.event.id, built.event.id);

const huge = await POST(
  request("x".repeat(INGEST_MAX_BYTES + 1), {
    authorization: "Bearer ingest-test-token",
    "content-length": String(INGEST_MAX_BYTES + 1),
  }),
);
assert.equal(huge.status, 413);

resetIngestRateLimit();
for (let i = 0; i < INGEST_MAX_PER_MINUTE; i += 1) {
  assert.equal(ingestRateLimit("smoke"), true);
}
assert.equal(ingestRateLimit("smoke"), false);

console.log("ingest-candidates-smoke ok");
