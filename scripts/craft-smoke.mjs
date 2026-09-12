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
const signup = read("app/signup/[[...sign-up]]/page.tsx");
const signIn = read("app/signin/[[...sign-in]]/page.tsx");
const authSignupIa = read("cpo-real-auth-signup-ia-v1.md");
const authSignupCraft = read("designer-real-auth-signup-craft-v1.md");
const authDoor = read("components/auth-door.tsx");
const middleware = read("middleware.ts");
const schema = read("lib/db/schema.ts");
const authLib = read("lib/auth.ts");
const sessionLib = read("lib/session.ts");
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

assert(wire.includes('GO_LIVE_PRIMARY_LABEL = "Run BotBuyer"'), "wire notes label lock");
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
  "go-live submit + disabled labels are Run BotBuyer",
);
assert(!/>\s*Run\s*</.test(goLive), "go-live no bare Run label");
assert(!goLive.includes(">Run BotBuyer<") && !goLive.includes(">Run<"), "go-live no hardcoded Run");
assert(!/<(Button)[^>]*variant="ghost"[^>]*>\s*Run/.test(goLive), "Run is not ghost");

const primaryBlocks = [
  ["land CTA", land, "<Button asChild size=\"lg\""],
  ["signup Clerk", signup, "data-cta=\"clerk-signup\""],
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
assert(
  existsSync(join(root, "designer-land-cold-reader-lead-v1.md")),
  "designer cold-reader lead SoT committed",
);
const cpoLandNoDemo = read("cpo-land-no-demo-v1.md");
const landNoDemoSot = read("designer-land-no-demo-lock-v1.md");
const coldReaderLead = read("designer-land-cold-reader-lead-v1.md");
assert(
  coldReaderLead.includes("`Your AI agent for buying.`"),
  "cold-reader SoT locks H1",
);
assert(
  coldReaderLead.includes("`Find it. Decide. Buy anything.`") ||
    coldReaderLead.includes("`Less tab-chasing. Same hard approve.`"),
  "cold-reader SoT locks support",
);
assert(
  coldReaderLead.includes(
    "Set spend, intent, and a payment method. BotBuy executes what you approve.",
  ) ||
    coldReaderLead.includes(
      "Set spend, intent, and a payment method. BotBuy only moves when you approve.",
    ) ||
    coldReaderLead.includes(
      "Set spend, intent, and a payment method. BotBuyer only moves when you approve.",
    ),
  "cold-reader SoT keeps one-liner",
);
assert(
  coldReaderLead.includes("Do not put those three lines back under CTAs"),
  "cold-reader SoT forbids under-CTA trio",
);
assert(
  /ignore older cmo file ctas/i.test(coldReaderLead),
  "cold-reader SoT ignores old CMO file CTAs",
);
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
assert(!land.includes("BRAND.trustLine"), "land fold has no under-CTA trust line");
assert(cpoLandNoDemo.includes("`Your AI agent for buying.`"), "CPO keep locks CMO H1");
assert(
  cpoLandNoDemo.includes("`Find it. Decide. Buy anything.`") ||
    cpoLandNoDemo.includes("`Less tab-chasing. Same hard approve.`") ||
    cpoLandNoDemo.includes("Find it. Decide. Buy anything.") ||
    cpoLandNoDemo.includes("Less tab-chasing. Same hard approve."),
  "CPO keep locks CMO support",
);
assert(cpoLandNoDemo.includes("Private beta"), "CPO allows Private beta without Demo");
assert(
  cpoLandNoDemo.includes("Sign up sole primary") &&
    cpoLandNoDemo.includes("Install quiet text link"),
  "CPO land fold CTA is Sign up sole primary",
);
assert(!cpoLandNoDemo.includes("dual CTAs"), "CPO land no longer locks dual peer CTAs");
assert(
  landNoDemoSot.includes("Sign up sole primary") &&
    landNoDemoSot.includes("Install quiet text link"),
  "designer land fold CTA is Sign up sole primary",
);
assert(!landNoDemoSot.includes("dual CTAs"), "designer land no longer locks dual peer CTAs");
assert(
  existsSync(join(root, "cpo-land-install-demote-v1.md")),
  "CPO land Install demote SoT committed",
);
assert(
  existsSync(join(root, "designer-land-install-demote-v1.md")),
  "designer land Install demote SoT committed",
);
const cpoInstallDemote = read("cpo-land-install-demote-v1.md");
const designerInstallDemote = read("designer-land-install-demote-v1.md");
assert(
  cpoInstallDemote.includes("sole primary") &&
    cpoInstallDemote.includes("quiet text link only"),
  "CPO Install demote locks Sign up sole primary",
);
assert(
  designerInstallDemote.includes("sole primary pill") &&
    designerInstallDemote.includes("quiet text link only"),
  "designer Install demote locks Sign up primary pill",
);
assert(
  designerInstallDemote.includes("rounded-full") &&
    designerInstallDemote.includes("--bb-primary"),
  "designer Install demote names teal pill chrome",
);
assert(
  cpoInstallDemote.includes("designer-land-install-demote-v1.md"),
  "CPO Install demote points at designer craft",
);
assert(
  designerInstallDemote.includes("cpo-land-install-demote-v1.md"),
  "designer Install demote points at CPO IA",
);
assert(!cpoInstallDemote.includes("dual CTAs"), "CPO Install demote has no dual peer CTAs");
assert(!designerInstallDemote.includes("dual CTAs"), "designer Install demote has no dual peer CTAs");
assert(
  cpoLandNoDemo.includes("cpo-land-install-demote-v1.md") &&
    landNoDemoSot.includes("designer-land-install-demote-v1.md"),
  "no-Demo locks point at Install demote SoT",
);
assert(!brand.includes("$1,000 gate"), "land trust line has no $1,000 gate");
assert(!brand.includes("gate for now"), "land brand has no gate for now");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(land), "land has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(signup), "signup has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(chrome), "public chrome has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(layout), "layout meta has no $1,000 gate");
assert(!/\$1,000|\$1000|1,000 gate|1000 gate/.test(manifest), "manifest marketing has no $1,000 gate");
assert(brand.includes('pocBanner: "POC · Demo · not live"'), "POC pill lock stays for in-app/offline");
assert(!land.includes("BRAND.trustLine"), "land renders no trust line under CTAs");
assert(!land.includes("BRAND.pocBanner"), "land fold has no POC banner stack");
assert(!signup.includes("BRAND.pocBanner"), "signup has no POC Demo pill");
assert(!signup.includes("POC · Demo · not live"), "signup scrubbed Demo pill copy");
assert(signup.includes("SIGNUP_H1") && brand.includes('SIGNUP_H1 = "Create your BotBuyer account"'), "signup H1 lock");
assert(signup.includes("SIGNUP_SUB"), "signup sub is spend/intent/payment");
assert(signup.includes("SIGNUP_CTA") || signup.includes("Create account"), "signup CTA Create account");
assert(signup.includes("SIGNUP_FOOT") && brand.includes("No charge to create an account."), "signup no-charge foot");
assert(
  existsSync(join(root, "cpo-real-auth-signup-ia-v1.md")),
  "CPO real-auth signup IA committed",
);
assert(
  existsSync(join(root, "designer-real-auth-signup-craft-v1.md")),
  "Designer real-auth signup craft committed",
);
assert(
  authSignupIa.includes("`Create your BotBuyer account`") &&
    authSignupIa.includes("No charge to create an account.") &&
    authSignupIa.includes("`/signin`"),
  "CPO real-auth signup IA names locked door",
);
assert(
  authSignupIa.includes("designer-real-auth-signup-craft-v1.md"),
  "CPO real-auth IA points at Designer craft",
);
assert(
  authSignupCraft.includes("cpo-real-auth-signup-ia-v1.md"),
  "Designer signup craft points at CPO IA",
);
assert(
  authSignupCraft.includes("POC · Demo · not live") &&
    authSignupCraft.includes("in-memory session"),
  "Designer craft kills POC pill + persist copy",
);
assert(authDoor.includes('data-surface="auth-door"'), "auth door surface marker");
assert(authDoor.includes("text-3xl"), "auth door Quiet Capital H1 not land display");
assert(signup.includes("AuthDoor"), "signup uses Techlux auth door");
assert(signIn.includes("AuthDoor"), "sign-in uses Techlux auth door");
assert(!signup.includes("className=\"display\""), "signup H1 is not land display");
assert(!signup.includes("DEMO_PILL_CLASS"), "signup has no Demo pill token");
assert(!signIn.includes("DEMO_PILL_CLASS"), "sign-in has no Demo pill token");
assert(chrome.includes("footerHold") || chrome.includes("BRAND.footerHold"), "POC stays footer meta");
assert(signup.includes("Sign up"), "signup eyebrow");
assert(signup.includes("<SignUp"), "signup uses Clerk SignUp");
assert(signIn.includes("<SignIn"), "sign-in uses Clerk SignIn");
assert(signIn.includes("SIGN_IN_H1"), "sign-in H1 is Sign in");
assert(signup.includes("Sign in"), "signup offers Sign in");
assert(!signup.includes("in-memory session"), "signup scrubbed in-memory copy");
assert(!signup.includes("not a live account"), "signup scrubbed POC persist copy");
assert(!signup.includes("persistSignupAction"), "signup is not in-memory persist");
assert(middleware.includes("clerkMiddleware"), "middleware uses Clerk");
assert(middleware.includes("isClerkConfigured"), "middleware skips Clerk when keys missing");
assert(middleware.includes("/home"), "middleware protects /home");
assert(schema.includes("clerkUserId"), "users.clerkUserId column");
assert(schema.includes('autoApprove: boolean("auto_approve").notNull().default(false)'), "autoApprove default false");
assert(authLib.includes("resolveOrCreateAppUser"), "Clerk session resolves Neon user");
assert(!authLib.includes("return DEMO_USER"), "getCurrentUser is not DEMO_USER");
assert(sessionLib.includes("getClerkUserId"), "session is Clerk, not bb_signup");
assert(sessionLib.includes("bb_signup` is not auth") || sessionLib.includes("Not identity") || sessionLib.includes("is not auth"), "bb_signup is not identity");

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
assert(chrome.includes("CLERK_SIGN_IN_URL") || chrome.includes("/signin"), "public chrome offers Sign in");
assert(shell.includes("SignOutControl"), "app chrome Sign out");

assert(empty.includes("INTENT_CTA") || empty.includes("Start search"), "Searching empty uses Start search lock");
assert(empty.includes('SEARCHING_EMPTY_SECONDARY = "Edit intent"'), "Searching Edit intent");
assert(empty.includes('NEEDS_YOU_CTA = "Review gates"'), "Needs-you Review gates");
assert(empty.includes('AGENTS_EMPTY_SECONDARY = "See how activation works"'), "Agents empty secondary");
assert(empty.includes('"/deals?status=Closed"'), "Agents empty → Closed deals");
assert(home.includes("DealsTable"), "My deals dense table");
assert(home.includes("MY_DEALS_LABEL") || home.includes("My deals"), "My deals is /home");
assert(
  approveUi.includes("APPROVE_MICRO") ||
    home.includes("APPROVE_MICRO") ||
    home.includes("BotBuyer only moves when you approve."),
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
assert(chrome.includes('href="/about"'), "land desktop nav includes About");
assert(!chrome.includes("bb-land-air"), "land chrome dropped light Techlux air band");
assert(chrome.includes("bb-land-header"), "land header overlays the navy stage");
assert(chrome.includes("bb-land-nav") && chrome.includes("bb-land-link"), "land overlay is word links");
assert(chrome.includes("onDark={land}"), "land chrome uses reverse lockup on navy");
assert(chrome.includes("bb-land-footer"), "land footer stays on navy, not a light strip");
assert(!chrome.includes("<Button"), "land overlay nav has no Button pills");
assert(!chrome.includes("rounded-full"), "land overlay nav has no pill radius");
assert(!chrome.includes("BRAND.pocBanner"), "POC pill is not land chrome");
assert(goLive.includes("APPROVE_MICRO") || goLive.includes("BotBuyer only moves when you approve."), "go-live approve micro");
assert(existsSync(join(root, "public/brand/techlux/land-bg-techlux-air.png")), "techlux-air committed");
assert(existsSync(join(root, "public/brand/logo-eclipse-pass/botbuyer-logo-header.svg")), "eclipse-pass header lockup committed");
assert(existsSync(join(root, "brand/logo-eclipse-pass/INSTALL.md")), "eclipse-pass INSTALL committed");
assert(existsSync(join(root, "brand/logo-eclipse-pass/botbuyer-mark.svg")), "eclipse-pass mark kit committed");
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
  "BotBuyer finds it and handles the chase. You approve before it pays.";
assert(brand.includes(LAND_META), "land/meta one-liner lock");
assert(brand.includes("signupLine: LAND_META_LINE"), "signup uses locked one-liner");
assert(brand.includes('LAND_PRODUCT_H1 = "Your AI agent for buying."'), "land H1 lock");
assert(
  brand.includes('LAND_PRODUCT_SUPPORT = "Acts for you. Spends only with your OK."'),
  "land support lock",
);
assert(brand.includes("hero: LAND_PRODUCT_H1"), "land hero is locked H1");
assert(brand.includes("support: LAND_PRODUCT_SUPPORT"), "land support constant is wired");
assert(brand.includes("lead: LAND_META_LINE"), "land lead is locked one-liner");
assert(!brand.includes("Buy software. You approve."), "software-only land tag removed from brand");
assert(!brand.includes("productTag"), "land has no product-tag slot");
assert(brand.includes('name: "BotBuyer"'), "product name lock");
assert(brand.includes('primaryCta: "Sign up"'), "land primary door is Sign up");
assert(brand.includes('installLink: "Install"'), "land Install is a quiet link label");
assert(!brand.includes("secondaryCta"), "land has no peer secondary CTA");
assert(!brand.includes("Start your first buy"), "land dropped Start your first buy");
assert(!brand.includes("See how it works"), "land dropped equal-weight See how it works");
assert(!brand.includes("Vault it."), "brand has no Vault it");
assert(!/\band vault\b/.test(brand), "brand has no and vault");
assert(!land.includes("Vault it"), "land page source has no Vault it");
assert(!/\band vault\b/.test(land), "land page source has no and vault");
assert(!signup.includes("and vault") && !signup.includes("Vault it"), "signup has no vault-as-balance line");
assert(layout.includes("LAND_META_LINE"), "layout meta uses locked one-liner");
assert(layout.includes("apple-mobile-web-app-title"), "apple-mobile-web-app-title set");
assert(layout.includes("applicationName: BRAND.name"), "applicationName uses BRAND.name");
assert(manifest.includes("LAND_META_LINE"), "manifest uses locked one-liner");
assert(manifest.includes('name: "BotBuyer"'), "manifest name BotBuyer");
assert(manifest.includes('short_name: "BotBuyer"'), "manifest short_name BotBuyer");
assert(!layout.includes("BotBuy does the rest."), "layout dropped old vault one-liner");
assert(!manifest.includes("Vault it."), "manifest dropped Vault it");
assert(brand.includes('title: "Tell it what to find"'), "how-it-works step 1 title lock");
assert(brand.includes('graphic: "/land/assets/01-tell.svg"'), "how-it-works step 1 graphic");
assert(brand.includes('title: "BotBuyer brings deals"'), "how-it-works step 2 title lock");
assert(brand.includes('graphic: "/land/assets/02-deals.svg"'), "how-it-works step 2 graphic");
assert(brand.includes('title: "You approve. Then it buys."'), "how-it-works step 3 title lock");
assert(brand.includes('graphic: "/land/assets/03-approve.svg"'), "how-it-works step 3 graphic");
assert(
  brand.includes(
    "BotBuyer finds it and handles the chase. You approve before it pays.",
  ),
  "land/meta one-liner lock",
);
assert(
  !brand.includes("Less tab-chasing. Same hard approve."),
  "old land support retired",
);
assert(
  !brand.includes(
    "Set spend, intent, and a payment method. BotBuyer only moves when you approve.",
  ),
  "old land one-liner retired",
);
assert(!brand.includes("Set spend, intent, and vault"), "old vault land line removed");
assert(!brand.includes("Vault it"), "Vault it removed from land brand copy");
assert(!land.includes("Vault it"), "land has no Vault it");
assert(!land.includes("VaultCardsBackdrop"), "land does not use vault-cards fold");
assert(!land.includes("HowItWorksRail"), "land fold dropped elevate how-stack");
assert(land.includes('data-surface="land-stage"'), "land uses full-bleed navy stage");
assert(land.includes("bb-land-stage"), "land stage class is wired");
assert(land.includes("bb-land-h1") && land.includes("bb-land-support") && land.includes("bb-land-meta"), "land fold uses CSS type-scale classes");
assert(chrome.includes("bb-land-main w-full"), "land main is unguttered full width");
assert(!chrome.includes("bb-land-main mx-auto w-full max-w-6xl"), "land main is not a max-w-6xl inset frame");
assert(!land.includes("filter"), "land does not CSS-filter the arc");
assert(!land.includes("invert"), "land does not CSS-invert the light arc");
assert(!land.includes("BRAND.landHonesty"), "land fold has no under-CTA Private beta chip");
assert(!land.includes("bg-primary"), "land fold has no orphan teal hairline");
assert(!land.includes("ProofStrip"), "land dropped No public proof essay card");
assert(land.includes("LAND_PRODUCT_H1"), "land H1 uses locked product line");
assert(land.includes("LAND_PRODUCT_SUPPORT"), "land support sits under H1");
assert(!land.includes("LAND_PRODUCT_TAG"), "land has no software-only product tag");
assert(!land.includes("Buy software. You approve."), "land dropped software-only hero/tag");
assert(land.includes("LAND_META_LINE"), "land lead one-liner");
assert(land.includes("LandInstallButton"), "land Install door is wired");
assert(
  land.includes("redirectSignedInFromLand") ||
    land.includes("redirect(MY_DEALS_HREF)"),
  "signed-in redirects off land",
);
assert(
  existsSync(join(root, "lib/land-gate.ts")) &&
    read("lib/land-gate.ts").includes("redirect(MY_DEALS_HREF)"),
  "land-gate helper redirects signed-in visitors to My deals",
);
assert(land.includes('dynamic = "force-dynamic"'), "land session redirect is request-time");
assert(land.includes('themeColor: "#0B1F3A"'), "land status/theme color is navy");
assert(!land.includes("land-my-deals"), "My deals is never land primary");
assert(!land.includes("BRAND.myDealsCta"), "land fold has no My deals CTA");
assert(land.includes('data-cta="land-signup"'), "signed-out land primary is Sign up");
assert(
  (land.match(/<Button/g) || []).length === 1,
  "land fold Button is Sign up only",
);
assert(!land.includes("variant="), "land fold Buttons have no secondary/ghost variant");
assert(!landInstall.includes("<Button"), "land Install is not a Button");
assert(!landInstall.includes('variant="secondary"'), "land Install is not a secondary button");
assert(!landInstall.includes('size="lg"'), "land Install is not a large peer button");
assert(landInstall.includes('data-cta="land-install"'), "land Install still wired");
assert(landInstall.includes("text-muted"), "land Install is a quiet text link");
assert(landInstall.includes("publicLand"), "land Install how-to is publicLand");
assert(a2hsHowTo.includes("publicLand"), "A2HS land path can hide Demo badge");
assert(a2hsHowTo.includes("LAND_A2HS_COPY"), "land A2HS copy omits Demo");
assert(
  read("lib/cpo-techlux.ts").includes(
    "Add BotBuyer to your Home Screen. Not an App Store or Play listing.",
  ),
  "land A2HS honesty has no Demo prefix",
);
assert(!land.includes("Start your first buy"), "land fold has no Start your first buy");
assert(!land.includes("See how it works"), "how-it-works is not a fold CTA");
assert(!land.includes('href="#how"'), "how-it-works is secondary scroll only");
assert(!land.includes("LAND_INSTALL_HELPER"), "land fold has no A2HS helper under CTAs");
assert(
  !land.includes("Add to Home Screen for the full app on your phone."),
  "land fold has no A2HS helper copy",
);
assert(!land.includes("/brand/botbuy-mark.svg"), "land page source has no inline mark path");
assert(!land.includes("botbuy-logo"), "land page source has no inline Vault lockup");
assert(brand.includes('name: "BotBuyer"'), "land brand name is BotBuyer");
assert(chrome.includes("LAND_WORDMARK"), "land chrome keeps BotBuyer wordmark label");
assert(chrome.includes("BrandLockup"), "land chrome uses eclipse-pass BrandLockup");
assert(
  existsSync(join(root, "land/assets/01-tell.svg")) &&
    existsSync(join(root, "land/assets/02-deals.svg")) &&
    existsSync(join(root, "land/assets/03-approve.svg")) &&
    existsSync(join(root, "land/assets/06-arc.svg")) &&
    existsSync(join(root, "land/assets/06-arc-reverse.svg")),
  "land kit SVGs committed under land/assets",
);
assert(
  existsSync(join(root, "land/full-bleed-hero/INSTALL.md")) &&
    existsSync(join(root, "land/full-bleed-hero/assets/06-arc-reverse.svg")) &&
    existsSync(join(root, "public/land/assets/06-arc-reverse.svg")),
  "full-bleed-hero kit and public reverse arc committed",
);
assert(
  brand.includes('LAND_ARC_SRC = "/land/assets/06-arc-reverse.svg"'),
  "land B wires the dedicated reverse arc",
);
assert(
  read("public/land/assets/06-arc-reverse.svg").includes('viewBox="0 0 280 72"') &&
    read("public/land/assets/06-arc-reverse.svg").includes('font-size="12"') &&
    !land.includes("invert"),
  "land uses exact reverse arc body with no CSS invert",
);
assert(
  !read("land/full-bleed-hero/assets/06-arc-reverse.svg").includes("#2DD4BF") &&
    !read("public/land/assets/06-arc-reverse.svg").includes("#2DD4BF") &&
    !read("land/assets/06-arc-reverse.svg").includes("#2DD4BF"),
  "reverse arc has no orphan teal jewelry",
);
assert(css.includes("#0b1f3a") && css.includes("#163556") && css.includes("#0a182c"), "navy stage gradient tokens");
assert(css.includes(".bb-land-main") && css.includes("padding: 0"), "land main kills stage gutters");
assert(css.includes(".bb-land-header") && css.includes("background: transparent"), "land header is overlay, not a light strip");
assert(css.includes(".bb-land-link") && css.includes("border-radius: 0"), "overlay nav is word links, not pills");
assert(css.includes(".bb-land-footer") && css.includes("var(--bb-land-navy-deep)"), "land footer is deep navy, not Techlux light");
assert(!css.includes("--bb-land-chrome"), "stage no longer subtracts a header chrome band");
assert(
  css.includes("min-height: 100dvh") && css.includes("min-height: 100svh"),
  "navy stage fills the viewport",
);
assert(css.includes("border-radius: 0"), "stage is square full-bleed");
assert(!css.includes("border-radius: 20px") && !css.includes("border-radius: 28px"), "no inset-card stage radius");
assert(css.includes(".bb-land-h1") && css.includes(".bb-land-support") && css.includes(".bb-land-meta"), "land type scale is CSS-owned");
assert(read("app/how/page.tsx").includes('redirect("/about")'), "how route leaves land fold");
assert(
  read("land/assets/02-deals.svg").includes('aria-label="BotBuyer brings deals"'),
  "02-deals aria-label is BotBuyer",
);
assert(how.includes("step.graphic"), "how rail renders graphic panels");
assert(!how.includes("step.body"), "how rail dropped prose bodies");
assert(
  !/\bDemo\b/.test([land, chrome, proof, proofLib, how, landInstall].join("\n")),
  "no Demo in / rendered land copy",
);
assert(css.includes("land-bg-techlux-air"), "techlux-air asset token stays");
assert(css.includes(".bb-land-veil") && css.includes("var(--bb-veil)"), "land veil token");
assert(!land.includes("LAND_FINDABILITY"), "land fold has no My deals findability under CTAs");
assert(
  !land.includes("After you sign in, your deals live in"),
  "land fold has no findability copy",
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
assert(button.includes("rounded-full"), "primary chrome is a pill");
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
assert(wire.includes("never letter-B"), "wire notes keep eclipse-pass — no letter-B");
assert(lockup.includes("/brand/logo-eclipse-pass/botbuyer-logo-header.svg"), "BrandLockup uses eclipse-pass header SVG");
assert(lockup.includes("/brand/logo-eclipse-pass/botbuyer-logo-primary-dark-bg.svg"), "BrandLockup reverse lockup for navy land");
assert(lockup.includes("onDark"), "BrandLockup can render reverse on dark");
assert(lockup.includes("189") && lockup.includes("72"), "land reverse lockup intrinsic ~189×72");
assert(
  css.includes(".bb-land-lockup") &&
    css.includes("height: 2.75rem") &&
    css.includes("height: 3rem"),
  "land overlay lockup reads ~44–48px on navy",
);
assert(lockup.includes('alt="BotBuyer"'), "BrandLockup accessible alt");
assert(shell.includes("BrandLockup"), "app shell eclipse-pass header lockup");
assert(chrome.includes("BrandLockup"), "public chrome eclipse-pass header lockup");
assert(!/>\s*B\s*</.test(shell), "app shell no letter-B tile");
assert(!/>\s*B\s*</.test(chrome), "public chrome no letter-B tile");
assert(layout.includes("/favicon.ico"), "layout links favicon.ico");
assert(layout.includes("/favicon.svg"), "layout links favicon.svg");
assert(layout.includes("/icons/apple-touch-icon.png"), "layout apple-touch-icon");
assert(layout.includes("appleWebApp") && layout.includes("capable: true"), "layout appleWebApp capable");
assert(layout.includes("statusBarStyle: \"default\""), "layout Apple status bar for light shell");
assert(layout.includes("apple-mobile-web-app-capable"), "layout Apple capable meta");
assert(layout.includes("/brand/og-1200x630.png"), "layout Open Graph image");
assert(layout.includes("https://botbuyer.ai/brand/og-1200x630.png"), "twitter image eclipse-pass OG");
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
assert(sw.includes('CACHE = "botbuy-v5"'), "SW cache bumped to botbuy-v5");
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
    dealsPhone.includes('"Found"') &&
    dealsPhone.includes('"Closed"'),
  "phone My deals filters All / Needs you / Searching / Found / Closed",
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
    "BotBuyer is early access. Features labeled Demo or Coming are not live commitments.",
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
assert(betaPage.includes('loadLegalBlocks("beta"'), "beta renders site-pages SoT");
assert(contactPage.includes('loadLegalBlocks("contact"'), "contact renders site-pages SoT");
assert(betaPage.includes("SITE_BETA_CTA.run"), "beta Run BotBuyer CTA");
assert(privacySoT.includes("Build Star Labs (Florida)"), "privacy publish entity");
assert(privacySoT.includes("September 11, 2026"), "privacy publish effective date");
assert(termsSoT.includes("State of Florida"), "terms publish Florida governing law");
assert(termsSoT.includes("omitted until attorney supplies text"), "terms dispute omitted in SoT");
assert(aboutSoT.includes("Operator:** Build Star Labs (Florida)"), "about operator");

const aboutStory = read("components/about-story.tsx");
const aboutLib = read("lib/about-story.ts");
const aboutInstall = read("about/INSTALL.md");
const aboutSot = read("about/designer-about-story-v1.md");
assert(aboutPage.includes("AboutStory"), "about renders graphical story");
assert(!aboutPage.includes("loadLegalBlocks"), "about no longer dumps site-pages prose");
assert(!aboutPage.includes("MarkdownProse"), "about has no markdown dump");
assert(!aboutPage.includes("SitePageShell"), "about is not the legal/site shell");
assert(aboutPage.includes("ABOUT_PRODUCT"), "about title uses BotBuyer");
assert(aboutPage.includes("openGraph"), "about OG uses page description");
assert(aboutPage.includes("/brand/og-1200x630.png"), "about OG image is eclipse-pass");
assert(aboutLib.includes('ABOUT_PRODUCT = "BotBuyer"'), "about product lock is BotBuyer");
assert(aboutLib.includes("LAND_PRODUCT_H1"), "about H1 imports Land E");
assert(aboutLib.includes("LAND_PRODUCT_SUPPORT"), "about support imports Land E");
assert(aboutLib.includes("ABOUT_META_LINE = LAND_META_LINE"), "about one-liner is Land E");
assert(aboutLib.includes('caption: "Tell it what to find"'), "about step 1 caption lock");
assert(aboutLib.includes('caption: "BotBuyer brings deals"'), "about step 2 caption lock");
assert(aboutLib.includes('caption: "You approve. Then it buys."'), "about step 3 caption lock");
assert(
  aboutLib.includes('ABOUT_CONTROL = "Every deal needs your approval."'),
  "about control caption lock",
);
assert(
  aboutLib.includes('ABOUT_ENTITY = `${SITE_OPERATOR} · Private beta`'),
  "about entity lock",
);
assert(aboutLib.includes('ABOUT_MARK_SRC = "/brand/logo-eclipse-pass/botbuyer-mark.svg"'), "about hero is eclipse-pass");
assert(aboutStory.includes("ABOUT_MARK_SRC"), "about story renders journey mark");
assert(aboutStory.includes("ABOUT_STEPS"), "about story renders 3 panels");
assert(aboutStory.includes("ABOUT_CONTROL"), "about story renders control caption");
assert(aboutStory.includes('href={ABOUT_SIGNUP_HREF}'), "about CTA is /signup");
assert(aboutStory.includes('data-cta="about-signup"'), "about Sign up marked");
assert((aboutStory.match(/<Button/g) || []).length === 1, "about Sign up is sole primary");
assert(!aboutStory.includes("variant="), "about CTA has no secondary/ghost variant");
assert(!aboutStory.includes("Demo"), "about story has no Demo");
assert(!aboutStory.includes("$1k") && !aboutStory.includes("$1,000"), "about story has no $1k");
assert(!aboutStory.includes("What we don’t do") && !aboutStory.includes("What we don't do"), "about has no don’t-do essay");
assert(!aboutLib.includes("metrics"), "about lib invents no metrics");
assert(existsSync(join(root, "about/assets/mark-o1-b-journey.svg")), "about mark kit committed");
assert(existsSync(join(root, "about/assets/01-hook.svg")), "about 01-hook committed");
assert(existsSync(join(root, "about/assets/02-find.svg")), "about 02-find committed");
assert(existsSync(join(root, "about/assets/03-decide.svg")), "about 03-decide committed");
assert(existsSync(join(root, "about/assets/04-buy.svg")), "about 04-buy committed");
assert(existsSync(join(root, "about/assets/05-control.svg")), "about 05-control committed");
assert(existsSync(join(root, "about/assets/06-arc.svg")), "about 06-arc committed");
assert(existsSync(join(root, "public/about/assets/mark-o1-b-journey.svg")), "about mark is served");
assert(existsSync(join(root, "brand/about-story/mark-o1-b-journey.svg")), "about-story brand alias committed");
assert(existsSync(join(root, "brand/logo-o1-b-journey/botbuy-mark.svg")), "logo-o1-b-journey alias committed");
assert(read("about/assets/mark-o1-b-journey.svg").includes("#0B1F3A"), "about mark is navy");
assert(read("brand/logo-o1-b-journey/botbuy-mark.svg").includes("#0B1F3A"), "o1 alias is navy");
assert(
  read("about/assets/mark-o1-b-journey.svg").includes('aria-label="BotBuyer mark"') &&
    read("about/assets/mark-o1-b-journey.svg").includes("<title>BotBuyer mark — O1 B-journey</title>"),
  "about mark title is BotBuyer",
);
assert(
  read("public/about/assets/mark-o1-b-journey.svg").includes('aria-label="BotBuyer mark"'),
  "served about mark title is BotBuyer",
);
assert(
  read("brand/about-story/mark-o1-b-journey.svg").includes('aria-label="BotBuyer mark"'),
  "about-story alias title is BotBuyer",
);
assert(
  read("brand/logo-o1-b-journey/botbuy-mark.svg").includes('aria-label="BotBuyer mark"'),
  "o1 alias title is BotBuyer",
);
assert(
  !read("about/assets/mark-o1-b-journey.svg").includes("BotBuy mark") &&
    !read("public/about/assets/mark-o1-b-journey.svg").includes("BotBuy mark") &&
    !read("brand/about-story/mark-o1-b-journey.svg").includes("BotBuy mark") &&
    !read("brand/logo-o1-b-journey/botbuy-mark.svg").includes("BotBuy mark"),
  "O1 copies have no bare BotBuy mark title",
);
assert(aboutInstall.includes("NOT O1") && aboutInstall.includes("NOT Vault"), "about INSTALL holds eclipse-pass sitewide");
assert(aboutInstall.includes("#0B1F3A"), "about INSTALL names navy mark");
assert(aboutInstall.includes("BotBuyer brings deals"), "about INSTALL step 2 is BotBuyer");
assert(aboutSot.includes("BotBuyer brings deals"), "about SoT step 2 is BotBuyer");
assert(aboutSot.includes("eclipse-pass is sitewide chrome"), "about SoT holds eclipse-pass chrome");
assert(lockup.includes("/brand/logo-eclipse-pass/botbuyer-logo-header.svg"), "eclipse-pass lockup stays after about story");
assert(layout.includes("/favicon.ico") && layout.includes("/brand/og-1200x630.png"), "favicon/OG stay wired");
assert(!chrome.includes("mark-o1-b-journey"), "public chrome does not install O1 mark");
assert(!lockup.includes("mark-o1-b-journey"), "BrandLockup is not O1");
assert(!manifest.includes("mark-o1-b-journey"), "PWA icons are not O1");
assert(!lockup.includes("logo-o1-b-journey"), "BrandLockup does not use O1 alias");
assert(!lockup.includes("logo-vault"), "BrandLockup does not use Vault kit");
assert(
  read("brand/logo-eclipse-pass/botbuyer-mark.svg").includes('cx="26"') &&
    read("brand/logo-eclipse-pass/botbuyer-mark.svg").includes("#2DD4BF") &&
    read("brand/logo-eclipse-pass/botbuyer-mark.svg").includes("#0B1F3A") &&
    read("brand/logo-eclipse-pass/botbuyer-mark.svg").includes("eclipse-pass"),
  "eclipse-pass mark geometry + colors locked",
);
assert(
  !read("brand/logo-eclipse-pass/botbuyer-mark.svg").includes("<rect") &&
    !read("public/brand/logo-eclipse-pass/botbuyer-mark.svg").includes("O1 B-journey"),
  "eclipse-pass mark is not Vault rect or O1",
);
assert(existsSync(join(root, "public/icons/icon-192.png")), "PWA icon-192 committed");
assert(existsSync(join(root, "public/icons/icon-512.png")), "PWA icon-512 committed");
assert(existsSync(join(root, "public/brand/og-1200x630.png")), "OG raster committed");
assert(existsSync(join(root, "public/favicon.svg")), "favicon.svg committed");
const BETA_OPERATOR =
  "**Operator:** Build Star Labs (Florida). BotBuyer is offered on botbuyer.ai.";
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
assert(betaSoT.includes("Use **Run BotBuyer** on the home page") || betaSoT.includes("Use Run BotBuyer on the home page"), "beta how-to copy");
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
assert(!siteFooter.includes("Run BotBuyer"), "footer does not compete with Run BotBuyer");

const johnUx = read("lib/john-ux.ts");
const johnIntentPage = read("app/onboarding/intent/page.tsx");
const johnIntentForm = read("components/intent-form.tsx");
const johnTemplates = read("lib/intent-templates.ts");
const johnTemplatesSot = read("cpo-john-intent-templates.md");
const johnUxSot = read("cpo-john-ux-intent-agents-profile-v1.md");
const moatSot = read("cpo-moat-approve-gate-v1.md");
const johnHome = home;
const johnSettings = settingsPage;
const johnProfilePage = read("app/(app)/settings/profile/page.tsx");
const johnProfileForm = read("components/profile-form.tsx");
const johnProfileApi = read("app/api/profile/route.ts");
const johnIntentsApi = read("app/api/intents/route.ts");
const johnOnboardLayout = read("app/onboarding/layout.tsx");
const johnAgents = agents;
const johnUsersSchema = schema;

assert(existsSync(join(root, "cpo-john-ux-intent-agents-profile-v1.md")), "CPO John UX SoT committed");
assert(existsSync(join(root, "cpo-moat-approve-gate-v1.md")), "CPO moat approve-gate SoT committed");
assert(existsSync(join(root, "cpo-john-intent-templates.md")), "CPO John intent templates SoT committed");
assert(johnUxSot.includes("`What should BotBuyer find?`"), "John UX SoT locks intent H1");
assert(johnUxSot.includes("`Start search`"), "John UX SoT locks Start search");
assert(johnUxSot.includes("`Nothing searching yet`"), "John UX SoT locks empty title");
assert(johnUxSot.includes("Add your email so we can reach you when a deal needs approval."), "John UX SoT locks email soft gate");
assert(moatSot.includes("Auto-approve OFF"), "moat SoT keeps auto-approve OFF");
assert(moatSot.includes("Busywork out"), "moat SoT drops busywork");
assert(moatSot.includes("approve-each-spend KEEP") || moatSot.includes("Approve-each-spend KEEP"), "moat SoT keeps approve gate");
assert(johnUx.includes('INTENT_H1 = "What should BotBuyer find?"'), "intent H1 lock");
assert(johnUx.includes('INTENT_SUB = "Pick a starter or describe it yourself."'), "intent sub lock");
assert(johnUx.includes('INTENT_CTA = "Start search"'), "intent CTA lock");
assert(johnUx.includes('INTENT_TEXTAREA_LABEL = "Describe what you want"'), "describe label lock");
assert(johnUx.includes('INTENT_HELPERS_LABEL = "Optional details"'), "optional details lock");
assert(johnUx.includes("Max price") && johnUx.includes("Must include") && johnUx.includes("Avoid"), "helper labels lock");
assert(johnUx.includes('MY_DEALS_EMPTY_TITLE = "Nothing searching yet"'), "My deals empty title");
assert(johnUx.includes("BotBuyer is searching. Deals show up here."), "My deals progress lock");
assert(johnUx.includes("Add your email so we can reach you when a deal needs approval."), "email soft gate lock");
assert(johnUx.includes('PROFILE_TITLE = "Your details"'), "Your details title lock");
assert(johnIntentPage.includes("INTENT_H1") && johnIntentPage.includes("INTENT_SUB"), "onboarding intent uses locked H1/sub");
assert(!johnIntentPage.includes("Continue to spend"), "onboarding intent dropped Continue to spend");
assert(!johnOnboardLayout.includes("/onboarding/spend"), "onboarding layout dropped busywork stepper");
assert(johnIntentForm.includes("data-surface=\"intent-capture\""), "intent capture surface");
assert(johnIntentForm.includes("JOHN_INTENT_TEMPLATES"), "intent form loads templates");
assert(johnIntentForm.includes("INTENT_CTA"), "intent form Start search");
assert(johnIntentForm.includes("Textarea"), "intent form textarea always available");
assert(johnIntentForm.includes("startSearch: true"), "Start search creates Searching deal");
assert(johnIntentsApi.includes("startSearch") && johnIntentsApi.includes("createSearchingDealFromIntent"), "intents API starts search");
assert(store.includes("createSearchingDealFromIntent"), "store opens Searching from intent");
assert(store.includes('autoApprove: false'), "store autoApprove stays false");
assert(johnTemplates.includes('id: "software"') && johnTemplates.includes('id: "domain"'), "templates software-first + domain wedge");
assert(
  (johnTemplates.match(/id: "/g) || []).length >= 4 &&
    (johnTemplates.match(/id: "/g) || []).length <= 6,
  "4–6 honest starter templates",
);
assert(johnTemplatesSot.includes("Software-first"), "templates SoT software-first");
assert(johnHome.includes("MY_DEALS_EMPTY_TITLE") || johnHome.includes("Nothing searching yet"), "My deals empty title wired");
assert(johnHome.includes("IntentForm"), "My deals empty has chips + describe");
assert(johnHome.includes("MY_DEALS_PROGRESS"), "My deals progress line");
assert(johnHome.includes("APPROVE_MICRO") || johnHome.includes("BotBuyer only moves when you approve."), "My deals approve micro");
assert(johnHome.includes("AUTO_APPROVE_OFF"), "My deals auto-approve OFF");
assert(johnAgents.includes("AGENTS_INBOX_NOTE"), "agents inbox honesty");
assert(johnUx.includes("no live agent chat"), "agents no fake chatter");
assert(johnSettings.includes("PROFILE_TITLE") && johnSettings.includes("ProfileForm"), "Settings Your details");
assert(johnProfilePage.includes("PROFILE_TITLE") && johnProfilePage.includes("ProfileForm"), "/settings/profile Your details");
assert(johnProfileForm.includes("PROFILE_CLERK_EMAIL_LABEL") && johnProfileForm.includes("readOnly"), "Clerk email read-only");
assert(johnProfileForm.includes("PROFILE_NAME_LABEL") && johnProfileForm.includes("PROFILE_NOTIFY_LABEL"), "editable name + notification email");
assert(johnProfileForm.includes("PROFILE_PHONE_LABEL") && johnProfileForm.includes("PROFILE_COMPANY_LABEL"), "optional phone + company");
assert(johnProfileApi.includes("updateAppUserProfile"), "profile API persists details");
assert(middleware.includes("/api/profile"), "middleware protects profile API");
assert(johnUsersSchema.includes("notificationEmail") && johnUsersSchema.includes("phone"), "users profile columns");
assert(schema.includes('autoApprove: boolean("auto_approve").notNull().default(false)'), "autoApprove default false after John UX");
assert(!johnIntentForm.includes("$1,000") && !johnIntentForm.includes("$1000"), "intent form has no $1k gate");
assert(!johnIntentPage.includes("$1,000") && !johnIntentPage.includes("Hard gate"), "onboarding intent has no $1k gate");
assert(!goLive.includes("password"), "go-live has no password vault");
assert(existsSync(join(root, "drizzle/0002_john_ux_profile.sql")), "profile SQL migration committed");
assert(existsSync(join(root, "drizzle/0003_connected_accounts.sql")), "connector SQL after John UX 0002");

const connectIa = read("cpo-connect-accounts-ia-v1.md");
const connectLegal = read("legal/cto-mcp-shortlist-legal-review-v1.md");
const connectDocs = read("docs/mcp-connectors-poc.md");
const connectCopy = read("lib/connectors/copy.ts");
const connectPage = read("app/(app)/settings/connected-accounts/page.tsx");
const settingsPageSrc = read("app/(app)/settings/page.tsx");
const connectUi = read("components/connected-accounts.tsx");
const approveGate = read("lib/connectors/approve-gate.ts");
const connectorVault = read("lib/connectors/vault.ts");
const schemaSrc = read("lib/db/schema.ts");
const envExample = read(".env.example");
const namecheapRegister = read("lib/connectors/namecheap/register.ts");
const twilioBuy = read("lib/connectors/twilio/buy.ts");
const connectMiddleware = read("middleware.ts");
assert(existsSync(join(root, "cpo-connect-accounts-ia-v1.md")), "CPO connected-accounts IA");
assert(
  existsSync(join(root, "designer-connect-accounts-craft/designer-connect-accounts-craft-v1.md")),
  "Designer connected-accounts craft",
);
assert(existsSync(join(root, "legal/cto-mcp-shortlist-legal-review-v1.md")), "Legal MCP shortlist");
assert(existsSync(join(root, "docs/mcp-connectors-poc.md")), "MCP connectors POC docs");
const connectCraft = read("designer-connect-accounts-craft/designer-connect-accounts-craft-v1.md");
assert(connectCraft.includes("X.X.X.X"), "designer craft locks X.X.X.X");
assert(connectCraft.includes("CTO provides egress IPs"), "designer craft locks CTO IP note");
assert(connectCraft.includes("Continue with Twilio"), "designer craft OAuth primary");
assert(connectCraft.includes("Do not highlight Agents"), "designer craft Settings is not Agents");
assert(connectCopy.includes('CONNECT_ACCOUNTS_H1 = "Connected accounts"'), "H1 Connected accounts");
assert(
  connectCopy.includes("Connect once. Official APIs only — never a password vault."),
  "sub Connect once",
);
assert(connectCopy.includes("Auto-approve is OFF"), "legal safer auto-approve OFF");
assert(connectCopy.includes("POC · not live"), "connectors not live honesty");
assert(
  connectCopy.includes("BotBuyer will publish whitelist IPs") ||
    connectCopy.includes("X.X.X.X"),
  "IP whitelist placeholder",
);
assert(connectCopy.includes('CONNECT_ACCOUNTS_HONESTY = "Demo"'), "Demo chip until POC proven");
assert(connectCopy.includes('NAMECHEAP_APIUSER_LABEL = "ApiUser"'), "ApiUser label");
assert(connectCopy.includes('NAMECHEAP_APIKEY_LABEL = "ApiKey"'), "ApiKey label");
assert(connectCopy.includes('NAMECHEAP_EGRESS_IP_PLACEHOLDER = "X.X.X.X"'), "Demo IP placeholder");
assert(connectCopy.includes("CTO provides egress IPs"), "CTO egress IP note");
assert(!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(connectCopy), "CPO copy invents no whitelist IPs");
assert(!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(connectUi), "UI invents no whitelist IPs");
assert(!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(connectCraft), "designer craft invents no real IPs");
assert(connectIa.includes("Needs setup"), "CPO Namecheap Needs setup");
assert(connectIa.includes("OAuth"), "CPO Twilio OAuth preferred");
assert(connectLegal.includes("Conditional PASS"), "Legal conditional PASS");
assert(connectLegal.includes("Password vaults"), "Legal forbids password vaults");
assert(connectDocs.includes("BOTBUY_VAULT_KEY"), "docs name BOTBUY_VAULT_KEY");
assert(envExample.includes("BOTBUY_VAULT_KEY="), "env example names vault key");
assert(!/BOTBUY_VAULT_KEY=[0-9a-fA-F]{16,}/.test(envExample), "env example has no vault secret");
assert(schemaSrc.includes("connectedAccounts") && schemaSrc.includes("ciphertext"), "Neon connected_accounts");
assert(connectorVault.includes("ciphertext: null") && connectorVault.includes('status: "revoked"'), "revoke deletes ciphertext");
assert(approveGate.includes("Needs you") && approveGate.includes("Buying"), "approve gate uses existing flow");
assert(approveGate.includes("Auto-approve is OFF"), "approve gate auto-approve OFF");
assert(approveGate.includes("Fail-closed"), "approve gate fail-closed");
assert(namecheapRegister.includes("assertConnectorSpendAllowed") || approveGate.includes("isSpendTool"), "register behind approve");
assert(twilioBuy.includes("connectorsLiveEnabled"), "Twilio buy not live by default");
assert(settingsPageSrc.includes("ConnectedAccountsPanel"), "Settings hosts Connected accounts");
assert(settingsPageSrc.includes('id="connected-accounts"') || connectUi.includes('id="connected-accounts"'), "connected-accounts anchor");
assert(connectPage.includes("ConnectedAccountsPanel"), "connected-accounts route");
assert(connectUi.includes("Namecheap") && connectUi.includes("Twilio"), "Namecheap + Twilio rows");
assert(connectUi.includes("Connect") && connectUi.includes("Revoke"), "Connect / Revoke actions");
assert(connectUi.includes("data-cta=\"twilio-oauth\""), "Twilio OAuth is primary CTA");
assert(connectUi.includes("TWILIO_ADVANCED_CREDENTIALS") || connectUi.includes("Use API credentials"), "Twilio API is advanced");
assert(connectUi.includes("data-step=\"egress-ip-whitelist\""), "Namecheap step 2 IP whitelist");
assert(connectUi.includes("namecheap-egress-ips"), "Namecheap Demo IP rows");
assert(connectUi.includes("revoke-sheet") && connectUi.includes("REVOKE_CONFIRM_LABEL"), "Revoke confirm wipes tokens");
assert(connectUi.includes("data-copy=\"legal-safer\""), "Legal safer on screen + sheets");
assert(connectUi.includes("DemoChip") || connectUi.includes("CONNECT_ACCOUNTS_HONESTY"), "Demo chip on surface");
assert(shell.includes('pathname.startsWith("/settings")'), "Settings path does not light phone tabs");
assert(!/phoneTabs[\s\S]*\/settings/.test(shell), "Settings is not a phone tab");
assert(!connectUi.includes("/brand/") && !connectPage.includes("/brand/"), "connectors UI does not retouch eclipse-pass mark");
assert(connectMiddleware.includes("/api/connectors"), "middleware protects connector APIs");
assert(!connectUi.includes("Autofleeto") && !connectPage.includes("Autofleeto"), "UI never Autofleeto");
assert(!connectCopy.includes("password vault") || connectCopy.includes("never a password vault"), "no password vault product");
assert(read("lib/connectors/sanitize.ts").includes("looksLikeSecretKey"), "never-log sanitizer");
assert(read("lib/connectors/audit.ts").includes("dealId") && read("lib/connectors/audit.ts").includes("provider"), "connector audit row shape");

if (failures.length) {
  console.error("craft-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}

console.log("craft-smoke PASS");
console.log(" - g-techlux light #F7F8FA · teal #2DD4BF / #042F2E ≥4.5:1");
console.log(" - land/meta one-liner payment method lock · no Vault it");
console.log(" - go-live Run BotBuyer present");
console.log(" - CPO land/signup/proof/empty CTA locks");
console.log(" - Admin Finance/Deals above stubs");
console.log(" - GMV=0 · verified $179.96");
console.log(" - Savedfast/xfer personal Closed · imported_unverified");
console.log(" - usage meter Estimate / Demo · not live");
console.log(" - soft-signal HOLD · Demo pill #B8860B");
console.log(" - Quiet Capital type · Product door A · clean #F7F8FA");
console.log(" - eclipse-pass mark+wordmark header · favicon/PWA/OG wired");
console.log(" - site pages /privacy /terms /about /beta /contact · footer lock");
console.log(" - /about graphical story · Land E captions · eclipse-pass sitewide · Soft HOLD");
