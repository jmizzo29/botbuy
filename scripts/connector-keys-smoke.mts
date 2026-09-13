import {
  buildProviderReadiness,
  CONNECTOR_LIVE_LOCK_NOTE,
  CONNECTOR_PREVIEW_ENV,
  httpJsonKeysConfigured,
  missingConnectorEnvNames,
  namecheapClientIpConfigured,
  namecheapKeysConfigured,
  providerSearchHttpReady,
  shopifyKeysConfigured,
  twilioKeysConfigured,
  digitalOceanKeysConfigured,
} from "../lib/connectors/keys.ts";
import {
  CONNECTOR_SMOKE_NOTE,
  CONNECTOR_SMOKE_TOOL,
  connectorSmokeIsReadOnly,
  smokeQueryFor,
} from "../lib/connectors/smoke.ts";
import { CONNECTOR_PROVIDERS } from "../lib/connectors/types.ts";
import { quoteNamecheapDomain } from "../lib/connectors/namecheap/quote.ts";
import { searchNamecheapDomains } from "../lib/connectors/namecheap/search.ts";
import {
  namecheapTld,
  parseNamecheapAvailability,
  parseNamecheapPricing,
} from "../lib/connectors/namecheap/xml.ts";
import { routeIntentToSearch } from "../lib/connectors/intent-route.ts";
import { searchTwilioNumbers } from "../lib/connectors/twilio/search.ts";
import { searchShopifyProducts } from "../lib/connectors/shopify/search.ts";
import {
  parseDigitalOceanCandidates,
  searchDigitalOcean,
} from "../lib/connectors/digitalocean/search.ts";
import { searchHttpJson } from "../lib/connectors/http-json/search.ts";

function assert(ok: unknown, message: string) {
  if (!ok) throw new Error(message);
}

assert(CONNECTOR_SMOKE_TOOL === "search", "smoke tool is search only");
assert(connectorSmokeIsReadOnly(), "smoke is read-only");
assert(CONNECTOR_SMOKE_NOTE.toLowerCase().includes("never register"), "smoke copy forbids register");
assert(CONNECTOR_SMOKE_NOTE.includes("live:false"), "smoke copy stays live:false");
assert(CONNECTOR_SMOKE_NOTE.includes("spend=false"), "smoke copy stays spend=false");
assert(CONNECTOR_SMOKE_NOTE.includes("Auto-approve OFF"), "smoke copy Auto-approve OFF");
assert(CONNECTOR_LIVE_LOCK_NOTE.includes("live:false is structural"), "live lock note");
assert(
  CONNECTOR_PREVIEW_ENV.namecheap.includes("NAMECHEAP_CLIENT_IP"),
  "Preview env names Namecheap client IP",
);
assert(
  CONNECTOR_PREVIEW_ENV.http_json.includes("HTTP_JSON_BASE_URL"),
  "Preview env names HTTP JSON base URL",
);
assert(
  CONNECTOR_PREVIEW_ENV.digitalocean.includes("DIGITALOCEAN_ACCESS_TOKEN"),
  "Preview env names DigitalOcean access token",
);

const empty = null;
assert(!namecheapKeysConfigured(empty), "Namecheap keysConfigured=false without vault/env");
assert(!twilioKeysConfigured(empty), "Twilio keysConfigured=false without vault/env");
assert(!shopifyKeysConfigured(empty), "Shopify keysConfigured=false without vault/env");
assert(!digitalOceanKeysConfigured(empty), "DigitalOcean keysConfigured=false without vault/env");
assert(!httpJsonKeysConfigured(empty), "HTTP JSON keysConfigured=false without vault/env");
assert(!namecheapClientIpConfigured(), "Namecheap client IP unset in smoke env");
assert(
  !providerSearchHttpReady("namecheap", empty),
  "Namecheap searchHttpReady=false without keys+IP",
);

const namecheapVault = {
  provider: "namecheap" as const,
  authMode: "api_key" as const,
  apiUser: "botbuy_user",
  apiKey: "tok_namecheap_test",
  username: "botbuy_user",
};
assert(namecheapKeysConfigured(namecheapVault), "Namecheap vault counts as keysConfigured");
assert(
  !providerSearchHttpReady("namecheap", namecheapVault),
  "Namecheap HTTP still closed without NAMECHEAP_CLIENT_IP",
);
assert(
  missingConnectorEnvNames("namecheap", namecheapVault).includes("NAMECHEAP_CLIENT_IP"),
  "Namecheap missing list names CLIENT_IP only when keys exist",
);

const twilioVault = {
  provider: "twilio" as const,
  authMode: "api_key" as const,
  accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  apiKey: "tok_twilio_test",
};
assert(twilioKeysConfigured(twilioVault), "Twilio vault counts as keysConfigured");
assert(providerSearchHttpReady("twilio", twilioVault), "Twilio searchHttpReady with vault");

const shopifyVault = {
  provider: "shopify" as const,
  authMode: "api_key" as const,
  shopDomain: "acme.myshopify.com",
  apiKey: "shpat_test_token",
};
assert(shopifyKeysConfigured(shopifyVault), "Shopify vault counts as keysConfigured");
assert(providerSearchHttpReady("shopify", shopifyVault), "Shopify searchHttpReady with vault");

const digitalOceanVault = {
  provider: "digitalocean" as const,
  authMode: "api_key" as const,
  apiKey: "dop_v1_test_token",
};
assert(digitalOceanKeysConfigured(digitalOceanVault), "DigitalOcean vault counts as keysConfigured");
assert(
  providerSearchHttpReady("digitalocean", digitalOceanVault),
  "DigitalOcean searchHttpReady with vault",
);

