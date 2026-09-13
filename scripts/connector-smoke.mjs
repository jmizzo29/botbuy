#!/usr/bin/env node
/**
 * Connector POC smoke: AES vault roundtrip + fail-closed approve-gate source lock.
 * Does not call Namecheap or Twilio. Does not print secrets.
 */
import { spawnSync } from "node:child_process";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
function assert(ok, message) {
  if (!ok) failures.push(message);
}

const key = randomBytes(32);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const encrypted = Buffer.concat([cipher.update("tok_test", "utf8"), cipher.final()]);
const tag = cipher.getAuthTag();
const blob = Buffer.concat([encrypted, tag]);
const decipher = createDecipheriv("aes-256-gcm", key, iv);
decipher.setAuthTag(blob.subarray(blob.length - 16));
const plain = Buffer.concat([
  decipher.update(blob.subarray(0, blob.length - 16)),
  decipher.final(),
]).toString("utf8");
assert(plain === "tok_test", "AES-256-GCM roundtrip");

const gate = readFileSync(join(root, "lib/connectors/approve-gate.ts"), "utf8");
assert(gate.includes("autoApproveAllowed()"), "gate reads autoApproveAllowed");
assert(gate.includes('fromStatus === "Needs you"'), "gate requires Needs you");
assert(gate.includes('toStatus === "Buying"'), "gate requires Buying");
assert(gate.includes("Fail-closed"), "gate fail-closed copy");
assert(!gate.includes("autoApprove: true"), "gate never enables auto-approve");
assert(gate.includes("assertAuthorizedBuyAllowed"), "gate also locks authorized-buy");
assert(gate.includes("assertActOnBehalfAllowed"), "gate also locks act-on-behalf");

const register = readFileSync(join(root, "lib/connectors/runtime.ts"), "utf8");
assert(register.includes("assertConnectorSpendAllowed"), "runtime uses approve gate");
assert(register.includes("recordConnectorAudit"), "runtime writes audit");
assert(register.includes('"shopify"') && register.includes("buyShopifyProduct"), "runtime routes Shopify");
assert(register.includes("buyDigitalOcean") && register.includes("searchDigitalOcean"), "runtime routes DigitalOcean");
assert(register.includes("buyGithub") && register.includes("searchGithub"), "runtime routes GitHub");
assert(register.includes("buyHttpJson") && register.includes("searchHttpJson"), "runtime routes HTTP JSON");
assert(register.includes("providerSupportsTool"), "runtime checks registry tools");

const oauthLib = readFileSync(join(root, "lib/connectors/oauth.ts"), "utf8");
assert(oauthLib.includes("isVaultKeyConfigured"), "OAuth vault shell checks vault key");
assert(oauthLib.includes("connectProvider"), "OAuth callback stores via connectProvider");
assert(oauthLib.includes("live: false"), "OAuth honesty live:false");
assert(oauthLib.includes("spend: false"), "OAuth honesty spend=false");
assert(!oauthLib.includes("console.log"), "OAuth shell never console.logs tokens");
assert(
  existsSync(join(root, "app/api/connectors/oauth/twilio/callback/route.ts")) &&
    existsSync(join(root, "app/api/connectors/oauth/shopify/callback/route.ts")) &&
    existsSync(join(root, "app/api/connectors/oauth/github/callback/route.ts")),
  "OAuth callback routes exist",
);

const types = readFileSync(join(root, "lib/connectors/types.ts"), "utf8");
assert(types.includes('"shopify"') && types.includes('"digitalocean"') && types.includes('"github"') && types.includes('"http_json"'), "provider types include M2 shells");
assert(types.includes("live: false"), "public status live stays false");

const registry = readFileSync(join(root, "lib/connectors/registry.ts"), "utf8");
assert(registry.includes("kind: \"merchant\"") && registry.includes("kind: \"saas\"") && registry.includes("kind: \"mcp_http\""), "registry kinds");
assert(registry.includes('id: "shopify"') && registry.includes('id: "digitalocean"') && registry.includes('id: "github"') && registry.includes('id: "http_json"'), "registry entries");

const shopifyBuy = readFileSync(join(root, "lib/connectors/shopify/buy.ts"), "utf8");
assert(shopifyBuy.includes("connectorsLiveEnabled"), "Shopify buy not live by default");
assert(shopifyBuy.includes("live: false"), "Shopify buy CHO-honest live:false");
assert(shopifyBuy.includes("spend: false"), "Shopify buy spend=false");
assert(!shopifyBuy.includes("draft_orders"), "Shopify buy never live Admin API");
assert(!shopifyBuy.includes("shopifyAdminRequest"), "Shopify buy never calls Admin HTTP");

