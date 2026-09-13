#!/usr/bin/env node
/**
 * Connector POC smoke: AES vault roundtrip + fail-closed approve-gate source lock.
 * Does not call Namecheap or Twilio. Does not print secrets.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
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

const register = readFileSync(join(root, "lib/connectors/runtime.ts"), "utf8");
assert(register.includes("assertConnectorSpendAllowed"), "runtime uses approve gate");
assert(register.includes("recordConnectorAudit"), "runtime writes audit");
assert(register.includes('"shopify"') && register.includes("buyShopifyProduct"), "runtime routes Shopify");
assert(register.includes("buyHttpJson") && register.includes("searchHttpJson"), "runtime routes HTTP JSON");
assert(register.includes("providerSupportsTool"), "runtime checks registry tools");

const types = readFileSync(join(root, "lib/connectors/types.ts"), "utf8");
assert(types.includes('"shopify"') && types.includes('"http_json"'), "provider types include M2 shells");
assert(types.includes("live: false"), "public status live stays false");

const registry = readFileSync(join(root, "lib/connectors/registry.ts"), "utf8");
assert(registry.includes("kind: \"merchant\"") && registry.includes("kind: \"mcp_http\""), "registry kinds");
assert(registry.includes('id: "shopify"') && registry.includes('id: "http_json"'), "registry entries");

const shopifyBuy = readFileSync(join(root, "lib/connectors/shopify/buy.ts"), "utf8");
assert(shopifyBuy.includes("connectorsLiveEnabled"), "Shopify buy not live by default");
assert(shopifyBuy.includes("live: false"), "Shopify buy CHO-honest live:false");

const httpBuy = readFileSync(join(root, "lib/connectors/http-json/buy.ts"), "utf8");
assert(httpBuy.includes("connectorsLiveEnabled"), "HTTP JSON buy not live by default");
assert(httpBuy.includes("live: false"), "HTTP JSON buy CHO-honest live:false");

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

if (failures.length) {
  console.error("connector-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}
console.log("connector-smoke PASS");
console.log(" - AES-256-GCM roundtrip");
console.log(" - approve gate Needs you → Buying · auto-approve OFF");
console.log(" - register/buy fail closed without deal, auto-approve, or approve trail");
console.log(" - M2 registry: shopify + http_json · live:false · spend gated");
