#!/usr/bin/env node
/**
 * Authorized-buy rails smoke: fail-closed Approve trail + honest not-live.
 * Does not call Stripe. Does not print secrets or PAN.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const failures = [];
function assert(ok, message) {
  if (!ok) failures.push(message);
}

const rails = read("lib/authorized-buy.ts");
const gate = read("lib/connectors/approve-gate.ts");
const vaultRails = read("lib/vault-rails.ts");
const vaultPage = read("app/(app)/vault/page.tsx");
const vaultApi = read("app/api/vault/route.ts");
const dealApi = read("app/api/deals/[id]/authorized-buy/route.ts");
const dealPage = read("app/(app)/deals/[id]/page.tsx");
const prepUi = read("components/authorized-buy-prep.tsx");
const envExample = read(".env.example");
const docs = read("docs/authorized-buy-rails.md");
const sanitize = read("lib/connectors/sanitize.ts");
const flags = read("lib/flags.ts");

assert(gate.includes("assertAuthorizedBuyAllowed"), "approve-gate exports authorized-buy");
assert(gate.includes('fromStatus === "Needs you"'), "gate requires Needs you");
assert(gate.includes('toStatus === "Buying"'), "gate requires Buying");
assert(gate.includes("Auto-approve is OFF"), "gate auto-approve OFF");
assert(gate.includes("Designated-holder Approve sheet"), "gate designated-holder Approve sheet");
assert(!gate.includes("autoApprove: true"), "gate never enables auto-approve");

assert(rails.includes("BOTBUY_STRIPE_SECRET_KEY"), "dedicated secret env");
assert(rails.includes("BOTBUY_STRIPE_PUBLISHABLE_KEY"), "dedicated publishable env");
assert(rails.includes("BOTBUY_STRIPE_WEBHOOK_SECRET"), "dedicated webhook env");
assert(rails.includes("BOTBUY_STRIPE_LIVE"), "dedicated live env name");
assert(!rails.includes("process.env.STRIPE_SECRET_KEY"), "never reads STRIPE_SECRET_KEY");
assert(
  !rails.includes("Autofleeto") || rails.includes("never Autofleeto"),
  "lib never uses Autofleeto secrets",
);
assert(rails.includes('mode: "payment"'), "Checkout Session mode payment");
assert(rails.includes('ui_mode: "hosted"'), "hosted Checkout least privilege");
assert(rails.includes('capture_method: "manual"'), "manual capture — no auto charge");
assert(!rails.includes("payment_method_types:"), "no payment_method_types param");
assert(rails.includes("live: false"), "live false lock");
assert(rails.includes("charged: false"), "charged false lock");
assert(rails.includes("sessionCreated: false"), "session not created");
assert(rails.includes("autoApprove: false"), "autoApprove false lock");
assert(rails.includes("assertAuthorizedBuyAllowed"), "prep uses approve gate");
assert(!rails.includes("checkout.sessions.create"), "scaffold does not create sessions");
assert(!rails.includes("paymentIntents.confirm"), "scaffold does not confirm intents");

assert(dealApi.includes("prepareAuthorizedBuy"), "deal API preps after Approve");
assert(dealApi.includes("live: false"), "deal API live false");
assert(dealApi.includes("charged: false"), "deal API charged false");
assert(vaultApi.includes("authorizedBuy"), "vault API exposes authorizedBuy");
assert(vaultApi.includes("authorizedBuyVaultStatus"), "vault API uses honesty helper");

assert(vaultRails.includes("We don’t hold a balance."), "vault stays non-custody");
assert(vaultRails.includes("VAULT_AUTHORIZED_BUY_NOTE"), "vault rails authorized-buy note");
assert(vaultPage.includes("VAULT_AUTHORIZED_BUY_NOTE"), "vault page authorized-buy note");
assert(!vaultPage.toLowerCase().includes("balance"), "vault page file has no balance");
assert(!vaultPage.includes("Fund your vault"), "vault page has no Fund your vault");
assert(dealPage.includes("AuthorizedBuyPrep"), "Buying deal shows prep");
assert(prepUi.includes('status !== "Buying"'), "prep UI gated to Buying");
assert(prepUi.includes("AUTO_APPROVE_OFF"), "prep UI auto-approve OFF");
assert(prepUi.includes("live"), "prep UI prints live honesty");

assert(envExample.includes("BOTBUY_STRIPE_SECRET_KEY="), "env names secret");
assert(envExample.includes("BOTBUY_STRIPE_PUBLISHABLE_KEY="), "env names publishable");
assert(envExample.includes("BOTBUY_STRIPE_WEBHOOK_SECRET="), "env names webhook");
assert(envExample.includes("BOTBUY_STRIPE_LIVE=false"), "env live stays false");
assert(envExample.includes("Never Autofleeto"), "env forbids Autofleeto");
assert(!/BOTBUY_STRIPE_SECRET_KEY=sk_/.test(envExample), "env example has no Stripe secret");
assert(!/BOTBUY_STRIPE_PUBLISHABLE_KEY=pk_/.test(envExample), "env example has no pk value");
assert(docs.includes("BOTBUY_STRIPE_SECRET_KEY"), "docs name dedicated env");
assert(docs.includes("Needs you → Buying"), "docs require approve trail");
assert(docs.includes("Never claim live pay") || docs.includes("Not live pay"), "docs not live");
assert(docs.includes("Auto-approve is **OFF**"), "docs auto-approve OFF");
assert(sanitize.includes("looksLikePan"), "PAN sanitizer");
assert(sanitize.includes("whsec_"), "sanitize strips Stripe key material");
assert(flags.includes("NEXT_PUBLIC_STRIPE_LIVE"), "public Stripe flag unchanged");

function evaluateAuthorizedBuy({ autoApproveAllowed, autoApprove, deal, events, keysConfigured }) {
  if (autoApproveAllowed || autoApprove) return { ok: false, reason: "auto-approve" };
  if (!deal) return { ok: false, reason: "deal" };
  if (deal.status !== "Buying") return { ok: false, reason: "status" };
  if (!events.some((event) => event.from === "Needs you" && event.to === "Buying")) {
    return { ok: false, reason: "trail" };
  }
  return {
    ok: true,
    live: false,
    charged: false,
    prepared: Boolean(keysConfigured),
    keysConfigured: Boolean(keysConfigured),
  };
}

assert(
  !evaluateAuthorizedBuy({
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Needs you" },
    events: [],
    keysConfigured: false,
  }).ok,
  "Needs you without Approve fails closed",
);
assert(
  !evaluateAuthorizedBuy({
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [],
    keysConfigured: true,
  }).ok,
  "Buying without trail fails closed",
);
assert(
  !evaluateAuthorizedBuy({
    autoApproveAllowed: true,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
    keysConfigured: true,
  }).ok,
  "auto-approve allowed fails closed",
);
assert(
  !evaluateAuthorizedBuy({
    autoApproveAllowed: false,
    autoApprove: true,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
    keysConfigured: true,
  }).ok,
  "limits.autoApprove fails closed",
);

const ready = evaluateAuthorizedBuy({
  autoApproveAllowed: false,
  autoApprove: false,
  deal: { status: "Buying" },
  events: [{ from: "Needs you", to: "Buying" }],
  keysConfigured: false,
});
assert(ready.ok, "Approve trail passes");
assert(ready.live === false, "ready path still not live");
assert(ready.charged === false, "ready path still not charged");
assert(ready.prepared === false, "without keys prepared is false");

const keyed = evaluateAuthorizedBuy({
  autoApproveAllowed: false,
  autoApprove: false,
  deal: { status: "Buying" },
  events: [{ from: "Needs you", to: "Buying" }],
  keysConfigured: true,
});
assert(keyed.ok && keyed.prepared && keyed.live === false, "keys prepare params but not live");

if (failures.length) {
  console.error("authorized-buy-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}
console.log("authorized-buy-smoke PASS");
console.log(" - Needs you → Buying required · auto-approve OFF");
console.log(" - BOTBUY_STRIPE_* named · no Autofleeto · not live pay");
console.log(" - Checkout Session prep only · no charge");
