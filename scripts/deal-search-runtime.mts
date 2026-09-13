import { SEED_OWNER } from "../lib/auth-owner.ts";
import {
  assertAuthorizedBuyAllowed,
  assertConnectorSpendAllowed,
} from "../lib/connectors/approve-gate.ts";
import {
  applyDealSearchPipeline,
  applySearchActHandoff,
} from "../lib/connectors/deal-search.ts";
import { parseHttpJsonCandidates } from "../lib/connectors/http-json/search.ts";
import {
  connectorResultHasCandidates,
  officialSearchProvider,
} from "../lib/connectors/intent-route.ts";
import { readSearchActHandoff } from "../lib/connectors/search-handoff.ts";
import {
  addIntent,
  createSearchingDealFromIntent,
  listDealEvents,
  transitionDeal,
} from "../lib/store.ts";

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
if (!softwareSearch.detail.includes("shopify")) {
  throw new Error("software search should attempt Shopify official API");
}
if (softwareDeal.status !== "Searching") {
  throw new Error("software Shopify stub must stay Searching without invented candidates");
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

const catalog = addIntent(
  {
    summary: `Query the official JSON API catalog for act handoff smoke ${stamp}.`,
    categories: ["http_json"],
    maxPriceUsd: 50,
  },
  SEED_OWNER.id,
);
const catalogDeal = await createSearchingDealFromIntent(
  catalog,
  SEED_OWNER.id,
  "m1@example.com",
);
const catalogSearch = listDealEvents(catalogDeal.id).find((event) =>
  event.id.endsWith("_connector_search"),
);
if (!catalogSearch?.detail.includes("http_json")) {
  throw new Error("HTTP JSON intent should attempt official HTTPS JSON search");
}
if (!catalogSearch.detail.includes("live:false")) {
  throw new Error("HTTP JSON search event must include live:false");
}
if (catalogDeal.status !== "Searching") {
  throw new Error("HTTP JSON stub must stay Searching without invented candidates");
}

if (officialSearchProvider("shopify") !== "shopify") {
  throw new Error("Shopify search must resolve from MCP registry");
}
if (officialSearchProvider("http_json") !== "http_json") {
  throw new Error("HTTP JSON search must resolve from MCP registry");
}

const parsedJson = parseHttpJsonCandidates(
  JSON.stringify({
    results: [{ title: "Catalog license", sku: "lic-1" }],
  }),
);
if (parsedJson.length !== 1 || parsedJson[0].title !== "Catalog license") {
  throw new Error("HTTP JSON search must map official JSON rows into candidates");
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

const reviewed = applySearchActHandoff({
  deal: softwareDeal,
  userId: SEED_OWNER.id,
  provider: "shopify",
  searchData: {
    candidates: [
      {
        title: "Invoice tools",
        handle: "invoice-tools",
        amountStatus: "unverified",
      },
    ],
    amountStatus: "unverified",
  },
  quoteData: { listedUsd: null, amountStatus: "unverified" },
});
if (reviewed.status !== "Needs you") {
  throw new Error("candidates must advance Searching → Found → Needs you");
}
if (reviewed.priceUsd !== 0 || reviewed.amountVerified || reviewed.priceVerified) {
  throw new Error("handoff must not invent verified prices");
}
if (reviewed.amountStatus === "verified") {
  throw new Error("handoff must keep amountStatus unverified");
}
const handoff = readSearchActHandoff(listDealEvents(reviewed.id));
if (!handoff || handoff.candidates[0]?.label !== "Invoice tools") {
  throw new Error("deal events must carry structured candidates");
}
if (handoff.live !== false || handoff.quote?.verified !== false) {
  throw new Error("handoff must stay live:false and quote unverified");
}

function expectSpendClosed(run: () => unknown, label: string) {
  try {
    run();
    throw new Error(`${label} must fail closed`);
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : String(error);
    if (name !== "ConnectorError" && !/Fail-closed|Auto-approve is OFF/.test(message)) {
      throw error;
    }
  }
}
expectSpendClosed(
  () =>
    assertConnectorSpendAllowed({
      tool: "buy",
      userId: SEED_OWNER.id,
      dealId: reviewed.id,
    }),
  "buy on Needs you",
);
expectSpendClosed(
  () =>
    assertAuthorizedBuyAllowed({
      userId: SEED_OWNER.id,
      dealId: reviewed.id,
    }),
  "authorized-buy on Needs you",
);

const buying = transitionDeal(reviewed.id, "Buying", SEED_OWNER.id);
if (buying.status !== "Buying") {
  throw new Error("Approve sheet path Needs you → Buying must still work");
}
assertConnectorSpendAllowed({
  tool: "buy",
  userId: SEED_OWNER.id,
  dealId: buying.id,
});
assertAuthorizedBuyAllowed({
  userId: SEED_OWNER.id,
  dealId: buying.id,
});

const replayHandoff = applySearchActHandoff({
  deal: buying,
  userId: SEED_OWNER.id,
  provider: "shopify",
  searchData: {
    candidates: [{ title: "Invoice tools", amountStatus: "unverified" }],
  },
});
if (replayHandoff.status !== "Buying") {
  throw new Error("search act handoff must be idempotent after approve");
}

console.log("deal-search-runtime PASS");
console.log(` - software ${softwareDeal.id} Shopify search live:false`);
console.log(` - domain ${domainDeal.id} Namecheap search live:false`);
console.log(` - phone ${phoneDeal.id} Twilio search live:false`);
console.log(` - http_json ${catalogDeal.id} official JSON search live:false`);
console.log(` - ${reviewed.id} candidates → Needs you · buy still fail-closed`);
console.log(" - Needs you → Buying still required before spend / authorized-buy");
