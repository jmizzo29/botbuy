#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
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
const dealUi = read("lib/deal-ui.ts");
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
const a2hsHook = read("components/use-a2hs.ts");
const a2hsHowTo = read("components/a2hs-howto.tsx");
const landInstall = read("components/land-install-button.tsx");
const vaultBg = read("components/vault-cards-backdrop.tsx");
const wire = read("lib/designer-wire-notes.ts");
const palette = read("lib/palette.ts");
const demoBadge = read("components/demo-badge.tsx");
const shell = read("components/app-shell.tsx");
const approveUi = read("components/deal-approve-actions.tsx");
const vaultLib = read("lib/vault-rails.ts");
const vaultPage = read("app/(app)/vault/page.tsx");
const vaultApi = read("app/api/vault/route.ts");
const layout = read("app/layout.tsx");
const manifest = read("app/manifest.ts");
const lockup = read("components/brand-lockup.tsx");
const ledger = JSON.parse(read("data/john-deal-ledger.json"));

assert(wire.includes('GO_LIVE_PRIMARY_LABEL = "Run BotBuy"'), "wire notes label lock");
assert(palette.includes('PALETTE_ID = "g-techlux"'), "palette id g-techlux");
assert(palette.includes('PALETTE_SIGNAL = "HOLD"'), "soft-signal HOLD");
assert(palette.includes('bg: "#F7F8FA"'), "palette bg");
assert(palette.includes('surface: "#FFFFFF"'), "palette surface");
assert(palette.includes('text: "#0A0A0A"'), "palette text");
assert(palette.includes('muted: "#737373"'), "palette muted");
assert(palette.includes('primary: "#2DD4BF"'), "palette primary teal");
assert(palette.includes('primaryLabel: "#042F2E"'), "palette primary dark label");
assert(palette.includes('accent: "#5EEAD4"'), "palette accent");
assert(palette.includes('demo: "#B8860B"'), "palette demo");
assert(palette.includes('danger: "#E11D48"'), "palette danger");
assert(palette.includes('success: "#059669"'), "palette success");
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
assert(css.includes("--bb-bg: #F7F8FA"), "handoff --bb-bg");
assert(css.includes("--bb-surface: #FFFFFF"), "handoff --bb-surface");
assert(css.includes("--bb-text: #0A0A0A"), "handoff --bb-text");
assert(css.includes("--bb-muted: #737373"), "handoff --bb-muted");
assert(css.includes("--bb-primary: #2DD4BF"), "handoff --bb-primary");
assert(css.includes("--bb-primary-fg: #042F2E"), "handoff --bb-primary-fg");
assert(css.includes("--bb-accent: #5EEAD4"), "handoff --bb-accent");
assert(css.includes("--bb-demo: #B8860B"), "handoff --bb-demo");
assert(css.includes("--bb-line: rgba(0, 0, 0, 0.07)"), "handoff --bb-line");
assert(css.includes("--bb-veil: rgba(247, 248, 250, 0.78)"), "handoff --bb-veil");
assert(css.includes("--bb-demo-bg: rgba(232, 184, 74, 0.12)"), "handoff --bb-demo-bg");
assert(css.includes("--bb-danger: #E11D48"), "handoff --bb-danger");
assert(css.includes("--bb-success: #059669"), "handoff --bb-success");
assert(css.includes("--bb-radius: 0.85rem"), "handoff --bb-radius");
assert(
  css.includes("--bb-demo: #B8860B") && css.includes("--bb-primary: #2DD4BF"),
  "Demo gold distinct from primary CTA teal",
);
assert(!css.includes("--bb-bg: #050A0C"), "default bg is not black #050A0C");
assert(!css.includes("background-color: var(--bb-demo)"), "Demo gold is not CTA fill");
assert(
  !land.includes("DEMO_PILL_CLASS") && !land.includes("bg-demo"),
  "land fold has no Demo pill token",
);
assert(!chrome.includes("DEMO_PILL_CLASS"), "land chrome has no Demo pill token");
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

assert(brand.includes('trustLine: "Every deal needs your approval"'), "John/CEO land trust lock");
assert(!brand.includes("Demo · every deal"), "old Demo trust prefix removed");
assert(brand.includes('landHonesty: "Private beta"'), "land quiet Private beta honesty");
assert(
  existsSync(join(root, "cpo-land-no-demo-v1.md")),
  "CPO land no-Demo SoT committed",
);
assert(
  existsSync(join(root, "designer-land-no-demo-lock-v1.md")),
  "designer land no-Demo SoT committed",
);
const cpoLandNoDemo = read("cpo-land-no-demo-v1.md");
const landNoDemoSot = read("designer-land-no-demo-lock-v1.md");
assert(
  cpoLandNoDemo.includes("`Every deal needs your approval`"),
  "CPO land no-Demo names locked trust",
);
assert(!cpoLandNoDemo.includes("Demo · every deal"), "CPO land no-Demo has no Demo trust prefix");
assert(
  landNoDemoSot.includes("`Every deal needs your approval`"),
  "land no-Demo SoT names locked trust",
);
assert(
  landNoDemoSot.includes("cpo-land-no-demo-v1.md"),
  "designer land no-Demo points at CPO IA",
);
assert(
  cpoLandNoDemo.includes("designer-land-no-demo-lock-v1.md"),
  "CPO land no-Demo points at designer craft",
);
assert(
  (cpoLandNoDemo.includes("draft typo") || landNoDemoSot.includes("draft typo")) &&
    (cpoLandNoDemo.includes("void") || landNoDemoSot.includes("void")),
  "land no-Demo SoT voids Do not show trust typo",
);
assert(land.includes("BRAND.trustLine"), "land fold shows trust despite SoT typo");
assert(cpoLandNoDemo.includes("Private beta"), "CPO allows Private beta without Demo");
assert(!brand.includes("$1,000 gate"), "land trust line has no $1,000 gate");
assert(!brand.includes("gate for now"), "land brand has no gate for now");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(land), "land has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(signup), "signup has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(chrome), "public chrome has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(layout), "layout meta has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(manifest), "manifest marketing has no $1,000 gate");
assert(brand.includes('pocBanner: "POC · Demo · not live"'), "POC pill lock");
assert(land.includes("BRAND.trustLine"), "land renders trust line under CTAs");
assert(!land.includes("BRAND.pocBanner"), "land fold has no POC banner stack");
assert(signup.includes("BRAND.pocBanner"), "signup Demo pill");
assert(chrome.includes("footerHold") || chrome.includes("BRAND.footerHold"), "POC stays footer meta");
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
assert(proof.includes("LAND_PROOF_CAPTION"), "land proof uses empty caption");
assert(proofLib.includes('LAND_PROOF_CAPTION = "No public proof yet"'), "land proof empty honesty");
assert(!proof.includes("ProofBadge"), "land proof has no Demo / empty badge");
assert(!proofLib.includes("Demo / empty"), "land proof caption has no Demo/empty wording");
assert(!proof.includes("Demo"), "land proof strip has no Demo copy");
assert(!proof.includes("verified_at"), "public proof caption has no verified_at");