const httpVault = {
  provider: "http_json" as const,
  authMode: "api_key" as const,
  baseUrl: "https://catalog.example.com/v1/",
  apiKey: "tok_http_json_test",
};
assert(httpJsonKeysConfigured(httpVault), "HTTP JSON vault counts as keysConfigured");
assert(providerSearchHttpReady("http_json", httpVault), "HTTP JSON searchHttpReady with vault");

for (const provider of CONNECTOR_PROVIDERS) {
  const row = buildProviderReadiness({
    provider,
    vault: null,
    vaultConnected: false,
  });
  assert(row.live === false, `${provider} readiness live:false`);
  assert(row.keysConfigured === false, `${provider} readiness keysConfigured=false`);
  assert(row.searchHttpReady === false, `${provider} readiness searchHttpReady=false`);
  assert(row.oauthExchangeReady === false, `${provider} readiness oauthExchangeReady=false`);
  assert(smokeQueryFor(provider).length >= 0, `${provider} has a smoke query`);
}

const namecheap = await searchNamecheapDomains({ vault: null, query: "example.com" });
assert(namecheap.live === false, "Namecheap search live:false");
assert(namecheap.result === "stub", "Namecheap search fail-closed stub");
assert(namecheap.data?.keysConfigured === false, "Namecheap search keysConfigured=false");

const twilio = await searchTwilioNumbers({ vault: null, query: "415" });
assert(twilio.live === false && twilio.result === "stub", "Twilio search stub live:false");
assert(twilio.data?.keysConfigured === false, "Twilio search keysConfigured=false");

const shopify = await searchShopifyProducts({ vault: null, query: "smoke" });
assert(shopify.live === false && shopify.result === "stub", "Shopify search stub live:false");
assert(shopify.data?.keysConfigured === false, "Shopify search keysConfigured=false");

const digitalocean = await searchDigitalOcean({ vault: null, query: "droplet" });
assert(digitalocean.live === false && digitalocean.result === "stub", "DigitalOcean search stub live:false");
assert(digitalocean.data?.keysConfigured === false, "DigitalOcean search keysConfigured=false");
const doParsed = parseDigitalOceanCandidates(
  JSON.stringify({
    droplets: [{ id: 1, name: "web-1", region: { slug: "nyc3" }, size_slug: "s-1vcpu-1gb" }],
    volumes: [{ id: "vol-1", name: "data", region: { slug: "nyc3" } }],
  }),
);
assert(doParsed.length === 2 && doParsed[0]?.kind === "droplet", "DigitalOcean parser maps droplets/volumes");
assert(doParsed.every((row) => row.amountStatus === "unverified"), "DigitalOcean candidates stay unverified");

const catalog = await searchHttpJson({ vault: null, query: "smoke" });
assert(catalog.live === false && catalog.result === "stub", "HTTP JSON search stub live:false");
assert(catalog.data?.keysConfigured === false, "HTTP JSON search keysConfigured=false");

const quote = await quoteNamecheapDomain({ vault: null, domain: "botbuyer.ai" });
assert(quote.live === false && quote.result === "stub", "Namecheap quote stub without keys");
assert(quote.data?.keysConfigured === false, "Namecheap quote keysConfigured=false");
assert(quote.data?.listedUsd == null, "Namecheap quote invents no listedUsd without HTTP");
assert(quote.data?.amountStatus === "unverified", "Namecheap quote stays unverified");

assert(namecheapTld("botbuyer.ai") === "AI", "Namecheap TLD from domain");
const checkXml =
  '<ApiResponse Status="OK"><DomainCheckResult Domain="botbuyer.ai" Available="true" IsPremiumName="false" /></ApiResponse>';
const parsed = parseNamecheapAvailability(checkXml, "botbuyer.ai");
assert(parsed.available === true && parsed.candidates.length === 1, "Namecheap check XML maps available");
assert(parsed.candidates[0]?.amountStatus === "unverified", "Namecheap check amounts stay unverified");

const pricingXml =
  '<ApiResponse Status="OK"><Price Duration="1" DurationType="YEAR" Price="12.98" YourPrice="10.48" Currency="USD" /></ApiResponse>';
assert(parseNamecheapPricing(pricingXml, 1) === 10.48, "Namecheap getPricing prefers YourPrice");
assert(parseNamecheapPricing('<ApiResponse Status="ERROR" />', 1) == null, "Namecheap pricing fail-closed");

const carReady = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
  httpJsonReady: true,
});
assert(carReady.kind === "http_json", "category-agnostic MCP when HTTP JSON keys are ready");
assert(carReady.kind !== "shopify", "MCP catalog is not a Shopify wedge");
assert(carReady.kind !== "digitalocean", "car intent is not a DigitalOcean wedge");

const dropletRoute = routeIntentToSearch({
  summary: "Find a DigitalOcean droplet or volume we can buy.",
  categories: ["digitalocean"],
});
assert(dropletRoute.kind === "digitalocean", "droplet intent maps to DigitalOcean");
assert(dropletRoute.kind !== "namecheap", "DigitalOcean is not a Namecheap duplicate");
const carStub = routeIntentToSearch({
  summary: "Find a used Honda Civic in Austin.",
  categories: ["vehicle"],
});
assert(carStub.kind === "stub", "empty car stub without HTTP JSON keys");

console.log("connector-keys-smoke PASS");
console.log(" - keysConfigured=false without vault/env for all five providers");
console.log(" - Namecheap searchHttpReady stays false without NAMECHEAP_CLIENT_IP");
console.log(" - read-only smoke is search-only · live:false");
console.log(" - Namecheap getPricing parse · category-agnostic HTTP JSON MCP when keys ready");