const httpBuy = readFileSync(join(root, "lib/connectors/http-json/buy.ts"), "utf8");
assert(httpBuy.includes("connectorsLiveEnabled"), "HTTP JSON buy not live by default");
assert(httpBuy.includes("live: false"), "HTTP JSON buy CHO-honest live:false");
const digitalOceanBuy = readFileSync(join(root, "lib/connectors/digitalocean/buy.ts"), "utf8");
assert(digitalOceanBuy.includes("connectorsLiveEnabled"), "DigitalOcean buy not live by default");
assert(digitalOceanBuy.includes("live: false"), "DigitalOcean buy CHO-honest live:false");
assert(!digitalOceanBuy.includes("regions[0]") && !digitalOceanBuy.includes("nyc1"), "DigitalOcean buy invents no region");
const githubBuy = readFileSync(join(root, "lib/connectors/github/buy.ts"), "utf8");
assert(githubBuy.includes("connectorsLiveEnabled"), "GitHub buy not live by default");
assert(githubBuy.includes("live: false"), "GitHub buy CHO-honest live:false");
assert(!githubBuy.includes("octocat") && !githubBuy.includes("Hello-World"), "GitHub buy invents no repo");

const safeUrl = readFileSync(join(root, "lib/connectors/safe-url.ts"), "utf8");
assert(safeUrl.includes("https:"), "HTTP JSON requires HTTPS");
assert(
  safeUrl.includes("localhost") && safeUrl.includes("169\\.254"),
  "HTTP JSON rejects private hosts",
);

function evaluateSpendGate({ tool, autoApproveAllowed, autoApprove, deal, events }) {
  if (tool === "search" || tool === "quote") return { ok: true };
  if (autoApproveAllowed || autoApprove) return { ok: false, reason: "auto-approve" };
  if (!deal) return { ok: false, reason: "deal" };
  if (deal.status !== "Buying") return { ok: false, reason: "status" };
  if (!events.some((event) => event.from === "Needs you" && event.to === "Buying")) {
    return { ok: false, reason: "trail" };
  }
  return { ok: true };
}

assert(
  evaluateSpendGate({
    tool: "search",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: null,
    events: [],
  }).ok,
  "search is non-spend",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: null,
    events: [],
  }).ok,
  "register without deal fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "buy",
    autoApproveAllowed: true,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "buy with auto-approve allowed fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Needs you" },
    events: [],
  }).ok,
  "register on Needs you fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [],
  }).ok,
  "Buying without Needs you trail fails closed",
);
assert(
  evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "register after Approve sheet trail passes",
);
assert(
  evaluateSpendGate({
    tool: "buy",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "Shopify/HTTP JSON buy after Approve sheet trail would pass the same gate",
);
assert(
  !evaluateSpendGate({
    tool: "buy",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: null,
    events: [],
  }).ok,
  "Shopify/HTTP JSON buy without deal fails closed",
);

const SHOP_HOST = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.myshopify\.com$/;
assert(SHOP_HOST.test("acme.myshopify.com"), "shopify host accepts myshopify.com");
assert(!SHOP_HOST.test("example.com"), "shopify host rejects generic domains");
assert(!SHOP_HOST.test("acme.myshopify.com.evil.test"), "shopify host rejects suffix spoof");

function blockedHost(hostname) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    host === "localhost" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal"
  ) {
    return true;
  }
  if (/^(?:127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/.test(host)) {
    return true;
  }
  return false;
}
assert(blockedHost("localhost"), "reject localhost");
assert(blockedHost("127.0.0.1"), "reject loopback");
assert(blockedHost("169.254.169.254"), "reject metadata IP");
assert(blockedHost("192.168.1.8"), "reject RFC1918");
assert(!blockedHost("api.example.com"), "allow public hostname");

function evaluateIntentRoute({ summary = "", categories = [], mustInclude = "" }) {
  const text = `${summary} ${mustInclude}`;
  const domainish =
    categories.some((item) => ["domain", "domains", "registrar"].includes(item)) ||
    /\b(domains?|registrar|tld|whois)\b/i.test(text) ||
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}\b/i.test(text);
  const phoneish =
    categories.some((item) => ["phone", "sms", "number", "numbers", "twilio"].includes(item)) ||
    /\b(phone|sms|twilio|did|text(?:ing)?)\b/i.test(text);
  const softwareish =
    categories.some((item) => ["software", "saas", "shopify", "license"].includes(item)) ||
    /\b(software|saas|shopify|license|storefront)\b/i.test(text);
  const digitaloceanish =
    categories.some((item) =>
      ["digitalocean", "droplet", "droplets", "volume", "volumes", "vps", "cloud"].includes(item),
    ) ||
    /\b(digitalocean|digital ocean|droplets?|block storage|vps|cloud servers?)\b/i.test(text);
  const githubish =
    categories.some((item) => ["github", "gist", "gists", "github_marketplace"].includes(item)) ||
    /\b(github|gists?|github marketplace)\b/i.test(text);
  const httpJsonish =
    categories.some((item) => ["http_json", "http", "json", "api", "catalog"].includes(item)) ||
    /\b(http json|openapi|official api|json api|official catalog)\b/i.test(text);
  const vehicleOrProperty =
    categories.some((item) =>
      ["vehicle", "car", "cars", "property", "house", "houses"].includes(item),
    ) ||
    /\b(cars?|houses?|vehicles?|real estate)\b/i.test(text);
  const consumerish =
    categories.some((item) =>
      ["product", "products", "consumer", "goods", "retail"].includes(item),
    ) ||
    /\b(consumer products?|household|appliances?)\b/i.test(text);
  if (domainish && !/\bgithub\.com\b/i.test(text)) return "namecheap";
  if (phoneish) return "twilio";
  if (digitaloceanish && !vehicleOrProperty && !consumerish) return "digitalocean";
  if (githubish && !vehicleOrProperty && !consumerish) return "github";
  if ((softwareish || consumerish) && !vehicleOrProperty) return "shopify";
  if (httpJsonish) return "http_json";
  return "stub";
}