assert(chrome.includes("hasPublicSession"), "nav gates My deals on session");
assert(chrome.includes("MY_DEALS_LABEL") || chrome.includes("My deals"), "My deals still exists after session");

assert(empty.includes("GO_LIVE_PRIMARY_LABEL"), "Searching empty uses Run BotBuy lock");
assert(empty.includes('SEARCHING_EMPTY_SECONDARY = "Edit intent"'), "Searching Edit intent");
assert(empty.includes('NEEDS_YOU_CTA = "Review gates"'), "Needs-you Review gates");
assert(empty.includes('AGENTS_EMPTY_SECONDARY = "See how activation works"'), "Agents empty secondary");
assert(empty.includes('"/deals?status=Closed"'), "Agents empty → Closed deals");
assert(home.includes("DealsTable"), "My deals dense table");
assert(home.includes("MY_DEALS_LABEL") || home.includes("My deals"), "My deals is /home");
assert(
  approveUi.includes("APPROVE_MICRO") ||
    home.includes("APPROVE_MICRO") ||
    home.includes("BotBuy only runs what you approve."),
  "home approve micro",
);
assert(home.includes("no invented GMV"), "My deals invents no GMV");
assert(dealDetail.includes("DealApproveActions"), "deal detail Approve/Reject");
assert(dealDetail.includes("auto-approve OFF"), "deal detail auto-approve OFF");
const demoNeedsYou = read("lib/demo-needs-you.ts");
assert(demoNeedsYou.includes('status: "Needs you"'), "demo Needs you fixture status");
assert(demoNeedsYou.includes("DEMO_NEEDS_YOU_LISTED_USD = 420"), "demo Needs you listed $420");
assert(demoNeedsYou.includes("countsTowardCfoMoney"), "demo fixture opted out of CFO money");
assert(demoNeedsYou.includes("isNonLedgerDemoSeed"), "engine/demo seed opted out of CFO money");
assert(dealUi.includes("isNonLedgerDemoSeed(deal)"), "public proof excludes engine/demo seed");
assert(store.includes("ensureDemoNeedsYou") || store.includes("DEMO_NEEDS_YOU"), "store seeds Needs you demo");
assert(store.includes(".filter(countsTowardCfoMoney)"), "store money helpers skip demo fixture");
assert(approveUi.includes("APPROVE_LABEL") && approveUi.includes("REJECT_LABEL"), "Needs you ships Approve and Reject");
assert(approveUi.includes("APPROVE_MICRO"), "approve micro on Needs you actions");
assert(!approveUi.includes("{compact ? null"), "compact does not hide Reject");
assert(vaultLib.includes('VAULT_H1 = "Add a payment method"'), "vault H1 lock");
assert(
  vaultLib.includes(
    "Pay at purchase from your linked method. Your spend limit still applies.",
  ),
  "vault trust per-user spend limit",
);
assert(!vaultLib.includes("$1,000 gate"), "vault rails have no $1,000 gate");
assert(!vaultLib.includes("gate for now"), "vault rails have no gate for now");
assert(!vaultLib.includes("1000 gate"), "vault rails have no 1000 gate");
assert(!vaultPage.includes("Hard gate"), "vault page has no Hard gate label");
assert(!vaultPage.includes("$1,000 gate"), "vault page has no $1,000 gate");
assert(!vaultPage.includes("Fund your vault"), "vault page has no Fund your vault");
assert(!vaultPage.toLowerCase().includes("balance"), "vault page has no balance");
assert(vaultApi.includes("VAULT_H1"), "vault API uses VAULT_H1");
assert(!chrome.includes(">Demo<"), "land header has no Demo badge");
assert(
  chrome.includes("BRAND.landHonesty") || chrome.includes("Private beta"),
  "land header quiet Private beta",
);
assert(chrome.includes('href="/beta"'), "land Private beta leans on /beta");
assert(!chrome.includes("BRAND.pocBanner"), "POC pill is not land chrome");
assert(goLive.includes("APPROVE_MICRO") || goLive.includes("BotBuy only runs what you approve."), "go-live approve micro");
assert(existsSync(join(root, "public/brand/techlux/land-bg-techlux-air.png")), "techlux-air committed");
assert(existsSync(join(root, "public/brand/botbuy-logo-header-light.svg")), "light Vault lockup committed");
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
assert(
  admin.includes("No $ / user") ||
    usageUi.includes("No $ / user") ||
    usage.includes("No $ / user"),
  "admin usage has no $/user",
);
assert(!usageUi.includes("formatUsd") && !/\$\d/.test(usageUi), "usage UI invents no $ amounts");

