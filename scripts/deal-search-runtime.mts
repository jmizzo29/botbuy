import { SEED_OWNER } from "../lib/auth-owner.ts";
import { applyDealSearchPipeline } from "../lib/connectors/deal-search.ts";
import { connectorResultHasCandidates } from "../lib/connectors/intent-route.ts";
import { addIntent, createSearchingDealFromIntent, listDealEvents } from "../lib/store.ts";

const stamp = Date.now();
const software = addIntent(
  {
    summary: `Find software we can buy across vendor checkout for M1 smoke ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 50,
  },
  SEED_OWNER.id,
);
const softwareDeal = await createSearchingDealFromIntent(
  software,
  SEED_OWNER.id,
  "m1@example.com",
);
const softwareEvents = listDealEvents(softwareDeal.id);
const softwareSearch = softwareEvents.find((event) =>
  event.id.endsWith("_connector_search"),
);
if (!softwareSearch) throw new Error("software intent missing connector search event");
if (!softwareSearch.detail.includes("live:false")) {
  throw new Error("software search event must be typed stub live:false");
}
if (softwareDeal.status !== "Searching") {
  throw new Error("software stub must stay Searching");
}
if (softwareDeal.priceUsd !== 0 || softwareDeal.amountVerified || softwareDeal.priceVerified) {
  throw new Error("software deal must stay $0 unverified");
}

const domain = addIntent(
  {
    summary: `Secure a clean product domain botbuyer.ai for M1 smoke ${stamp}.`,
    categories: ["domain"],
    maxPriceUsd: 50,
  },
  SEED_OWNER.id,
);
const domainDeal = await createSearchingDealFromIntent(
  domain,
  SEED_OWNER.id,
  "m1@example.com",
);
const domainEvents = listDealEvents(domainDeal.id);
const domainSearch = domainEvents.find((event) =>
  event.id.endsWith("_connector_search"),
);
if (!domainSearch) throw new Error("domain intent missing connector search event");
if (!domainSearch.detail.includes("live:false")) {
  throw new Error("domain search event must include live:false");
}
if (!domainSearch.detail.includes("namecheap")) {
  throw new Error("domain search should attempt Namecheap");
}
if (domainDeal.priceUsd !== 0 || domainDeal.amountVerified) {
  throw new Error("domain deal must not invent verified spend");
}

const phone = addIntent(
  {
    summary: `Find a Twilio SMS number in 415 for M1 smoke ${stamp}.`,
    categories: ["phone"],
    maxPriceUsd: 50,
  },
  SEED_OWNER.id,
);
const phoneDeal = await createSearchingDealFromIntent(phone, SEED_OWNER.id);
const phoneSearch = listDealEvents(phoneDeal.id).find((event) =>
  event.id.endsWith("_connector_search"),
);
if (!phoneSearch?.detail.includes("twilio")) {
  throw new Error("phone search should attempt Twilio");
}
if (!phoneSearch.detail.includes("live:false")) {
  throw new Error("phone search event must include live:false");
}

if (connectorResultHasCandidates({ available: null, candidates: [] })) {
  throw new Error("empty stub must not look like candidates");
}

const replay = await applyDealSearchPipeline({
  deal: softwareDeal,
  userId: SEED_OWNER.id,
  intent: software,
});
const replayCount = listDealEvents(replay.id).filter((event) =>
  event.id.endsWith("_connector_search"),
).length;
if (replayCount !== 1) throw new Error("pipeline must be idempotent");

console.log("deal-search-runtime PASS");
console.log(` - software ${softwareDeal.id} Searching stub`);
console.log(` - domain ${domainDeal.id} Namecheap search live:false`);
console.log(` - phone ${phoneDeal.id} Twilio search live:false`);