assert(
  evaluateIntentRoute({
    summary: "Secure botbuyer.ai on a multi-year term.",
    categories: ["domain"],
  }) === "namecheap",
  "domain intent maps to Namecheap",
);
assert(
  evaluateIntentRoute({
    summary: "Find a Twilio SMS number in 415",
    categories: ["phone"],
  }) === "twilio",
  "phone intent maps to Twilio",
);
assert(
  evaluateIntentRoute({
    summary: "Find software we can buy across vendor checkout.",
    categories: ["software"],
  }) === "shopify",
  "software intent maps to Shopify Admin API",
);
assert(
  evaluateIntentRoute({
    summary: "Query the official JSON API catalog.",
    categories: ["http_json"],
  }) === "http_json",
  "HTTP JSON intent maps to official HTTPS JSON",
);
assert(
  evaluateIntentRoute({
    summary: "Find a DigitalOcean droplet in nyc3.",
    categories: ["digitalocean"],
  }) === "digitalocean",
  "droplet intent maps to DigitalOcean official API",
);
assert(
  evaluateIntentRoute({
    summary: "Find a used Honda Civic in Austin.",
    categories: ["vehicle"],
  }) !== "digitalocean",
  "car intent does not wedge onto DigitalOcean",
);
assert(
  evaluateIntentRoute({
    summary: "Find a GitHub repo or gist we can search.",
    categories: ["github"],
  }) === "github",
  "github intent maps to GitHub official API",
);
assert(
  evaluateIntentRoute({
    summary: "Search github.com/octocat/Hello-World",
  }) === "github",
  "github.com host maps to GitHub SaaS MCP, not Namecheap",
);
assert(
  evaluateIntentRoute({
    summary: "Find a used Honda Civic in Austin.",
    categories: ["vehicle"],
  }) !== "github",
  "car intent does not wedge onto GitHub",
);
assert(
  evaluateIntentRoute({
    summary: "Buy a used office chair for the studio.",
    categories: ["other"],
  }) === "stub",
  "unmapped intent stays an honest stub",
);
assert(
  evaluateIntentRoute({
    summary: "Find a used Honda Civic in Austin.",
    categories: ["vehicle"],
  }) === "stub",
  "car intent stays an accepted stub",
);
assert(
  evaluateIntentRoute({
    summary: "Find a 3-bed house in Denver.",
    categories: ["property"],
  }) === "stub",
  "house intent stays an accepted stub",
);
assert(
  evaluateIntentRoute({
    summary: "Find a car at a shop near Austin.",
    categories: ["vehicle"],
  }) === "stub",
  "vehicle wording does not wedge onto Shopify",
);
assert(
  evaluateIntentRoute({
    summary: "Find household appliances for the kitchen.",
    categories: ["product"],
  }) === "shopify",
  "consumer products map to Shopify Admin stub",
);
assert(
  !evaluateSpendGate({
    tool: "buy",
    autoApproveAllowed: false,
    autoApprove: true,
    deal: { status: "Found" },
    events: [],
  }).ok,
  "Found deal cannot spend without Needs you → Buying",
);

