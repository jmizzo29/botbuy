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
  land.includes("DEMO_PILL_CLASS") ||
    chrome.includes("DEMO_PILL_CLASS") ||
    land.includes("bg-demo"),
  "land Demo pill token",
);
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
assert(
  land.includes("BRAND.pocBanner") || chrome.includes("BRAND.pocBanner"),
  "land keeps POC pill",
);
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
assert(chrome.includes("MY_DEALS_LABEL") || chrome.includes("My deals"), "My deals still exists after session");

assert(empty.includes("GO_LIVE_PRIMARY_LABEL"), "Searching empty uses Run BotBuy lock");
assert(empty.includes('SEARCHING_EMPTY_SECONDARY = "Edit intent"'), "Searching Edit intent");
assert(empty.includes('NEEDS_YOU_CTA = "Review gates"'), "Needs-you Review gates");
assert(empty.includes('AGENTS_EMPTY_SECONDARY = "See how activation works"'), "Agents empty secondary");
assert(empty.includes('"/deals?status=Closed"'), "Agents empty → Closed deals");
assert(home.includes("DealsTable"), "My deals dense table");
assert(home.includes("MY_DEALS_LABEL") || home.includes("My deals"), "My deals is /home");
assert(home.includes("APPROVE_MICRO") || home.includes("BotBuy only runs what you approve."), "home approve micro");
assert(home.includes("no invented GMV"), "My deals invents no GMV");
assert(dealDetail.includes("DealApproveActions"), "deal detail Approve/Reject");
assert(dealDetail.includes("auto-approve OFF"), "deal detail auto-approve OFF");
const demoNeedsYou = read("lib/demo-needs-you.ts");
assert(demoNeedsYou.includes('status: "Needs you"'), "demo Needs you fixture status");
assert(demoNeedsYou.includes("DEMO_NEEDS_YOU_LISTED_USD = 420"), "demo Needs you listed $420");
assert(demoNeedsYou.includes("countsTowardCfoMoney"), "demo fixture opted out of CFO money");
assert(dealUi.includes("isDemoQaFixture(deal)"), "public proof excludes demo QA fixture");
assert(store.includes("ensureDemoNeedsYou") || store.includes("DEMO_NEEDS_YOU"), "store seeds Needs you demo");
assert(store.includes(".filter(countsTowardCfoMoney)"), "store money helpers skip demo fixture");
assert(approveUi.includes("APPROVE_LABEL") && approveUi.includes("REJECT_LABEL"), "Needs you ships Approve and Reject");
assert(approveUi.includes("APPROVE_MICRO"), "approve micro on Needs you actions");
assert(!approveUi.includes("{compact ? null"), "compact does not hide Reject");
assert(vaultLib.includes('VAULT_H1 = "Add a payment method"'), "vault H1 lock");
assert(!vaultPage.includes("Fund your vault"), "vault page has no Fund your vault");
assert(!vaultPage.toLowerCase().includes("balance"), "vault page has no balance");
assert(vaultApi.includes("VAULT_H1"), "vault API uses VAULT_H1");
assert(chrome.includes("BRAND.pocBanner") || chrome.includes("POC · Demo · not live"), "land header Demo pill");
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
assert(admin.includes("No $ / user") || usageUi.includes("No $ / user"), "admin usage has no $/user");
assert(!usageUi.includes("formatUsd") && !/\$\d/.test(usageUi), "usage UI invents no $ amounts");

assert(finance.includes("const customerGmvUsd = 0"), "customer GMV locked at 0");
assert(finance.includes("EXPECTED_IMPORTED_PENDING_USD = 416.68"), "CFO pending lock $416.68");
assert(finance.includes("FORBIDDEN_DEMO_INFLATED_PENDING_USD = 836.68"), "CFO forbids demo-inflated $836.68");
assert(finance.includes("countsTowardCfoMoney"), "CFO rollup excludes demo QA fixture");
assert(store.includes("countsTowardCfoMoney"), "listed/verified spend exclude demo QA fixture");
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
assert(brand.includes("hero: LAND_META_LINE"), "land H1 is locked one-liner");
assert(!brand.includes("Vault it."), "brand has no Vault it");
assert(!/\band vault\b/.test(brand), "brand has no and vault");
assert(!land.includes("Vault it"), "land page source has no Vault it");
assert(!/\band vault\b/.test(land), "land page source has no and vault");
assert(!signup.includes("and vault") && !signup.includes("Vault it"), "signup has no vault-as-balance line");
assert(layout.includes("LAND_META_LINE"), "layout meta uses locked one-liner");
assert(manifest.includes("LAND_META_LINE"), "manifest uses locked one-liner");
assert(!layout.includes("BotBuy does the rest."), "layout dropped old vault one-liner");
assert(!manifest.includes("Vault it."), "manifest dropped Vault it");
assert(brand.includes('title: "Set spend."'), "how-it-works step 1 title lock");
assert(brand.includes('body: "Your limit. BotBuy stays inside it."'), "how-it-works step 1 body lock");
assert(brand.includes('title: "Set intent."'), "how-it-works step 2 title lock");
assert(brand.includes('body: "Any software, any channel."'), "how-it-works step 2 body lock");
assert(brand.includes('title: "Add a payment method."'), "how-it-works step 3 title lock");
assert(
  brand.includes('body: "Link how we pay at purchase. We don’t hold a balance."'),
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
assert(land.includes("techlux-air") || chrome.includes("techlux-air") || css.includes("land-bg-techlux-air"), "land uses techlux-air");
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
assert(layout.includes("/brand/og-1200x630.png"), "layout Open Graph image");
assert(layout.includes("https://botbuyer.ai/brand/og-1200x630.png"), "twitter image Vault OG");
assert(manifest.includes("/icons/icon-192.png"), "manifest icon-192");
assert(manifest.includes("/icons/icon-512.png"), "manifest icon-512");
assert(manifest.includes("/icons/icon-512-maskable.png"), "manifest maskable icon");

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
assert(vaultRails.includes('VAULT_H1 = "Add a payment method"'), "vault H1 lock");
assert(vaultRails.includes("We don’t hold a balance."), "vault sub no-balance lock");
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
console.log(" - Quiet Capital type · techlux-air + veil · no glow");
console.log(" - Vault mark+wordmark header · favicon/PWA/OG wired");
console.log(" - site pages /privacy /terms /about /beta /contact · footer lock");
