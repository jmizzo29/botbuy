import {
  connectorResultHasCandidates,
  officialSearchProvider,
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

const car = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
});
if (car.kind !== "stub" || car.provider !== null || car.category !== "vehicle") {
  throw new Error("car intent must stay an accepted stub, not Shopify");
}
if (car.accepted !== true) {
  throw new Error("car intent must be accepted");
}

const house = routeIntentToSearch({
  summary: "Find a 3-bed house in Denver.",
  categories: ["property"],
});
if (house.kind !== "stub" || house.category !== "property" || house.accepted !== true) {
  throw new Error("house intent must stay an accepted stub");
}

const carShopWording = routeIntentToSearch({
  summary: "Find a car at a shop near Austin.",
  categories: ["vehicle"],
});
if (carShopWording.kind === "shopify") {
  throw new Error("vehicle wording must not wedge onto Shopify");
}

const httpJson = routeIntentToSearch({
  summary: "Query the official JSON API catalog.",
  categories: ["http_json"],
});
if (httpJson.kind !== "http_json" || httpJson.provider !== "http_json") {
  throw new Error("HTTP JSON intent should map to http_json");
}
if (officialSearchProvider("shopify") !== "shopify") {
  throw new Error("Shopify must be MCP-registry search");
}
if (officialSearchProvider("http_json") !== "http_json") {
  throw new Error("HTTP JSON must be MCP-registry search");
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
