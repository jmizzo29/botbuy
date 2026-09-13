import {
  connectorResultHasCandidates,
  routeIntentToSearch,
} from "../lib/connectors/intent-route.ts";

const domain = routeIntentToSearch({
  summary: "Secure the BotBuyer product domain (botbuyer.ai).",
  categories: ["domain"],
});
if (domain.kind !== "namecheap" || domain.domain !== "botbuyer.ai") {
  throw new Error("domain intent should map to Namecheap botbuyer.ai");
}

const phone = routeIntentToSearch({
  summary: "Find a Twilio SMS number in 415",
  categories: ["phone"],
});
if (phone.kind !== "twilio" || phone.query !== "415") {
  throw new Error("phone intent should map to Twilio 415");
}

const software = routeIntentToSearch({
  summary: "Find software we can buy across vendor checkout.",
  categories: ["software"],
});
if (software.kind !== "shopify" || software.provider !== "shopify") {
  throw new Error("software intent should map to Shopify Admin API search");
}

const httpJson = routeIntentToSearch({
  summary: "Query the official JSON API catalog.",
  categories: ["http_json"],
});
if (httpJson.kind !== "http_json") {
  throw new Error("HTTP JSON intent should map to http_json");
}

const stub = routeIntentToSearch({
  summary: "Buy a used office chair for the studio.",
  categories: ["other"],
});
if (stub.kind !== "stub" || stub.provider !== null) {
  throw new Error("unmapped intent should stay an honest stub");
}

if (connectorResultHasCandidates({ available: null, candidates: [] })) {
  throw new Error("stubs must not count as candidates");
}
if (connectorResultHasCandidates({ available: true, candidates: [{ domain: "botbuyer.ai" }] }) !== true) {
  throw new Error("available:true is a candidate");
}

console.log("intent-route-smoke PASS");
