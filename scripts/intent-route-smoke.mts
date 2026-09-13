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

const consumer = routeIntentToSearch({
  summary: "Find household appliances for the kitchen.",
  categories: ["product"],
});
if (consumer.kind !== "stub" || consumer.accepted !== true) {
  throw new Error("consumer products must stay an accepted stub");
}
if (consumer.kind === "shopify") {
  throw new Error("consumer products must not wedge onto Shopify");
}

const carReady = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
  httpJsonReady: true,
});
if (carReady.kind !== "http_json" || carReady.provider !== "http_json") {
  throw new Error("car intent with HTTP JSON keys should use the MCP catalog");
}
if (carReady.kind === "shopify") {
  throw new Error("car + httpJsonReady must not wedge onto Shopify");
}

const houseReady = routeIntentToSearch({
  summary: "Find a 3-bed house in Denver.",
  categories: ["property"],
  httpJsonReady: true,
});
if (houseReady.kind !== "http_json" || houseReady.accepted !== true) {
  throw new Error("house intent with HTTP JSON keys should use the MCP catalog");
}

const httpJson = routeIntentToSearch({
  summary: "Query the official JSON API catalog.",
  categories: ["http_json"],
});
if (httpJson.kind !== "http_json" || httpJson.provider !== "http_json") {
  throw new Error("HTTP JSON intent should map to http_json");
}
const droplet = routeIntentToSearch({
  summary: "Find a DigitalOcean droplet or volume we can buy.",
  categories: ["digitalocean"],
});
if (droplet.kind !== "digitalocean" || droplet.provider !== "digitalocean") {
  throw new Error("droplet intent should map to DigitalOcean official API");
}
if (droplet.kind === "namecheap") {
  throw new Error("DigitalOcean must not duplicate Namecheap");
}

const carNotDo = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
});
if (carNotDo.kind === "digitalocean") {
  throw new Error("car intent must not wedge onto DigitalOcean");
}

const github = routeIntentToSearch({
  summary: "Find a GitHub repo or gist we can search.",
  categories: ["github"],
});
if (github.kind !== "github" || github.provider !== "github") {
  throw new Error("github intent should map to GitHub official API");
}
if (github.kind === "namecheap" || github.kind === "digitalocean") {
  throw new Error("GitHub must not duplicate Namecheap or DigitalOcean");
}

const githubHost = routeIntentToSearch({
  summary: "Search github.com/octocat/Hello-World",
});
if (githubHost.kind !== "github") {
  throw new Error("github.com host must map to GitHub SaaS MCP, not Namecheap");
}

const carNotGh = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
});
if (carNotGh.kind === "github") {
  throw new Error("car intent must not wedge onto GitHub");
}

if (officialSearchProvider("shopify") !== "shopify") {
  throw new Error("Shopify must be MCP-registry search");
}
if (officialSearchProvider("digitalocean") !== "digitalocean") {
  throw new Error("DigitalOcean must be MCP-registry search");
}
if (officialSearchProvider("github") !== "github") {
  throw new Error("GitHub must be MCP-registry search");
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
