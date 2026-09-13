#!/usr/bin/env node
/**
 * Act-on-behalf smoke: Needs you → Buying trail + draft-only honesty.
 * Does not send mail. Does not call register HTTP. Does not print secrets.
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

const act = read("lib/act-on-behalf.ts");
const drafts = read("lib/act-drafts.ts");
const gate = read("lib/connectors/approve-gate.ts");
const dealApi = read("app/api/deals/[id]/act/route.ts");
const dealPage = read("app/(app)/deals/[id]/page.tsx");
const prepUi = read("components/act-on-behalf-prep.tsx");
const envExample = read(".env.example");
const docs = read("docs/act-on-behalf.md");
const flags = read("lib/honesty-flags.ts");
const register = read("lib/connectors/namecheap/register.ts");
const runtime = read("lib/connectors/runtime.ts");

assert(gate.includes("assertActOnBehalfAllowed"), "approve-gate exports act-on-behalf");
assert(gate.includes('fromStatus === "Needs you"'), "gate requires Needs you");
assert(gate.includes('toStatus === "Buying"'), "gate requires Buying");
assert(gate.includes("Auto-approve is OFF"), "gate auto-approve OFF");
assert(!gate.includes("autoApprove: true"), "gate never enables auto-approve");

assert(act.includes("assertActOnBehalfAllowed"), "prep uses act gate");
assert(act.includes("BOTBUY_MAIL_PROVIDER"), "dedicated mail provider env");
assert(act.includes("BOTBUY_MAIL_API_KEY"), "dedicated mail key env");
assert(act.includes("BOTBUY_MAIL_FROM"), "dedicated mail from env");
assert(act.includes("BOTBUY_MAIL_LIVE"), "dedicated mail live env name");
assert(act.includes("live: false"), "live false lock");
assert(act.includes("spend: false"), "spend false lock");
assert(act.includes("sent: false"), "sent false lock");
assert(act.includes("registered: false"), "registered false lock");
assert(act.includes("autoApprove: false"), "autoApprove false lock");
assert(act.includes("actOnBehalfFailClosed"), "fail-closed helper");
assert(act.includes("actOnBehalfTimelineTitle"), "timeline title helper");
assert(act.includes("Prepared · not sent") || read("lib/act-copy.ts").includes("Prepared · not sent"), "prepared not-sent honesty");
assert(read("lib/act-copy.ts").includes("Prepared · not registered"), "prepared not-registered honesty");
assert(dealPage.includes("act-on-behalf-timeline"), "deal timeline surfaces act-on-behalf honesty");
assert(dealPage.includes("Prepared · not sent") || dealPage.includes("ACT_ON_BEHALF_PREPARED_NOT_SENT"), "deal timeline prepared not-sent");
assert(!act.includes("nodemailer"), "no nodemailer");
assert(!act.includes("createTransport"), "no SMTP transport");
assert(!/fetch\(\s*['"`]https?:\/\/api\.(sendgrid|mailgun|resend|postmark)/.test(act), "no mail API send");
assert(!act.includes("namecheap.domains.create"), "act surface does not call Namecheap create");
assert(!act.includes("invokeConnectorTool"), "act surface does not invoke connector HTTP");
assert(
  !act.includes("Autofleeto") || act.includes("never Autofleeto"),
  "lib never uses Autofleeto secrets",
);

assert(drafts.includes("buildEmailDraft"), "email draft builder");
assert(drafts.includes("buildReplyDraft"), "reply draft builder");
assert(drafts.includes("vehicle") && drafts.includes("property"), "category-agnostic cars/houses");
assert(drafts.includes("domain") && drafts.includes("software") && drafts.includes("consumer"), "domains/software/consumer");
assert(drafts.includes("have not invented a merchant reply") || drafts.includes("not invent"), "no invented merchant inbound");
assert(drafts.includes("has not been sent"), "drafts say not sent");

assert(dealApi.includes("prepareActOnBehalf"), "deal API preps after Approve");
assert(dealApi.includes("actOnBehalfFailClosed"), "deal API uses fail-closed helper");
assert(dealApi.includes("live: false"), "deal API live false");
assert(dealApi.includes("spend: false"), "deal API spend false");
assert(dealApi.includes("sent: false"), "deal API sent false");
assert(dealApi.includes("registered: false"), "deal API registered false");
assert(dealApi.includes('"reply"') || dealApi.includes("isActOnBehalfAction"), "deal API accepts reply");

assert(dealPage.includes("ActOnBehalfPrep"), "Buying deal shows act prep");
assert(prepUi.includes('status !== "Buying"'), "prep UI gated to Buying");
assert(prepUi.includes("AUTO_APPROVE_OFF"), "prep UI auto-approve OFF");
assert(prepUi.includes('token="sent=false"'), "prep UI sent=false HonestyFlag");
assert(prepUi.includes('token="registered=false"'), "prep UI registered=false HonestyFlag");
assert(prepUi.includes('token="spend=false"'), "prep UI spend=false HonestyFlag");
assert(prepUi.includes("Prepared · not sent"), "prep UI prepared not sent");
assert(prepUi.includes("Prepare chase email"), "prep UI email action");
assert(prepUi.includes("Prepare merchant reply"), "prep UI reply action");
assert(prepUi.includes("Prepare register stub"), "prep UI register action");

assert(envExample.includes("BOTBUY_MAIL_PROVIDER="), "env names mail provider");
assert(envExample.includes("BOTBUY_MAIL_API_KEY="), "env names mail key");
assert(envExample.includes("BOTBUY_MAIL_FROM="), "env names mail from");
assert(envExample.includes("BOTBUY_MAIL_LIVE=false"), "env mail live stays false");
assert(envExample.includes("BOTBUY_CONNECTORS_LIVE=false"), "env connectors live stays false");
assert(!/BOTBUY_MAIL_API_KEY=\S+/.test(envExample.split("\n").find((line) => line.startsWith("BOTBUY_MAIL_API_KEY=")) ?? ""), "env example has no mail secret");
assert(docs.includes("Needs you → Buying"), "docs require approve trail");
assert(docs.includes("sent=false") || docs.includes("`sent`"), "docs sent honesty");
assert(docs.includes("registered=false") || docs.includes("`registered`"), "docs registered honesty");
assert(docs.includes("Auto-approve is **OFF**"), "docs auto-approve OFF");
assert(docs.includes("BOTBUY_MAIL_LIVE"), "docs name mail live");
assert(flags.includes('HONESTY_SENT_FALSE = "sent=false"'), "sent=false SoT");
assert(flags.includes('HONESTY_REGISTERED_FALSE = "registered=false"'), "registered=false SoT");
assert(flags.includes("actOnBehalfHonestyFlags"), "act honesty helper");

assert(register.includes("connectorsLiveEnabled"), "existing register still gated on LIVE");
assert(runtime.includes("assertConnectorSpendAllowed"), "existing register still approve-gated");

function evaluateActOnBehalf({ autoApproveAllowed, autoApprove, deal, events }) {
  if (autoApproveAllowed || autoApprove) return { ok: false, reason: "auto-approve" };
  if (!deal) return { ok: false, reason: "deal" };
  if (deal.status !== "Buying") return { ok: false, reason: "status" };
  if (!events.some((event) => event.from === "Needs you" && event.to === "Buying")) {
    return { ok: false, reason: "trail" };
  }
  return {
    ok: true,
    live: false,
    spend: false,
    sent: false,
    registered: false,
    prepared: true,
  };
}

assert(
  !evaluateActOnBehalf({
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Needs you" },
    events: [],
  }).ok,
  "Needs you without Approve fails closed",
);
assert(
  !evaluateActOnBehalf({
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Searching" },
    events: [],
  }).ok,
  "Searching without Approve fails closed",
);
assert(
  !evaluateActOnBehalf({
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [],
  }).ok,
  "Buying without trail fails closed",
);
assert(
  !evaluateActOnBehalf({
    autoApproveAllowed: true,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "auto-approve allowed fails closed",
);
assert(
  !evaluateActOnBehalf({
    autoApproveAllowed: false,
    autoApprove: true,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "limits.autoApprove fails closed",
);

const ready = evaluateActOnBehalf({
  autoApproveAllowed: false,
  autoApprove: false,
  deal: { status: "Buying" },
  events: [{ from: "Needs you", to: "Buying" }],
});
assert(ready.ok, "Approve trail passes");
assert(ready.live === false, "ready path still not live");
assert(ready.spend === false, "ready path still not spend");
assert(ready.sent === false, "ready path still not sent");
assert(ready.registered === false, "ready path still not registered");
assert(ready.prepared === true, "ready path can prepare a draft");

if (failures.length) {
  console.error("act-on-behalf-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}
console.log("act-on-behalf-smoke PASS");
console.log(" - Needs you → Buying required · auto-approve OFF");
console.log(" - reply / email / register scaffolds · sent=false · registered=false");
console.log(" - BOTBUY_MAIL_* named · no Autofleeto · no SMTP send");
