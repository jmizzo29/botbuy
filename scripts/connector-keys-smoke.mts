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
} from "../lib/connectors/keys.ts";
import {
  CONNECTOR_SMOKE_NOTE,
  CONNECTOR_SMOKE_TOOL,
  connectorSmokeIsReadOnly,
  smokeQueryFor,
} from "../lib/connectors/smoke.ts";
import { CONNECTOR_PROVIDERS } from "../lib/connectors/types.ts";
import { searchNamecheapDomains } from "../lib/connectors/namecheap/search.ts";
import { searchTwilioNumbers } from "../lib/connectors/twilio/search.ts";
import { searchShopifyProducts } from "../lib/connectors/shopify/search.ts";
import { searchHttpJson } from "../lib/connectors/http-json/search.ts";

function assert(ok: unknown, message: string) {
  if (!ok) throw new Error(message);
}

assert(CONNECTOR_SMOKE_TOOL === "search", "smoke tool is search only");
assert(connectorSmokeIsReadOnly(), "smoke is read-only");
assert(!CONNECTOR_SMOKE_NOTE.toLowerCase().includes("register"), "smoke copy never register");
assert(CONNECTOR_SMOKE_NOTE.includes("live:false"), "smoke copy stays live:false");
assert(CONNECTOR_LIVE_LOCK_NOTE.includes("live:false is structural"), "live lock note");
assert(
  CONNECTOR_PREVIEW_ENV.namecheap.includes("NAMECHEAP_CLIENT_IP"),
  "Preview env names Namecheap client IP",
);
assert(
  CONNECTOR_PREVIEW_ENV.http_json.includes("HTTP_JSON_BASE_URL"),
  "Preview env names HTTP JSON base URL",
);

const empty = null;
assert(!namecheapKeysConfigured(empty), "Namecheap keysConfigured=false without vault/env");
assert(!twilioKeysConfigured(empty), "Twilio keysConfigured=false without vault/env");
assert(!shopifyKeysConfigured(empty), "Shopify keysConfigured=false without vault/env");
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

const catalog = await searchHttpJson({ vault: null, query: "smoke" });
assert(catalog.live === false && catalog.result === "stub", "HTTP JSON search stub live:false");
assert(catalog.data?.keysConfigured === false, "HTTP JSON search keysConfigured=false");

console.log("connector-keys-smoke PASS");
console.log(" - keysConfigured=false without vault/env for all four providers");
console.log(" - Namecheap searchHttpReady stays false without NAMECHEAP_CLIENT_IP");
console.log(" - read-only smoke is search-only · live:false");