assert(finance.includes("const customerGmvUsd = 0"), "customer GMV locked at 0");
assert(finance.includes("EXPECTED_IMPORTED_PENDING_USD = 416.68"), "CFO pending lock $416.68");
assert(finance.includes("FORBIDDEN_DEMO_INFLATED_PENDING_USD = 836.68"), "CFO forbids demo-inflated $836.68");
assert(finance.includes("countsTowardCfoMoney"), "CFO rollup excludes demo QA fixture");
assert(store.includes("countsTowardCfoMoney"), "listed/verified spend exclude demo QA fixture");
assert(admin.includes("botbuyer.ai $179.96"), "admin verified $179.96");
assert(admin.includes("GMV empty until platform Closed deals"), "admin GMV empty copy");
assert(admin.includes("Savedfast + xfer · not burn · not GMV"), "admin pending is Savedfast-only");
assert(admin.includes("Demo pending"), "admin labels Demo pending separately");
assert(admin.includes("demoPendingListedUsd"), "admin Demo pending uses fixture helper");

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

const deals = Array.isArray(ledger.deals) ? ledger.deals : Array.isArray(ledger) ? ledger : [];
const row = deals.find((deal) => deal.id === "deal_botbuyer_ai");
const savedfast = deals.find((deal) => deal.id === "deal_savedfast");
const xfer = deals.find((deal) => deal.id === "deal_namecheap_savedfast_xfer");
assert(row, "ledger has deal_botbuyer_ai");
assert(Number(row?.price_usd ?? row?.priceUsd) === 179.96, "ledger verified $179.96");
assert(savedfast?.status === "Closed", "Savedfast personal Closed");
assert(savedfast?.source === "imported", "Savedfast source imported");
assert(savedfast?.agent_executed === false, "Savedfast agent_executed=false");
assert(savedfast?.price_verified === false, "Savedfast not price_verified");
assert(savedfast?.amount_status === "imported_unverified", "Savedfast imported_unverified");
assert(
  savedfast?.escrow?.stage === "accepted" ||
    savedfast?.escrow?.stage === "seller-proceeds-processing",
  "Savedfast escrow accepted / seller-proceeds-processing",
);
assert(
  !String(savedfast?.escrow?.stage ?? "").toLowerCase().includes("complete"),
  "Savedfast escrow is not complete",
);
assert(Number(savedfast?.price_usd) === 405, "Savedfast listed $405 stays unverified");
assert(Array.isArray(savedfast?.blockers) && savedfast.blockers.length === 0, "Savedfast has no open blockers");
assert(
  !JSON.stringify(savedfast?.blockers ?? []).includes("403") &&
    !JSON.stringify(savedfast?.blockers ?? []).includes("Escrow received"),
  "Savedfast WP/escrow notes are not open blockers",
);
assert(
  String(savedfast?.notes ?? "").includes("AdSense"),
  "Savedfast AdSense carve-out stays a note",
);
assert(xfer?.status === "Closed", "xfer personal Closed");
assert(xfer?.source === "imported", "xfer source imported");
assert(xfer?.agent_executed === false, "xfer agent_executed=false");
assert(xfer?.price_verified === false, "xfer not price_verified");
assert(xfer?.amount_status === "imported_unverified", "xfer imported_unverified");
assert(Number(xfer?.price_usd) === 11.68, "xfer listed $11.68 stays unverified");
assert(ledger.cfo?.verified_startup_spend_usd === 179.96, "CFO verified burn $179.96 only");
assert(ledger.cfo?.pending_verify_usd === 416.68, "CFO pending $416.68 Savedfast+xfer once");

const LAND_META =
  "Set spend, intent, and a payment method. BotBuy executes what you approve.";