const dealSearch = readFileSync(join(root, "lib/connectors/deal-search.ts"), "utf8");
assert(dealSearch.includes("invokeConnectorTool"), "deal search uses tools runtime");
assert(dealSearch.includes('tool: "search"'), "deal search calls search");
assert(!dealSearch.includes('tool: "register"') && !dealSearch.includes('tool: "buy"'), "deal search never register/buy");
assert(dealSearch.includes("assertRunDealSoftHold"), "deal search keeps run deals $0/unverified");
assert(!/puppeteer|playwright|selenium/i.test(dealSearch), "deal search has no browser farm");
const techLock = readFileSync(join(root, "lib/connectors/tech-lock.ts"), "utf8");
assert(techLock.includes("mcpFirst: true") && techLock.includes("apisFirst: true"), "tech lock is MCP-first · APIs-first");
assert(techLock.includes("captchaFarms: false") && techLock.includes("htmlLoginAutomation: false"), "tech lock forbids captcha/HTML login");
assert(techLock.includes("autoApprove: false") && techLock.includes("hold: \"soft\""), "tech lock auto-approve OFF · Soft HOLD");
assert(techLock.includes("designatedHolderApprove: true"), "tech lock designated-holder approve");
assert(techLock.includes("landPromote: false"), "tech lock land promote HOLD");
assert(gate.includes("Designated-holder Approve sheet"), "gate names designated-holder Approve sheet");
const intentRouteSrc = readFileSync(join(root, "lib/connectors/intent-route.ts"), "utf8");
assert(!/puppeteer|playwright|selenium/i.test(intentRouteSrc), "intent route has no browser farm");
assert(intentRouteSrc.includes("vehicleOrProperty"), "intent route refuses Shopify wedge for cars/houses");
assert(intentRouteSrc.includes("consumerish"), "intent route maps consumer products to Shopify stub");
assert(intentRouteSrc.includes("softwareish || consumerish"), "consumer products share the Shopify Admin stub");
assert(intentRouteSrc.includes("accepted: true"), "intent route never rejects a category");
assert(intentRouteSrc.includes("httpJsonReady"), "intent route can use HTTP JSON MCP when keys are ready");
const categoriesSrc = readFileSync(join(root, "lib/intent-categories.ts"), "utf8");
assert(categoriesSrc.includes("DEFAULT_DEAL_CATEGORY"), "deal category default is general, not software");

const mapped = spawnSync(
  process.execPath,
  [join(root, "node_modules/.bin/tsx"), join(root, "scripts/intent-route-smoke.mts")],
  { encoding: "utf8" },
);
assert(mapped.status === 0, `intent-route runtime smoke${mapped.stderr ? `: ${mapped.stderr.trim()}` : ""}`);

const handoffSrc = readFileSync(join(root, "lib/connectors/search-handoff.ts"), "utf8");
assert(handoffSrc.includes("search_act_handoff"), "structured search act handoff");
assert(handoffSrc.includes('amountStatus: "unverified"'), "handoff amounts stay unverified");
assert(handoffSrc.includes("verified: false"), "handoff never marks verified");
assert(!handoffSrc.includes("priceVerified: true"), "handoff invents no verified prices");

assert(dealSearch.includes("applySearchActHandoff"), "pipeline uses search act handoff");
assert(dealSearch.includes("applyStageSearchFixtureHandoff"), "pipeline has stage fixture handoff");
assert(dealSearch.includes("isStageSearchFixtureEnabled"), "pipeline gates stage fixture");
assert(dealSearch.includes('transitionDeal(found.id, "Needs you"'), "candidates advance Found → Needs you");
assert(dealSearch.includes("connector_candidates"), "pipeline attaches structured candidates");
assert(!dealSearch.includes("agentExecuted: true"), "pipeline never sets agentExecuted");

