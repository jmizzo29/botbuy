#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

const failures = [];
function assert(ok, message) {
  if (!ok) failures.push(message);
}

const button = read("components/ui/button.tsx");
const tokens = read("lib/ui-tokens.ts");
const css = read("app/globals.css");
const land = read("app/page.tsx");
const signup = read("app/signup/page.tsx");
const proof = read("components/proof-strip.tsx");
const proofLib = read("lib/proof.ts");
const chrome = read("components/public-chrome.tsx");
const home = read("app/(app)/home/page.tsx");
const agents = read("app/(app)/agents/page.tsx");
const goLive = read("app/onboarding/go-live/page.tsx");
const admin = read("app/(app)/admin/page.tsx");
const finance = read("lib/finance.ts");
const brand = read("lib/brand.ts");
const empty = read("lib/empty-cta.ts");
const ledger = JSON.parse(read("data/john-deal-ledger.json"));

assert(tokens.includes('PRIMARY_BUTTON_BG = "#ffffff"'), "token bg-white");
assert(tokens.includes('PRIMARY_BUTTON_FG = "#000000"'), "token text-black");
assert(button.includes("PRIMARY_BUTTON_STYLE"), "Button applies inline primary style");
assert(button.includes("PRIMARY_BUTTON_CLASS"), "Button uses primary class token");
assert(button.includes('data-contrast={isPrimary ? "primary"'), "primary contrast marker");
assert(
  css.includes("color: #000000 !important") &&
    css.includes("background-color: #ffffff !important"),
  "globals force primary contrast",
);

assert(goLive.includes('data-cta="go-live-run"'), "go-live Run marked");
assert(/<Button[^>]*>\s*Run\s*<\/Button>/.test(goLive.replace(/\n/g, " ")), "go-live Run label");
assert(!/<(Button)[^>]*variant="ghost"[^>]*>\s*Run/.test(goLive), "Run is not ghost");

const primaryBlocks = [
  ["land CTA", land, "<Button asChild size=\"lg\">"],
  ["signup Continue", signup, "<Button type=\"submit\">Continue</Button>"],
  ["go-live Run", goLive, "<Button type=\"submit\" data-cta=\"go-live-run\">"],
];
for (const [name, src, needle] of primaryBlocks) {
  assert(src.includes(needle), `${name} primary present`);
}

assert(brand.includes('trustLine: "Demo · $1,000 gate · every deal needs your approval"'), "CPO trust line");
assert(brand.includes('pocBanner: "POC · Demo · not live"'), "POC pill lock");
assert(land.includes("BRAND.trustLine"), "land renders trust line under CTAs");
assert(land.includes("BRAND.pocBanner"), "land keeps POC pill");
assert(signup.includes("BRAND.pocBanner"), "signup Demo pill");
assert(signup.includes("Sign up"), "signup eyebrow");

assert(
  proofLib.includes(
    "Live platform stats show here only after they’re verified. Your personal deals never count as public proof.",
  ),
  "ProofStrip empty body lock",
);
assert(proofLib.includes('PROOF_EMPTY_MICRO = "No placeholders."'), "ProofStrip micro");
assert(proof.includes("PROOF_EMPTY_COPY"), "ProofStrip uses empty body");
assert(proof.includes("PROOF_EMPTY_MICRO"), "ProofStrip uses micro");
assert(!proof.includes("CHO-gated"), "public proof caption has no CHO-gated");
assert(!proof.includes("verified_at"), "public proof caption has no verified_at");

assert(chrome.includes("hasPublicSession"), "nav gates My deals on session");
assert(chrome.includes("My deals"), "My deals still exists after session");

assert(empty.includes('SEARCHING_EMPTY_PRIMARY = "Run BotBuy"'), "Searching Run BotBuy");
assert(empty.includes('SEARCHING_EMPTY_SECONDARY = "Edit intent"'), "Searching Edit intent");
assert(empty.includes('NEEDS_YOU_CTA = "Review gates"'), "Needs-you Review gates");
assert(empty.includes('AGENTS_EMPTY_SECONDARY = "See how activation works"'), "Agents empty secondary");
assert(empty.includes('"/deals?status=Closed"'), "Agents empty → Closed deals");
assert(home.includes("SearchingEmpty"), "home Searching empty");
assert(home.includes("NeedsYouCta"), "home Needs-you CTA");
assert(agents.includes("AgentsEmptySecondary"), "agents empty secondary");

const financeIdx = admin.indexOf("<CardTitle>Finance</CardTitle>");
const dealsIdx = admin.indexOf("<CardTitle>Deals ops</CardTitle>");
const trafficIdx = admin.indexOf("<CardTitle>Web traffic</CardTitle>");
const mrrIdx = admin.indexOf("<CardTitle>MRR / revenue</CardTitle>");
assert(financeIdx > -1 && dealsIdx > -1 && trafficIdx > -1, "admin sections present");
assert(financeIdx < trafficIdx && dealsIdx < trafficIdx, "Finance/Deals above analytics stubs");
assert(financeIdx < dealsIdx, "Finance above Deals");
assert(trafficIdx < mrrIdx, "traffic stub before MRR stub");
assert(admin.includes("Demo stub") && admin.includes("DemoStub"), "in-card Demo stub styling");

assert(finance.includes("const customerGmvUsd = 0"), "customer GMV locked at 0");
assert(admin.includes("botbuyer.ai $179.96"), "admin verified $179.96");
assert(admin.includes("GMV empty until platform Closed deals"), "admin GMV empty copy");

const botbuyer = (ledger.deals ?? ledger).find?.(
  (deal) => deal.id === "deal_botbuyer_ai",
) ?? ledger.deals?.find((deal) => deal.id === "deal_botbuyer_ai");
const deals = Array.isArray(ledger.deals) ? ledger.deals : Array.isArray(ledger) ? ledger : [];
const row = deals.find((deal) => deal.id === "deal_botbuyer_ai") ?? botbuyer;
assert(row, "ledger has deal_botbuyer_ai");
assert(Number(row?.price_usd ?? row?.priceUsd) === 179.96, "ledger verified $179.96");

if (failures.length) {
  console.error("craft-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}

console.log("craft-smoke PASS");
console.log(" - primary contrast tokens bg-white / text-black");
console.log(" - go-live Run present");
console.log(" - CPO land/signup/proof/empty CTA locks");
console.log(" - Admin Finance/Deals above stubs");
console.log(" - GMV=0 · verified $179.96");
