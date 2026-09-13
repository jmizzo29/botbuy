/**
 * Encrypted OAuth vault shell smoke.
 * Does not call Twilio/Shopify. Does not print secrets or PAN.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import {
  oauthHonesty,
  oauthReturnCopy,
  oauthStartGate,
  signOauthState,
  verifyOauthState,
  verifyShopifyCallbackHmac,
} from "../lib/connectors/oauth.ts";
import { encryptSecret, isVaultKeyConfigured } from "../lib/connectors/crypto.ts";
import { upsertConnectedAccount } from "../lib/connectors/vault.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

function assert(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

delete process.env.BOTBUY_VAULT_KEY;
delete process.env.TWILIO_OAUTH_CLIENT_ID;
delete process.env.TWILIO_OAUTH_CLIENT_SECRET;
delete process.env.SHOPIFY_OAUTH_CLIENT_ID;
delete process.env.SHOPIFY_OAUTH_CLIENT_SECRET;
delete process.env.GITHUB_OAUTH_CLIENT_ID;
delete process.env.GITHUB_OAUTH_CLIENT_SECRET;

assert(!isVaultKeyConfigured(), "vault key starts unset");

const missingVault = oauthStartGate("twilio");
assert(!missingVault.ok && missingVault.result === "vault_key", "Twilio start fail-closed without vault key");
assert(missingVault.status === 503, "vault miss is 503");
assert(missingVault.error.includes("BOTBUY_VAULT_KEY"), "vault miss names BOTBUY_VAULT_KEY");
assert(missingVault.error.includes("not stored"), "vault miss refuses plaintext store");

const shopifyVaultMiss = oauthStartGate("shopify");
assert(
  !shopifyVaultMiss.ok && shopifyVaultMiss.result === "vault_key",
  "Shopify start fail-closed without vault key",
);
const githubVaultMissEarly = oauthStartGate("github");
assert(
  !githubVaultMissEarly.ok && githubVaultMissEarly.result === "vault_key",
  "GitHub start fail-closed without vault key",
);

try {
  signOauthState({ u: "user_1", p: "twilio", t: Date.now(), n: "n1" });
  throw new Error("signOauthState must fail-closed without vault key");
} catch (error) {
  assert(
    error instanceof Error && error.message.includes("BOTBUY_VAULT_KEY"),
    "state sign fail-closed without vault key",
  );
}

try {
  await upsertConnectedAccount({
    userId: "user_1",
    provider: "twilio",
    secret: {
      provider: "twilio",
      authMode: "oauth",
      oauthAccess: "tok_should_not_store",
    },
    status: "connected",
    hint: null,
  });
  throw new Error("upsert must fail-closed without vault key");
} catch (error) {
  assert(
    error instanceof Error && error.message.includes("BOTBUY_VAULT_KEY"),
    "upsert fail-closed without vault key",
  );
  assert(
    error instanceof Error && error.message.includes("not stored"),
    "upsert copy refuses plaintext store",
  );
}

process.env.BOTBUY_VAULT_KEY = randomBytes(32).toString("hex");
assert(isVaultKeyConfigured(), "vault key hex is accepted");

const sealed = encryptSecret(JSON.stringify({ provider: "twilio", authMode: "oauth" }));
assert(sealed.ciphertext && sealed.iv, "encrypt path used once vault key is set");
assert(!sealed.ciphertext.includes("oauth"), "ciphertext is not plaintext JSON");

const noOauth = oauthStartGate("twilio");
assert(!noOauth.ok && noOauth.result === "needs_setup", "Twilio start Needs setup without OAuth env");
assert(noOauth.status === 501, "OAuth env miss is 501");
assert(!noOauth.error.toLowerCase().includes("connected live"), "Needs setup does not claim live");

const shopifyNoOauth = oauthStartGate("shopify");
assert(
  !shopifyNoOauth.ok && shopifyNoOauth.result === "needs_setup",
  "Shopify start Needs setup without OAuth env",
);

const githubNoOauth = oauthStartGate("github");
assert(
  !githubNoOauth.ok && githubNoOauth.result === "needs_setup",
  "GitHub start Needs setup without OAuth env",
);

const honesty = oauthHonesty();
assert(honesty.live === false, "oauth honesty live:false");
assert(honesty.spend === false, "oauth honesty spend=false");
assert(honesty.autoApprove === false, "oauth honesty autoApprove=false");
assert(honesty.keysConfigured === false, "oauth honesty keysConfigured=false");

const state = signOauthState({
  u: "user_1",
  p: "shopify",
  shop: "acme.myshopify.com",
  t: Date.now(),
  n: "abc123",
});
const verified = verifyOauthState(state, { userId: "user_1", provider: "shopify" });
assert(verified.shop === "acme.myshopify.com", "signed state roundtrip");

try {
  verifyOauthState(state, { userId: "user_other", provider: "shopify" });
  throw new Error("state must not accept a different user");
} catch (error) {
  assert(
    error instanceof Error && error.message.includes("not stored"),
    "state mismatch refuses store",
  );
}

assert(oauthReturnCopy("vault_key")?.includes("BOTBUY_VAULT_KEY"), "return copy vault_key");
assert(oauthReturnCopy("needs_setup")?.includes("Needs setup"), "return copy Needs setup");
assert(oauthReturnCopy("stored")?.includes("encrypted"), "return copy stored encrypt");
assert(oauthReturnCopy("stored")?.includes("spend=false"), "return copy stored spend=false");

const hmacUrl = new URL("https://botbuyer.ai/api/connectors/oauth/shopify/callback");
hmacUrl.searchParams.set("code", "not-a-real-code");
hmacUrl.searchParams.set("shop", "acme.myshopify.com");
hmacUrl.searchParams.set("hmac", "00");
assert(
  !verifyShopifyCallbackHmac(hmacUrl, "shopify-oauth-secret"),
  "Shopify hmac fail-closed on junk mac",
);

const twilioStart = read("app/api/connectors/oauth/twilio/route.ts");
const shopifyStart = read("app/api/connectors/oauth/shopify/route.ts");
const githubStart = read("app/api/connectors/oauth/github/route.ts");
const twilioCb = read("app/api/connectors/oauth/twilio/callback/route.ts");
const shopifyCb = read("app/api/connectors/oauth/shopify/callback/route.ts");
const githubCb = read("app/api/connectors/oauth/github/callback/route.ts");
const oauthLib = read("lib/connectors/oauth.ts");
const connectUi = read("components/connected-accounts.tsx");
const vault = read("lib/connectors/vault.ts");

assert(twilioStart.includes("startConnectorOauth"), "Twilio start uses vault shell");
assert(shopifyStart.includes("startConnectorOauth"), "Shopify start uses vault shell");
assert(githubStart.includes("startConnectorOauth"), "GitHub start uses vault shell");
assert(twilioCb.includes("completeConnectorOauth"), "Twilio callback uses vault shell");
assert(shopifyCb.includes("completeConnectorOauth"), "Shopify callback uses vault shell");
assert(githubCb.includes("completeConnectorOauth"), "GitHub callback uses vault shell");
assert(oauthLib.includes("encryptSecret") || vault.includes("encryptSecret"), "encrypt path exists");
assert(oauthLib.includes("connectProvider"), "callback stores via connectProvider");
assert(oauthLib.includes("requireVaultKey") || oauthLib.includes("isVaultKeyConfigured"), "oauth requires vault key");
assert(!/console\.(log|info|debug|warn)\(.*code/.test(oauthLib), "oauth lib does not log code");
assert(!oauthLib.includes("console.log"), "oauth lib does not console.log");
assert(connectUi.includes("twilio-needs-setup"), "Twilio Needs setup surface");
assert(connectUi.includes("OAUTH_VAULT_KEY_REQUIRED"), "UI fail-closed without vault key");
assert(connectUi.includes("OAUTH_ENV_NEEDS_SETUP"), "UI Needs setup when OAuth env absent");
assert(connectUi.includes('data-cta="twilio-oauth"'), "Twilio OAuth CTA stays");
assert(connectUi.includes('data-cta="shopify-oauth"'), "Shopify OAuth CTA stays");
assert(connectUi.includes('data-cta="github-oauth"'), "GitHub OAuth CTA stays");
assert(!connectUi.includes("Autofleeto"), "UI never Autofleeto");
assert(!oauthLib.includes("Autofleeto"), "oauth lib never Autofleeto");

console.log("oauth-vault-smoke PASS");
console.log(" - fail-closed without BOTBUY_VAULT_KEY · no plaintext store");
console.log(" - OAuth env absent → Needs setup · live:false · spend=false");
console.log(" - encrypt path used when vault key is present");