const fixtureSrc = readFileSync(join(root, "lib/connectors/stage-search-fixture.ts"), "utf8");
assert(fixtureSrc.includes("qa-needs-you"), "stage fixture token is qa-needs-you");
assert(fixtureSrc.includes("isProductionSearchEnv"), "stage fixture refuses production");
assert(
  fixtureSrc.includes("Empty stubs stay Searching"),
  "empty stubs stay Searching without an explicit fixture",
);
assert(
  fixtureSrc.includes("intentRequestsStageSearchFixture"),
  "stage fixture requires an explicit intent token",
);
assert(fixtureSrc.includes('amountStatus: "unverified"'), "stage fixture amounts stay unverified");
assert(fixtureSrc.includes("live: false"), "stage fixture stays live:false");
assert(!fixtureSrc.includes("priceVerified: true"), "stage fixture invents no verified prices");

const dealPage = readFileSync(join(root, "app/(app)/deals/[id]/page.tsx"), "utf8");
assert(dealPage.includes("DealCandidates"), "deal detail shows candidates");
assert(dealPage.includes("readSearchActHandoff"), "deal detail reads structured handoff");

const approveUi = readFileSync(join(root, "components/deal-approve-actions.tsx"), "utf8");
assert(approveUi.includes('status !== "Needs you"'), "Approve sheet still Needs you only");

const httpSearch = readFileSync(join(root, "lib/connectors/http-json/search.ts"), "utf8");
assert(httpSearch.includes("parseHttpJsonCandidates"), "HTTP JSON search maps JSON rows");
assert(httpSearch.includes("candidates"), "HTTP JSON search exposes candidates");
assert(httpSearch.includes("keysConfigured"), "HTTP JSON stub reports keysConfigured");
assert(httpSearch.includes("categoryAgnostic"), "HTTP JSON catalog is category-agnostic");
assert(httpSearch.includes("vin") && httpSearch.includes("address"), "HTTP JSON parses listing fields");

const keysSrc = readFileSync(join(root, "lib/connectors/keys.ts"), "utf8");
assert(keysSrc.includes("keysConfigured"), "shared keysConfigured helper");
assert(keysSrc.includes("searchHttpReady"), "shared searchHttpReady helper");
assert(keysSrc.includes("NAMECHEAP_CLIENT_IP"), "keys helper names Namecheap client IP");
assert(keysSrc.includes("live: false"), "keys readiness stays live:false");
assert(!keysSrc.includes("live: true"), "keys helper never claims live:true");

const smokeSrc = readFileSync(join(root, "lib/connectors/smoke.ts"), "utf8");
assert(smokeSrc.includes('CONNECTOR_SMOKE_TOOL = "search"'), "connector smoke is search only");
assert(!smokeSrc.includes('"register"') && !smokeSrc.includes('"buy"'), "connector smoke never spend");
assert(smokeSrc.includes("live: false"), "connector smoke stays live:false");

const smokeRoute = readFileSync(join(root, "app/api/connectors/smoke/route.ts"), "utf8");
assert(smokeRoute.includes("smokeConnectorSearch"), "smoke API uses read-only helper");
assert(smokeRoute.includes("spend: false"), "smoke API spend:false");
assert(smokeRoute.includes("honestyFlags") || smokeRoute.includes("settingsHonestyFlags"), "smoke API honestyFlags");
assert(smokeSrc.includes("spend=false") || smokeSrc.includes("HONESTY_SPEND_FALSE"), "smoke copy spend=false");

