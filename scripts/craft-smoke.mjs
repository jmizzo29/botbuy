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
const usage = read("lib/usage.ts");
const store = read("lib/store.ts");
const journal = read("lib/engine-journal.ts");
const dealDetail = read("app/(app)/deals/[id]/page.tsx");
const usageUi = read("components/usage-meter.tsx");
const brand = read("lib/brand.ts");
const empty = read("lib/empty-cta.ts");
const emptyUi = read("components/empty-ctas.tsx");
const how = read("components/how-it-works.tsx");
const wire = read("lib/designer-wire-notes.ts");
const palette = read("lib/palette.ts");
const demoBadge = read("components/demo-badge.tsx");
const shell = read("components/app-shell.tsx");
const ledger = JSON.parse(read("data/john-deal-ledger.json"));

assert(wire.includes('GO_LIVE_PRIMARY_LABEL = "Run BotBuy"'), "wire notes label lock");
assert(palette.includes('PALETTE_ID = "electric-teal"'), "palette id electric-teal");
assert(palette.includes('PALETTE_SIGNAL = "HOLD"'), "soft-signal HOLD");
assert(palette.includes('bg: "#050A0C"'), "palette bg");
assert(palette.includes('surface: "#0C1518"'), "palette surface");
assert(palette.includes('text: "#F4FFFD"'), "palette text");
assert(palette.includes('muted: "#7A9A96"'), "palette muted");
assert(palette.includes('primary: "#2DD4BF"'), "palette primary teal");
assert(palette.includes('primaryLabel: "#042F2E"'), "palette primary dark label");
assert(palette.includes('accent: "#5EEAD4"'), "palette accent");
assert(palette.includes('demo: "#E8B84A"'), "palette demo");
assert(palette.includes('danger: "#FB7185"'), "palette danger");
assert(palette.includes('success: "#34D399"'), "palette success");
assert(wire.includes("PALETTE.primary"), "wire notes primary from palette");
assert(wire.includes("PALETTE.primaryLabel"), "wire notes label from palette");
assert(!wire.includes("#ffffff"), "wire notes dropped craft-pack white fill");
assert(!wire.includes("#000000"), "wire notes dropped craft-pack black label");
assert(tokens.includes("DESIGNER_PRIMARY_BG"), "tokens follow wire notes bg");
assert(tokens.includes("DESIGNER_PRIMARY_FG"), "tokens follow wire notes fg");
assert(wire.includes('backgroundColor: "var(--bb-primary)"'), "primary inline style uses --bb-primary");
assert(wire.includes('color: "var(--bb-primary-fg)"'), "primary inline style uses --bb-primary-fg");
assert(tokens.includes("PRIMARY_CONTRAST_RATIO"), "tokens keep measured contrast");
assert(tokens.includes("min: 4.5"), "primary contrast floor 4.5:1");
assert(button.includes("PRIMARY_BUTTON_STYLE"), "Button applies inline primary style");
assert(button.includes("PRIMARY_BUTTON_CLASS"), "Button uses primary class token");
assert(button.includes('data-contrast={isPrimary ? "primary"'), "primary contrast marker");
assert(palette.includes('"--bb-bg"'), "palette CSS var --bb-bg");
assert(palette.includes('"--bb-primary-fg"'), "palette CSS var --bb-primary-fg");
assert(
  css.includes("color: var(--bb-primary-fg) !important") &&
    css.includes("background-color: var(--bb-primary) !important"),
  "globals force teal fill + dark label via --bb-primary",
);
assert(!css.includes("background-color: #ffffff !important"), "globals no white primary fill");
assert(!css.includes("color: #000000 !important"), "globals no black primary label");
assert(css.includes("--bb-bg: #050A0C"), "handoff --bb-bg");
assert(css.includes("--bb-surface: #0C1518"), "handoff --bb-surface");
assert(css.includes("--bb-text: #F4FFFD"), "handoff --bb-text");
assert(css.includes("--bb-muted: #7A9A96"), "handoff --bb-muted");
assert(css.includes("--bb-primary: #2DD4BF"), "handoff --bb-primary");
assert(css.includes("--bb-primary-fg: #042F2E"), "handoff --bb-primary-fg");
assert(css.includes("--bb-accent: #5EEAD4"), "handoff --bb-accent");
assert(css.includes("--bb-demo: #E8B84A"), "handoff --bb-demo");
assert(css.includes("--bb-danger: #FB7185"), "handoff --bb-danger");
assert(css.includes("--bb-success: #34D399"), "handoff --bb-success");
assert(
  css.includes("--bb-demo: #E8B84A") && css.includes("--bb-primary: #2DD4BF"),
  "Demo gold distinct from primary CTA teal",
);
assert(!css.includes("background-color: var(--bb-demo)"), "Demo gold is not CTA fill");
assert(land.includes("DEMO_PILL_CLASS") || land.includes("bg-demo"), "land Demo pill token");
assert(shell.includes("bg-background"), "app shell uses palette bg");
assert(chrome.includes("bg-background"), "land chrome uses palette bg");
assert(demoBadge.includes("DEMO_PILL_CLASS"), "Demo badge uses demo token");