assert(brand.includes(LAND_META), "land/meta one-liner lock");
assert(brand.includes("signupLine: LAND_META_LINE"), "signup uses locked one-liner");
assert(brand.includes('LAND_PRODUCT_H1 = "Find it. Decide. Buy anything."'), "land H1 lock");
assert(brand.includes("hero: LAND_PRODUCT_H1"), "land hero is locked H1");
assert(brand.includes("lead: LAND_META_LINE"), "land lead is locked one-liner");
assert(!brand.includes("Buy software. You approve."), "software-only land tag removed from brand");
assert(!brand.includes("productTag"), "land has no product-tag slot");
assert(brand.includes('primaryCta: "Sign up"'), "land primary door is Sign up");
assert(brand.includes('secondaryCta: "Install"'), "land peer door is Install");
assert(!brand.includes("Start your first buy"), "land dropped Start your first buy");
assert(!brand.includes("See how it works"), "land dropped equal-weight See how it works");
assert(!brand.includes("Vault it."), "brand has no Vault it");
assert(!/\band vault\b/.test(brand), "brand has no and vault");
assert(!land.includes("Vault it"), "land page source has no Vault it");
assert(!/\band vault\b/.test(land), "land page source has no and vault");
assert(!signup.includes("and vault") && !signup.includes("Vault it"), "signup has no vault-as-balance line");
assert(layout.includes("LAND_META_LINE"), "layout meta uses locked one-liner");
assert(manifest.includes("LAND_META_LINE"), "manifest uses locked one-liner");
assert(!layout.includes("BotBuy does the rest."), "layout dropped old vault one-liner");
assert(!manifest.includes("Vault it."), "manifest dropped Vault it");
assert(brand.includes('title: "Set spend"'), "how-it-works step 1 title lock");
assert(brand.includes('body: "Your limit. BotBuy stays inside it."'), "how-it-works step 1 body lock");
assert(brand.includes('title: "Set intent"'), "how-it-works step 2 title lock");
assert(brand.includes('body: "Any software, any channel."'), "how-it-works step 2 body lock");
assert(brand.includes('title: "Add a payment method"'), "how-it-works step 3 title lock");
assert(
  brand.includes('body: "Pay at purchase. We don’t hold a balance."'),
  "how-it-works step 3 body lock",
);
assert(
  brand.includes(
    "Set spend, intent, and a payment method. BotBuy executes what you approve.",
  ),
  "land/meta one-liner lock",
);
assert(!brand.includes("Set spend, intent, and vault"), "old vault land line removed");
assert(!brand.includes("Vault it"), "Vault it removed from land brand copy");
assert(!land.includes("Vault it"), "land has no Vault it");
assert(!land.includes("VaultCardsBackdrop"), "land does not use vault-cards fold");
assert(land.includes("HowItWorksRail"), "land keeps How it works rail");
assert(land.includes("ProofStrip"), "land ProofStrip stays");
assert(land.includes("LAND_PRODUCT_H1"), "land H1 uses locked product line");
assert(!land.includes("LAND_PRODUCT_TAG"), "land has no software-only product tag");
assert(!land.includes("Buy software. You approve."), "land dropped software-only hero/tag");
assert(land.includes("LAND_META_LINE"), "land lead one-liner");
assert(land.includes("LandInstallButton"), "land Install door is wired");
assert(landInstall.includes("publicLand"), "land Install how-to is publicLand");
assert(a2hsHowTo.includes("publicLand"), "A2HS land path can hide Demo badge");
assert(a2hsHowTo.includes("LAND_A2HS_COPY"), "land A2HS copy omits Demo");
assert(
  read("lib/cpo-techlux.ts").includes(
    "Add BotBuy to your Home Screen. Not an App Store or Play listing.",
  ),
  "land A2HS honesty has no Demo prefix",
);
assert(!land.includes("Start your first buy"), "land fold has no Start your first buy");
assert(!land.includes("See how it works"), "how-it-works is not a fold CTA");
assert(!land.includes('href="#how"'), "how-it-works is secondary scroll only");
assert(land.includes("LAND_INSTALL_HELPER") || land.includes("Add to Home Screen for the full app on your phone."), "land install helper");
assert(land.includes("/brand/botbuy-mark.svg"), "land uses Vault mark");
assert(
  !/\bDemo\b/.test([land, chrome, proof, proofLib, how, landInstall].join("\n")),
  "no Demo in / rendered land copy",
);
assert(css.includes("land-bg-techlux-air"), "techlux-air asset token stays");
assert(css.includes(".bb-land-veil") && css.includes("var(--bb-veil)"), "land veil token");
assert(
  land.includes("LAND_FINDABILITY") ||
    land.includes("After you sign in, your deals live in"),
  "land My deals findability",
);
assert(!shell.includes("VaultCardsBackdrop"), "app shell is clean light chrome");
assert(vaultBg.includes('data-bg="vault-cards"'), "vault cards decorative marker");
assert(vaultBg.includes('aria-hidden="true"'), "vault cards are decorative");
assert(vaultBg.includes("bb-vault-rail"), "vault rail class");
assert(vaultBg.includes("bb-vault-card --c"), "vault card C class");
assert(vaultBg.includes("bb-vault-card --b"), "vault card B class");
assert(vaultBg.includes("bb-vault-card --a"), "vault card A class");
assert(!vaultBg.includes("animate-"), "vault cards have no motion");
assert(!vaultBg.includes("Closed"), "vault cards have no Closed copy");
assert(!vaultBg.includes("GMV"), "vault cards have no GMV");
assert(!/svg|mark|wordmark/i.test(vaultBg), "vault cards do not invent a mark");
assert(css.includes(".bb-vault-rail"), "globals vault rail");
assert(css.includes(".bb-vault-card.--c"), "globals card C");
assert(css.includes(".bb-vault-card.--b"), "globals card B");
assert(css.includes(".bb-vault-card.--a"), "globals card A");
assert(css.includes("width: 240px") && css.includes("height: 152px"), "vault card size");
assert(css.includes("border-radius: 16px"), "vault card radius 16px");
assert(css.includes("var(--bb-primary) 35%"), "vault card teal border ~35%");
assert(css.includes("pointer-events: none"), "vault rail pointer-events none");
assert(css.includes("left: 48px") && css.includes("top: 12px") && css.includes("rotate(-6deg)") && css.includes("opacity: 0.55"), "card C position");
assert(css.includes("left: 88px") && css.includes("top: 56px") && css.includes("rotate(-2deg)") && css.includes("opacity: 0.78"), "card B position");
assert(css.includes("left: 128px") && css.includes("top: 100px") && css.includes("rotate(2deg)"), "card A position");
assert(css.includes("@media (max-width: 767px)"), "vault rail hides below 768px");
assert(!css.includes("filter: drop-shadow") && !css.includes("text-shadow"), "no glow filters");
assert(how.includes("HOW_IT_WORKS.steps"), "how rail uses locked steps");
assert(how.includes("HOW_IT_WORKS.heading"), "how rail uses locked heading");
assert(css.includes("--line: var(--bb-line)"), "Techlux hairline --bb-line");
assert(css.includes("clamp(2.5rem, 5vw, 3.75rem)"), "Quiet Capital display H1");
assert(css.includes("font-size: 1.0625rem"), "Quiet Capital body size");
assert(css.includes("line-height: 1.65"), "Quiet Capital body leading");
assert(
  tokens.includes("bb-demo-bg") && tokens.includes("text-demo"),
  "Demo pill uses --bb-demo-bg + demo text",
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
assert(wire.includes(".bb-vault-rail"), "wire notes record Designer vault-rail spec");
assert(wire.includes("never letter-B"), "wire notes keep Vault mark — no letter-B");
assert(lockup.includes("/brand/botbuy-logo-header-light.svg"), "BrandLockup uses light Vault lockup SVG");
assert(lockup.includes('alt="BotBuy"'), "BrandLockup accessible alt");
assert(shell.includes("BrandLockup"), "app shell Vault header lockup");
assert(chrome.includes("BrandLockup"), "public chrome Vault header lockup");
assert(!/>\s*B\s*</.test(shell), "app shell no letter-B tile");
assert(!/>\s*B\s*</.test(chrome), "public chrome no letter-B tile");
assert(layout.includes("/favicon.ico"), "layout links favicon.ico");
assert(layout.includes("/favicon.svg"), "layout links favicon.svg");
assert(layout.includes("/icons/apple-touch-icon.png"), "layout apple-touch-icon");
assert(layout.includes("appleWebApp") && layout.includes("capable: true"), "layout appleWebApp capable");
assert(layout.includes("statusBarStyle: \"default\""), "layout Apple status bar for light shell");
assert(layout.includes("apple-mobile-web-app-capable"), "layout Apple capable meta");
assert(layout.includes("/brand/og-1200x630.png"), "layout Open Graph image");
assert(layout.includes("https://botbuyer.ai/brand/og-1200x630.png"), "twitter image Vault OG");
assert(manifest.includes("/icons/icon-192.png"), "manifest icon-192");
assert(manifest.includes("/icons/icon-512.png"), "manifest icon-512");
assert(manifest.includes("/icons/icon-512-maskable.png"), "manifest maskable icon");
assert(manifest.includes('display: "standalone"'), "manifest display standalone");
assert(
  manifest.includes("start_url: INSTALLED_START_HREF") ||
    manifest.includes('start_url: "/start"'),
  "A2HS start gate /start",
);
assert(manifest.includes("id:"), "manifest id");
const sw = read("public/sw.js");
assert(sw.includes('CACHE = "botbuy-v4"'), "SW cache bumped to botbuy-v4");
assert(sw.includes('pathname.startsWith("/_next/")'), "SW does not intercept Next chunks");
assert(sw.includes('"/home"') && sw.includes('"/start"') && sw.includes('"/offline"'), "SW precaches app shell routes");
assert(sw.includes("skipWaiting") && sw.includes("clients.claim"), "SW install/activate claim");
assert(existsSync(join(root, "app/offline/page.tsx")), "offline shell page");
assert(existsSync(join(root, "app/start/page.tsx")), "installed start gate");
assert(existsSync(join(root, "cpo-phone-first-full-app-ia-v1.md")), "CPO phone-first IA pack");
const startGate = read("app/start/page.tsx");
assert(startGate.includes("hasPublicSession"), "start checks signed-in");
assert(startGate.includes("redirect(MY_DEALS_HREF)") || startGate.includes('redirect("/home")'), "signed-in start → My deals");
assert(startGate.includes('redirect("/")'), "unsigned start → land");
const pwa = read("components/pwa-register.tsx");
assert(pwa.includes('register("/sw.js"'), "PWA registers /sw.js");
assert(
  shell.includes("InstallHint") && chrome.includes("InstallHint"),
  "discreet A2HS hint mounted on app + land",
);
const a2hs = [
  read("components/install-hint.tsx"),
  a2hsHook,
  a2hsHowTo,
  landInstall,
].join("\n");
const techlux = read("lib/cpo-techlux.ts");
assert(a2hs.includes("beforeinstallprompt"), "A2HS listens for beforeinstallprompt");
assert(a2hs.includes("setHowTo(true)"), "A2HS how-to opens when native install is unavailable or canceled");
assert(a2hs.includes("A2HS_COPY"), "A2HS uses locked copy");
assert(a2hs.includes("persistDismiss") || a2hs.includes("localStorage"), "A2HS dismiss persists");
assert(landInstall.includes("useA2hs"), "land Install uses PR #25 A2HS flow");
assert(land.includes("onLand") || read("components/install-hint.tsx").includes('pathname === "/"'), "land hides competing A2HS bar");
assert(techlux.includes("not an App Store or Play listing"), "A2HS copy is Demo-honest");
assert(shell.includes("safe-area-inset-bottom"), "bottom nav safe-area");
assert(shell.includes("safe-area-inset-top"), "sticky header safe-area");
assert(shell.includes("grid-cols-3"), "phone tabs are 3-col CPO IA");
assert(!shell.includes("grid-cols-5") && !shell.includes("grid-cols-6"), "phone tabs are not 5/6-col cram");
assert(shell.includes("MY_DEALS_LABEL") && !/>\s*Home\s*</.test(shell), "mobile label is My deals not Home");
assert(shell.includes('href: "/agents"') && shell.includes("PHONE_TAB_ADMIN"), "phone tabs Agents + owner Admin");
assert(!/mobileLinks[\s\S]*\/intent/.test(shell) && !/phoneTabs[\s\S]*\/vault/.test(shell), "Intent/Vault not bottom tabs");
assert(shell.includes("AppMoreMenu"), "Intent/Vault/Settings via header menu");
assert(shell.includes("needsYouCount") && shell.includes("Needs you"), "My deals Needs you badge");
assert(shell.includes("min-h-11"), "mobile nav 44pt tap target");
assert(css.includes("html.bb-standalone"), "standalone mode class");
const moreMenu = read("components/app-more-menu.tsx");
assert(moreMenu.includes("PHONE_MORE_LINKS"), "more menu uses CPO secondary links");
assert(
  techlux.includes('href: "/intent"') &&
    techlux.includes('href: "/vault"') &&
    techlux.includes('href: "/settings"'),
  "CPO more links are Intent/Vault/Settings",
);
const dealsTable = read("components/deals-table.tsx");
const dealsPhone = read("components/deals-phone-list.tsx");
assert(dealsTable.includes("overflow-x-auto"), "My deals table scrolls on narrow");
assert(dealsTable.includes("DealApproveActions"), "My deals table Approve/Reject");
assert(dealsTable.includes("DealsPhoneList"), "desktop table defers phone list");
assert(dealsPhone.includes("data-surface=\"my-deals-cards\""), "phone My deals cards");
assert(dealsPhone.includes("md:hidden"), "phone cards hide on desktop");
assert(
  dealsPhone.includes('"All"') &&
    dealsPhone.includes('"Needs you"') &&
    dealsPhone.includes('"Searching"') &&
    dealsPhone.includes('"Closed"'),
  "phone My deals filters All / Needs you / Searching / Closed",
);
assert(approveUi.includes("w-full sm:w-auto") || approveUi.includes("w-full"), "deal detail Approve/Reject full-width on phone");
assert(approveUi.includes("min-h-11"), "Approve/Reject 44pt taps");
assert(existsSync(join(root, "designer-ui-mocks-mobile-techlux.md")), "designer mobile Techlux visual SoT");
const designerMocks = read("designer-ui-mocks-mobile-techlux.md");
assert(designerMocks.includes("Every deal needs your approval"), "designer SoT keeps land trust");
assert(!designerMocks.includes("Demo · every deal needs your approval"), "designer SoT dropped Demo land trust");
assert(designerMocks.includes("Approve sheet"), "designer SoT locks Approve sheet");
assert(designerMocks.includes("Add to Home Screen"), "designer SoT locks A2HS");
const approveSheet = read("components/approve-sheet.tsx");
assert(approveSheet.includes("data-surface=\"approve-sheet\""), "Approve sheet surface");
assert(approveSheet.includes("createPortal"), "Approve sheet portals above A2HS");
assert(approveSheet.includes("APPROVE_SHEET_TITLE"), "Approve sheet title lock");
assert(approveSheet.includes("APPROVE_LABEL") && approveSheet.includes("REJECT_LABEL"), "Approve sheet has Approve + Reject");
assert(approveUi.includes("ApproveSheet"), "Needs you opens Approve sheet on phone");
assert(approveUi.includes("setSheetOpen(true)"), "phone Approve/Reject open sheet");
assert(techlux.includes('APPROVE_SHEET_TITLE = "Approve deal?"'), "CPO Approve sheet title");
assert(a2hs.includes("A2HS_BAR_TITLE") && a2hs.includes("data-surface=\"a2hs\""), "A2HS uses designer install bar");
assert(a2hs.includes("A2HS_GOT_IT") && a2hs.includes("A2HS_HOW"), "A2HS how-to sheet");
assert(home.includes("SPEND_LIMIT_PILL") && home.includes("AUTO_APPROVE_OFF"), "My deals spend + auto-approve pills");
assert(home.includes("remainingAfterVerified"), "My deals remaining is computed, not a fake $840");
assert(!home.includes("Spend remaining"), "home dropped $1k remaining-as-limit badge");
assert(shell.includes("data-surface=\"phone-tabs\""), "phone tabs designer surface");
assert(shell.includes("text-primary"), "active tab icon is teal jewelry");
assert(!usageUi.includes("text-zinc-"), "usage UI is Techlux light, not dark zinc");
assert(!usageUi.includes("bg-white/[0.03]"), "usage counters are not dark wash");
const vaultRailsUi = read("components/vault-rails.tsx");
assert(vaultRailsUi.includes("data-surface=\"payment-methods\""), "payment methods designer cards");
assert(usage.includes("Never Actual $"), "usage meter never Actual $");
assert(usage.includes("Estimate until CHO promote"), "usage stays Estimate");
assert(existsSync(join(root, "cpo-usage-ia-phone-v1.md")), "CPO usage IA pack");
assert(usage.includes("ADMIN_USAGE_MICRO") && usage.includes("all licensed users"), "Admin usage is platform aggregate");
assert(usage.includes("SETTINGS_USAGE_MICRO") && usage.includes("This account only"), "Settings usage is per-user");
assert(usage.includes("rollupUsageByUser"), "Admin by-user breakdown when metered");
const settingsPage = read("app/(app)/settings/page.tsx");
assert(settingsPage.includes("SettingsUsageSection"), "Settings is primary Usage surface");
assert(settingsPage.includes("listDeals(user.id)"), "Settings usage is that account only");
assert(usageUi.includes("SettingsUsageSection") && usageUi.includes('id="usage"'), "Settings usage anchor");
assert(usageUi.includes("SETTINGS_USAGE_MICRO"), "Settings card uses per-user micro");
assert(usageUi.includes("ADMIN_USAGE_MICRO"), "Admin card defaults to platform aggregate");
assert(usageUi.includes("byUser"), "Admin usage accepts by-user rows");
assert(admin.includes("byUser={usage.byUser}"), "Admin page passes platform by-user");
assert(usageUi.includes("/settings#usage"), "deal usage links to Settings");
assert(usageUi.includes("USAGE_ESTIMATE_LABEL") && usageUi.includes("DemoBadge"), "usage badges Demo/Estimate");
assert(!usageUi.includes("Actual $") || usage.includes("Never Actual $"), "usage UI invents no Actual $");
assert(usage.includes("USAGE_NO_PRECISE") && usageUi.includes("USAGE_NO_PRECISE"), "Usage has no-precise-costs lock");
assert(usage.includes('label: "Search"') && usage.includes('label: "Deal ops"') && usage.includes('label: "Other"'), "Usage bars Search / Deal ops / Other");
assert(usage.includes("USAGE_NOT_A_BILL") && usageUi.includes("USAGE_NOT_A_BILL"), "Usage estimate is not a bill");
assert(!usageUi.includes("~48k") && !home.includes("$840"), "Usage/home do not invent mock $840 or 48k tokens");
assert(approveSheet.includes("APPROVE_SHEET_LEAD"), "Approve sheet lead lock");
assert(techlux.includes("Auto-approve is OFF"), "Approve lead keeps auto-approve OFF");
assert(a2hs.includes("BRAND.trustLine"), "A2HS how-to shows land trust line");
assert(vaultRailsUi.includes("Available ≠ live"), "payment methods Available ≠ live");
assert(vaultPage.includes("cardLast4") || vaultRailsUi.includes("cardLast4"), "payment methods can show seeded last4");

const sitePages = read("lib/site-pages.ts");
const legalMd = read("lib/legal-markdown.ts");
const siteFooter = read("components/site-footer.tsx");
const siteShell = read("components/site-page-shell.tsx");
const privacyPage = read("app/privacy/page.tsx");
const termsPage = read("app/terms/page.tsx");
const aboutPage = read("app/about/page.tsx");
const betaPage = read("app/beta/page.tsx");
const contactPage = read("app/contact/page.tsx");
const privacySoT = read("docs/legal/privacy-policy-publish.md");
const termsSoT = read("docs/legal/terms-of-service-publish.md");
const aboutSoT = read("docs/site-pages/about.md");
const betaSoT = read("docs/site-pages/beta.md");
const contactSoT = read("docs/site-pages/contact.md");
const notFound = read("app/not-found.tsx");

assert(sitePages.includes('href: "/privacy", label: "Privacy"'), "footer Privacy lock");
assert(sitePages.includes('href: "/terms", label: "Terms"'), "footer Terms lock");
assert(sitePages.includes('href: "/about", label: "About"'), "footer About lock");
assert(sitePages.includes('href: "/beta", label: "Beta"'), "footer Beta lock");
assert(sitePages.includes('href: "/contact", label: "Contact"'), "footer Contact lock");
assert(
  sitePages.indexOf('label: "Privacy"') < sitePages.indexOf('label: "Terms"') &&
    sitePages.indexOf('label: "Terms"') < sitePages.indexOf('label: "About"') &&
    sitePages.indexOf('label: "About"') < sitePages.indexOf('label: "Beta"') &&
    sitePages.indexOf('label: "Beta"') < sitePages.indexOf('label: "Contact"'),
  "footer order Privacy · Terms · About · Beta · Contact",
);
assert(
  sitePages.includes(
    "BotBuy is early access. Features labeled Demo or Coming are not live commitments.",
  ),
  "early-access honesty lock",
);
assert(sitePages.includes('SITE_OPERATOR = "Build Star Labs (Florida)"'), "entity lock");
assert(sitePages.includes("September 11, 2026 (PT)"), "effective date PT lock");
assert(sitePages.includes("docs/legal/privacy-policy-publish.md"), "privacy publish SoT path");
assert(sitePages.includes("docs/legal/terms-of-service-publish.md"), "terms publish SoT path");
assert(sitePages.includes("docs/site-pages/about.md"), "about SoT path");
assert(sitePages.includes("docs/site-pages/beta.md"), "beta SoT path");
assert(sitePages.includes("docs/site-pages/contact.md"), "contact SoT path");
assert(!sitePages.includes("privacy-policy-v1.md"), "privacy does not use v1 draft");
assert(!sitePages.includes("terms-of-service-v1.md"), "terms does not use v1 draft");
assert(read("docs/legal/publish-notes-v1.md").includes("privacy-policy-publish.md"), "publish-notes SoT");
assert(legalMd.includes("publish-notes-v1.md"), "loader cites publish-notes");
assert(!legalMd.includes("privacy-policy-v1.md"), "loader never reads privacy v1");
assert(!legalMd.includes("terms-of-service-v1.md"), "loader never reads terms v1");
assert(!legalMd.includes("about-v1.md") && !legalMd.includes("beta-v1.md") && !legalMd.includes("contact-v1.md"), "loader prefers site-pages without -v1");
assert(legalMd.includes("omitDisputeSection"), "terms omit dispute/venue section");
assert(legalMd.includes("Cookie banner / CMP remains deferred"), "cookie banner deferred");
assert(chrome.includes("SiteFooter"), "land chrome has site footer");
assert(shell.includes("SiteFooter"), "app shell has site footer");
assert(!chrome.includes("Cookie") && !shell.includes("cookie banner"), "no cookie banner invent");
assert(privacyPage.includes('loadLegalBlocks("privacy"'), "privacy renders publish blocks");
assert(termsPage.includes('loadLegalBlocks("terms"'), "terms renders publish blocks");
assert(aboutPage.includes('loadLegalBlocks("about"'), "about renders site-pages SoT");
assert(betaPage.includes('loadLegalBlocks("beta"'), "beta renders site-pages SoT");
assert(contactPage.includes('loadLegalBlocks("contact"'), "contact renders site-pages SoT");
assert(betaPage.includes("SITE_BETA_CTA.run"), "beta Run BotBuy CTA");
assert(privacySoT.includes("Build Star Labs (Florida)"), "privacy publish entity");
assert(privacySoT.includes("September 11, 2026"), "privacy publish effective date");
assert(termsSoT.includes("State of Florida"), "terms publish Florida governing law");
assert(termsSoT.includes("omitted until attorney supplies text"), "terms dispute omitted in SoT");
assert(aboutSoT.includes("Operator:** Build Star Labs (Florida)"), "about operator");
const BETA_OPERATOR =
  "**Operator:** Build Star Labs (Florida). BotBuy is offered on botbuyer.ai.";
function stripLeadingMeta(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  if (lines[i]?.startsWith("# ")) i += 1;
  while (i < lines.length && !lines[i].trim()) i += 1;
  while (i < lines.length && lines[i].startsWith(">")) i += 1;
  while (i < lines.length && !lines[i].trim()) i += 1;
  return lines.slice(i).join("\n");
}
const betaBody = stripLeadingMeta(betaSoT);
assert(betaSoT.includes(BETA_OPERATOR), "beta SoT Operator body line");
assert(betaBody.includes(BETA_OPERATOR), "beta Operator survives meta strip");
assert(betaBody.includes("Build Star Labs") && betaBody.includes("Florida"), "beta Operator is body text");
assert(!/^## Lead/m.test(betaSoT), "beta no Lead paste-meta heading");
assert(!betaSoT.includes("Muted:"), "beta no Muted paste-meta");
assert(betaSoT.includes("Use **Run BotBuy** on the home page") || betaSoT.includes("Use Run BotBuy on the home page"), "beta how-to copy");
assert(termsSoT.includes("## No custodial balances (product lock)"), "terms no-custody heading");
assert(termsSoT.includes("executor of human-approved actions"), "terms human-approved executor");
assert(privacySoT.includes("does not hold custodial stored-value"), "privacy no-custody");
const vaultRails = read("lib/vault-rails.ts");
const spendPolicy = read("lib/spend-policy.ts");
const agentOrg = read("lib/agent-org.ts");
const limitsForm = read("components/limits-form.tsx");
assert(vaultRails.includes('VAULT_H1 = "Add a payment method"'), "vault H1 lock");
assert(vaultRails.includes("We don’t hold a balance."), "vault sub no-balance lock");
assert(
  spendPolicy.includes(
    "Your spend limit applies. Every deal needs approval before spend. Auto-approve OFF. Fail-closed.",
  ),
  "spend-policy label is per-user, not a public $1,000 gate",
);
assert(!spendPolicy.includes("Spend-out ceiling $1,000"), "spend-policy label dropped public $1,000 ceiling");
assert(
  agentOrg.includes(
    "Agents never bypass your approval. Your spend limit still applies to buys.",
  ),
  "agent spend micro is per-user spend limit",
);
assert(!agentOrg.includes("Purchase gate $1,000"), "agent spend micro has no Purchase gate $1,000");
assert(!limitsForm.includes("Hard gate $1,000"), "limits form has no Hard gate $1,000");
assert(!goLive.includes("Hard gate"), "go-live recap has no Hard gate label");
assert(!vaultRails.includes("Fund your vault"), "vault rails dropped Fund your vault");
assert(!read("app/(app)/vault/page.tsx").includes("Fund your vault"), "vault page dropped Fund your vault");
assert(!read("app/api/vault/route.ts").includes("Fund your vault"), "vault API dropped Fund your vault");
assert(contactSoT.includes("legal@botbuyer.ai"), "contact legal inbox");
assert(contactSoT.includes("Mailbox provisioning may still be completing"), "contact mailbox honesty");
assert(siteShell.includes("EARLY_ACCESS_HONESTY"), "page chrome honesty line");
assert(siteFooter.includes("SITE_FOOTER_LINKS"), "footer uses locked links");
assert(read("components/markdown-prose.tsx").includes("mailto:${LEGAL_CONTACT_EMAIL}"), "legal email mailto");
assert(notFound.includes("SITE_EMPTY.notFoundTitle"), "404 uses CPO copy");
assert(notFound.includes('href="/"'), "404 Back home → /");
assert(css.includes("--bb-bg: #F7F8FA"), "default shell is G Techlux light");
assert(!css.includes("--bb-bg: #050A0C"), "black is not the default bg");
assert(css.includes(".bb-prose"), "legal prose styles");
assert(!siteFooter.includes("Namecheap"), "footer row has no Namecheap");
assert(!siteFooter.includes("Run BotBuy"), "footer does not compete with Run BotBuy");

if (failures.length) {
  console.error("craft-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}

console.log("craft-smoke PASS");
console.log(" - g-techlux light #F7F8FA · teal #2DD4BF / #042F2E ≥4.5:1");
console.log(" - land/meta one-liner payment method lock · no Vault it");
console.log(" - go-live Run BotBuy present");
console.log(" - CPO land/signup/proof/empty CTA locks");
console.log(" - Admin Finance/Deals above stubs");
console.log(" - GMV=0 · verified $179.96");
console.log(" - Savedfast/xfer personal Closed · imported_unverified");
console.log(" - usage meter Estimate / Demo · not live");
console.log(" - soft-signal HOLD · Demo pill #B8860B");
console.log(" - Quiet Capital type · Product door A · clean #F7F8FA");
console.log(" - Vault mark+wordmark header · favicon/PWA/OG wired");
console.log(" - site pages /privacy /terms /about /beta /contact · footer lock");