const namecheapSearch = readFileSync(join(root, "lib/connectors/namecheap/search.ts"), "utf8");
assert(namecheapSearch.includes("keysConfigured"), "Namecheap search reports keysConfigured");
const namecheapQuote = readFileSync(join(root, "lib/connectors/namecheap/quote.ts"), "utf8");
assert(namecheapQuote.includes("namecheap.users.getPricing"), "Namecheap quote uses official getPricing");
assert(namecheapQuote.includes("amountStatus"), "Namecheap quote stays unverified");
assert(namecheapQuote.includes("live: false"), "Namecheap quote stays live:false");
const namecheapXml = readFileSync(join(root, "lib/connectors/namecheap/xml.ts"), "utf8");
assert(namecheapXml.includes("parseNamecheapPricing"), "Namecheap XML pricing parser");
assert(namecheapXml.includes("Status=\"OK\""), "Namecheap XML fail-closed on Status");
const twilioSearch = readFileSync(join(root, "lib/connectors/twilio/search.ts"), "utf8");
assert(twilioSearch.includes("keysConfigured"), "Twilio search reports keysConfigured");
const shopifySearch = readFileSync(join(root, "lib/connectors/shopify/search.ts"), "utf8");
assert(shopifySearch.includes("keysConfigured"), "Shopify search reports keysConfigured");
assert(shopifySearch.includes("parseShopifyProducts"), "Shopify search maps official products.json");
assert(shopifySearch.includes("spend: false"), "Shopify search spend=false");
const shopifyCopy = readFileSync(join(root, "lib/connectors/copy.ts"), "utf8");
assert(shopifyCopy.includes("SHOPIFY_OAUTH_CLIENT_ID"), "Shopify Needs setup names OAuth client id");
assert(shopifyCopy.includes("SHOPIFY_OAUTH_CLIENT_SECRET"), "Shopify Needs setup names OAuth secret");
assert(shopifyCopy.includes("SHOPIFY_OAUTH_REDIRECT_URL"), "Shopify Needs setup names OAuth redirect");
const digitalOceanSearch = readFileSync(join(root, "lib/connectors/digitalocean/search.ts"), "utf8");
assert(digitalOceanSearch.includes("keysConfigured"), "DigitalOcean search reports keysConfigured");
assert(digitalOceanSearch.includes("api.digitalocean.com") || readFileSync(join(root, "lib/connectors/digitalocean/client.ts"), "utf8").includes("api.digitalocean.com"), "DigitalOcean client is official API host");
const githubSearch = readFileSync(join(root, "lib/connectors/github/search.ts"), "utf8");
assert(githubSearch.includes("keysConfigured"), "GitHub search reports keysConfigured");
assert(readFileSync(join(root, "lib/connectors/github/client.ts"), "utf8").includes("api.github.com"), "GitHub client is official API host");

const oauthVault = spawnSync(
  process.execPath,
  [join(root, "node_modules/.bin/tsx"), join(root, "scripts/oauth-vault-smoke.mts")],
  { encoding: "utf8" },
);
assert(
  oauthVault.status === 0,
  `oauth vault smoke${oauthVault.stderr ? `: ${oauthVault.stderr.trim()}` : oauthVault.stdout ? `: ${oauthVault.stdout.trim()}` : ""}`,
);

const keysRuntime = spawnSync(
  process.execPath,
  [join(root, "node_modules/.bin/tsx"), join(root, "scripts/connector-keys-smoke.mts")],
  { encoding: "utf8" },
);
assert(
  keysRuntime.status === 0,
  `connector keys smoke${keysRuntime.stderr ? `: ${keysRuntime.stderr.trim()}` : keysRuntime.stdout ? `: ${keysRuntime.stdout.trim()}` : ""}`,
);

const pipeline = spawnSync(
  process.execPath,
  [join(root, "node_modules/.bin/tsx"), join(root, "scripts/deal-search-runtime.mts")],
  { encoding: "utf8" },
);
assert(
  pipeline.status === 0,
  `deal-search runtime smoke${pipeline.stderr ? `: ${pipeline.stderr.trim()}` : pipeline.stdout ? `: ${pipeline.stdout.trim()}` : ""}`,
);

const fixtureSmoke = spawnSync(
  process.execPath,
  [join(root, "node_modules/.bin/tsx"), join(root, "scripts/stage-search-fixture-smoke.mts")],
  { encoding: "utf8" },
);
assert(
  fixtureSmoke.status === 0,
  `stage-search-fixture smoke${fixtureSmoke.stderr ? `: ${fixtureSmoke.stderr.trim()}` : fixtureSmoke.stdout ? `: ${fixtureSmoke.stdout.trim()}` : ""}`,
);

if (failures.length) {
  console.error("connector-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}
console.log("connector-smoke PASS");
console.log(" - AES-256-GCM roundtrip");
console.log(" - approve gate Needs you → Buying · auto-approve OFF");
console.log(" - register/buy fail closed without deal, auto-approve, or approve trail");
console.log(" - M2 registry: shopify + digitalocean + github + http_json · live:false · spend gated");
console.log(" - intent maps domain→Namecheap, phone→Twilio, droplet→DigitalOcean, github→GitHub, software/consumer→Shopify, HTTP JSON; cars/houses stay accepted stubs");
console.log(" - deal search pipeline is search/quote only · MCP-first · no browser farms");
console.log(" - candidates attach structured handoff · Searching → Found → Needs you");
console.log(" - empty stubs stay Searching; qa-needs-you still Needs you · production refused");
console.log(" - Approve sheet Needs you → Buying still required before spend");
console.log(" - keysConfigured honesty on all six providers · read-only smoke · live:false");
console.log(" - OAuth vault shell fail-closed without BOTBUY_VAULT_KEY · Needs setup without OAuth env");