assert(goLive.includes('data-cta="go-live-run"'), "go-live Run marked");
assert(goLive.includes("GO_LIVE_PRIMARY_LABEL"), "go-live uses wire-notes label");
assert(
  (goLive.replace(/\n/g, " ").match(/\{GO_LIVE_PRIMARY_LABEL\}/g) || []).length === 2,
  "go-live submit + disabled labels are Run BotBuy",
);
assert(!/>\s*Run\s*</.test(goLive), "go-live no bare Run label");
assert(!goLive.includes(">Run BotBuy<") && !goLive.includes(">Run<"), "go-live no hardcoded Run");
assert(!/<(Button)[^>]*variant="ghost"[^>]*>\s*Run/.test(goLive), "Run is not ghost");

const primaryBlocks = [
  ["land CTA", land, "<Button asChild size=\"lg\">"],
  ["signup Continue", signup, "<Button type=\"submit\""],
  ["go-live Run", goLive, "data-cta=\"go-live-run\""],
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
assert(signup.includes("Continue"), "signup Continue label");
assert(!signup.includes("variant="), "signup Continue stays primary");

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

assert(empty.includes("GO_LIVE_PRIMARY_LABEL"), "Searching empty uses Run BotBuy lock");
assert(empty.includes('SEARCHING_EMPTY_SECONDARY = "Edit intent"'), "Searching Edit intent");
assert(empty.includes('NEEDS_YOU_CTA = "Review gates"'), "Needs-you Review gates");
assert(empty.includes('AGENTS_EMPTY_SECONDARY = "See how activation works"'), "Agents empty secondary");
assert(empty.includes('"/deals?status=Closed"'), "Agents empty → Closed deals");
assert(home.includes("SearchingEmpty"), "home Searching empty");
assert(home.includes("NeedsYouCta"), "home Needs-you CTA");
assert(agents.includes("AgentsEmptySecondary"), "agents empty secondary");

const financeIdx = admin.indexOf("<CardTitle>Finance</CardTitle>");
const dealsIdx = admin.indexOf("<CardTitle>Deals ops</CardTitle>");
const usageIdx = admin.indexOf("<AdminUsageRollup");
const trafficIdx = admin.indexOf("<CardTitle>Web traffic</CardTitle>");
const mrrIdx = admin.indexOf("<CardTitle>MRR / revenue</CardTitle>");
assert(financeIdx > -1 && dealsIdx > -1 && trafficIdx > -1, "admin sections present");
assert(financeIdx < trafficIdx && dealsIdx < trafficIdx, "Finance/Deals above analytics stubs");
assert(financeIdx < dealsIdx, "Finance above Deals");
assert(usageIdx > dealsIdx && usageIdx < trafficIdx, "Usage rollup after Deals, before stubs");
assert(trafficIdx < mrrIdx, "traffic stub before MRR stub");
assert(admin.includes("Demo stub") && admin.includes("DemoStub"), "in-card Demo stub styling");
assert(admin.includes("No $ / user") || usageUi.includes("No $ / user"), "admin usage has no $/user");
assert(!usageUi.includes("formatUsd") && !/\$\d/.test(usageUi), "usage UI invents no $ amounts");

assert(finance.includes("const customerGmvUsd = 0"), "customer GMV locked at 0");
assert(admin.includes("botbuyer.ai $179.96"), "admin verified $179.96");
assert(admin.includes("GMV empty until platform Closed deals"), "admin GMV empty copy");

assert(usage.includes('costKind: "estimate"') || usage.includes('USAGE_COST_KIND'), "usage costKind estimate");
assert(usage.includes("Estimate until CHO promote"), "usage Estimate until CHO");
assert(usage.includes("Never Actual $"), "usage never Actual $");
assert(usage.includes("billed: false") || usage.includes("not billed"), "usage not billed");
assert(usage.includes('phase: "search"'), "searching stub phase search");
assert(usage.includes("unknown"), "provider/model unknown fallback");
assert(store.includes("ensureSearchingUsageStub"), "Run records usage stub");
assert(store.includes("createSearchingDealFromRun"), "go-live Searching run wired");
assert(journal.includes("usage: journal.usage"), "journal persists usage");
assert(journal.includes("ENGINE_JOURNAL_COOKIE"), "cookie journal still used");
assert(dealDetail.includes("DealUsageSection"), "deal detail usage section");
assert(usageUi.includes("Demo · not live") || usageUi.includes("USAGE_DEMO_BADGE"), "usage Demo badge");
assert(usageUi.includes("tokens_est"), "usage labels tokens_est");
assert(usageUi.includes("model_calls"), "usage labels model_calls");
assert(usageUi.includes("tool_calls"), "usage labels tool_calls");

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

assert(brand.includes('title: "Set spend."'), "how-it-works step 1 title lock");
assert(brand.includes('body: "Your limit. BotBuy stays inside it."'), "how-it-works step 1 body lock");
assert(brand.includes('title: "Set intent."'), "how-it-works step 2 title lock");
assert(brand.includes('body: "Any software, any channel."'), "how-it-works step 2 body lock");
assert(brand.includes('title: "Vault it."'), "how-it-works step 3 title lock");
assert(
  brand.includes('body: "Then BotBuy searches, purchases, and closes."'),
  "how-it-works step 3 body lock",
);
assert(land.includes("HowItWorksRail"), "land two-column how-it-works rail");
assert(how.includes("HOW_IT_WORKS.steps"), "how rail uses locked steps");
assert(how.includes("HOW_IT_WORKS.heading"), "how rail uses locked heading");
assert(css.includes("--line: color-mix(in srgb, var(--bb-text) 6%, transparent)"), "Quiet Capital 6% rings");
assert(css.includes("clamp(2.5rem, 5vw, 3.75rem)"), "Quiet Capital display H1");
assert(css.includes("font-size: 1.0625rem"), "Quiet Capital body size");
assert(css.includes("line-height: 1.65"), "Quiet Capital body leading");
assert(
  tokens.includes("var(--bb-demo)_9%") && tokens.includes("var(--bb-demo)_25%"),
  "Demo pill calmer 9% wash / 25% ring",
);
assert(emptyUi.includes("px-5 py-8"), "empty panel air py-8 px-5");
assert(emptyUi.includes("text-base font-medium"), "empty title text-base font-medium");
assert(emptyUi.includes("text-sm leading-relaxed text-muted"), "empty body muted");
assert(emptyUi.includes("mt-5 flex flex-wrap gap-3"), "empty CTA row mt-5 gap-3");
assert(button.includes("px-7"), "primary lg px-7");
assert(button.includes("shadow-none"), "primary no glow/shadow");
assert(!button.includes("drop-shadow"), "no drop-shadow glow");
assert(!button.includes("animate-pulse"), "no pulse motion");
assert(!land.includes("animate-"), "land has no looping motion");
assert(!emptyUi.includes("animate-"), "empties have no looping motion");
assert(!css.includes("box-shadow:") || css.includes("inset 0 0 0 1px var(--line)"), "no glow box-shadow");
assert(wire.includes("Quiet Capital"), "wire notes record Quiet Capital HOLD craft");
assert(wire.includes("Not a public launch"), "Quiet Capital docs stay HOLD");

console.log("craft-smoke PASS");
console.log(" - electric-teal primary #2DD4BF / #042F2E ≥4.5:1");
console.log(" - go-live Run BotBuy present");
console.log(" - CPO land/signup/proof/empty CTA locks");
console.log(" - Admin Finance/Deals above stubs");
console.log(" - GMV=0 · verified $179.96");
console.log(" - usage meter Estimate / Demo · not live");
console.log(" - soft-signal HOLD · Demo pill #E8B84A");
console.log(" - Quiet Capital craft · 3-card how rail · no glow");
