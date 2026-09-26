/**
 * Needs you user-alert smoke.
 * Does not send merchant mail. Does not approve or spend.
 * Act-on-behalf stays sent:false.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SEED_OWNER } from "../lib/auth-owner.ts";
import { actOnBehalfVaultStatus, botbuyMailLiveClaimAllowed } from "../lib/act-on-behalf.ts";
import { applySearchActHandoff } from "../lib/connectors/deal-search.ts";
import {
  buildIngestDeal,
  isFreshNeedsYouTransition,
} from "../lib/ingest/candidates.ts";
import {
  NEEDS_YOU_NOTIFY_SUBJECT,
  listNeedsYouNotifyAudits,
  notifyNeedsYouEntered,
  setNeedsYouNotifyTransport,
} from "../lib/needs-you-notify.ts";
import {
  addIntent,
  appendDealEvent,
  createSearchingDealFromIntent,
  listDealEvents,
} from "../lib/store.ts";
import { rememberDirectoryUser } from "../lib/user-directory.ts";

delete process.env.STAGE_SEARCH_FIXTURE;
delete process.env.BOTBUY_NOTIFY_LIVE;
delete process.env.BOTBUY_MAIL_PROVIDER;
delete process.env.BOTBUY_MAIL_API_KEY;
delete process.env.BOTBUY_MAIL_FROM;
delete process.env.BOTBUY_MAIL_LIVE;

const sends: Array<{ url: string; init: { headers: Record<string, string>; body: string } }> = [];
setNeedsYouNotifyTransport(async (url, init) => {
  sends.push({ url, init });
  return { ok: true, status: 200 };
});

assert.equal(isFreshNeedsYouTransition(null, "Needs you"), true);
assert.equal(isFreshNeedsYouTransition("Found", "Needs you"), true);
assert.equal(isFreshNeedsYouTransition("Needs you", "Needs you"), false);
assert.equal(isFreshNeedsYouTransition("Buying", "Buying"), false);

const stamp = Date.now();
const quiet = addIntent(
  {
    summary: `Find invoice software for needs-you notify off ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 40,
  },
  SEED_OWNER.id,
);
const quietDeal = await createSearchingDealFromIntent(quiet, SEED_OWNER.id);
assert.equal(quietDeal.status, "Searching");

const skippedDeal = await applySearchActHandoff({
  deal: quietDeal,
  userId: SEED_OWNER.id,
  provider: "shopify",
  searchData: {
    candidates: [{ title: "Invoice tools", handle: "invoice-tools", amountStatus: "unverified" }],
    amountStatus: "unverified",
  },
  quoteData: { listedUsd: null, amountStatus: "unverified" },
});
assert.equal(skippedDeal.status, "Needs you");
assert.equal(sends.length, 0);
const skippedEvent = listDealEvents(skippedDeal.id).find((event) =>
  event.id.includes("_needs_you_notify_"),
);
assert.ok(skippedEvent, "live off still records a notify event");
assert.match(skippedEvent.detail, /reason=notify_live_off/);
assert.match(skippedEvent.detail, /sent=false/);
assert.match(skippedEvent.detail, /autoApprove=false/);
assert.match(skippedEvent.detail, /spend=false/);
assert.equal(skippedEvent.metadata?.sent, false);
assert.equal(
  listNeedsYouNotifyAudits(SEED_OWNER.id).some(
    (row) => row.action === "needs_you.notify.skipped",
  ),
  true,
);

process.env.BOTBUY_NOTIFY_LIVE = "true";
process.env.BOTBUY_MAIL_PROVIDER = "resend";
process.env.BOTBUY_MAIL_API_KEY = "notify-test-key";
process.env.BOTBUY_MAIL_FROM = "BotBuyer <notify@botbuyer.ai>";
process.env.NEXT_PUBLIC_APP_URL = "https://botbuyer.ai";

const live = addIntent(
  {
    summary: `Find invoice software for needs-you notify live ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 40,
  },
  SEED_OWNER.id,
);
const liveDeal = await createSearchingDealFromIntent(live, SEED_OWNER.id);
const sentDeal = await applySearchActHandoff({
  deal: liveDeal,
  userId: SEED_OWNER.id,
  provider: "shopify",
  searchData: {
    candidates: [
      {
        title: "Notify live tools",
        handle: "notify-live",
        amountStatus: "unverified",
      },
    ],
    amountStatus: "unverified",
  },
  quoteData: { listedUsd: null, amountStatus: "unverified" },
});
assert.equal(sentDeal.status, "Needs you");
assert.equal(sends.length, 1);
assert.equal(sends[0].url, "https://api.resend.com/emails");
assert.equal(sends[0].init.headers.Authorization, "Bearer notify-test-key");
const payload = JSON.parse(sends[0].init.body) as {
  from: string;
  to: string[];
  subject: string;
  text: string;
};
assert.equal(payload.subject, NEEDS_YOU_NOTIFY_SUBJECT);
assert.equal(payload.from, "BotBuyer <notify@botbuyer.ai>");
assert.equal(payload.to.length, 1);
assert.equal(payload.to[0], "john.mitchell@buildstarlabs.com");
assert.match(payload.text, /Notify live tools|Find invoice software/);
assert.match(payload.text, /needs your OK/);
assert.match(payload.text, /\/deals\//);
assert.match(payload.text, /Nothing is approved, bought, or spent/);
assert.equal(payload.text.includes("notify-test-key"), false);
assert.equal(payload.text.includes("4111111111111111"), false);
const sentEvent = listDealEvents(sentDeal.id).find((event) =>
  event.id.includes("_needs_you_notify_"),
);
assert.ok(sentEvent);
assert.match(sentEvent.detail, /reason=sent/);
assert.match(sentEvent.detail, /sent=true/);
assert.equal(sentEvent.metadata?.sent, true);
assert.equal(JSON.stringify(sentEvent).includes("notify-test-key"), false);
assert.equal(
  listNeedsYouNotifyAudits(SEED_OWNER.id).some(
    (row) => row.action === "needs_you.notify.sent",
  ),
  true,
);

const replay = await applySearchActHandoff({
  deal: sentDeal,
  userId: SEED_OWNER.id,
  provider: "shopify",
  searchData: {
    candidates: [{ title: "Notify live tools", amountStatus: "unverified" }],
  },
});
assert.equal(replay.status, "Needs you");
assert.equal(sends.length, 1);

const rewrite = await notifyNeedsYouEntered({
  deal: sentDeal,
  userId: SEED_OWNER.id,
  previousStatus: "Needs you",
});
assert.equal(rewrite.sent, false);
assert.equal(rewrite.attempted, false);
assert.equal(rewrite.reason, "already_needs_you");
assert.equal(sends.length, 1);

const imported = buildIngestDeal(
  {
    marketplace: "Flippa",
    url: `https://flippa.com/needs-you-notify-${stamp}`,
    title: "Imported scan notify",
    askPriceUsd: 100,
    status: "new",
  },
  SEED_OWNER.id,
);
const importedSend = await notifyNeedsYouEntered({
  deal: imported.deal,
  userId: SEED_OWNER.id,
  previousStatus: null,
  persist: "hunt",
});
assert.equal(importedSend.sent, true);
assert.equal(sends.length, 2);
const importedRewrite = await notifyNeedsYouEntered({
  deal: imported.deal,
  userId: SEED_OWNER.id,
  previousStatus: "Needs you",
  persist: "hunt",
});
assert.equal(importedRewrite.sent, false);
assert.equal(sends.length, 2);

appendDealEvent({
  id: `evt_${sentDeal.id}_reentry_status`,
  dealId: sentDeal.id,
  type: "status",
  title: "Status Buying → Needs you",
  detail: "Re-entered Needs you for notify smoke.",
  at: new Date().toISOString(),
  status: "done",
  actor: "engine",
  fromStatus: "Buying",
  toStatus: "Needs you",
});
const reentered = await notifyNeedsYouEntered({
  deal: sentDeal,
  userId: SEED_OWNER.id,
  previousStatus: "Buying",
});
assert.equal(reentered.sent, true);
assert.equal(sends.length, 3);
const reenteredAgain = await notifyNeedsYouEntered({
  deal: sentDeal,
  userId: SEED_OWNER.id,
  previousStatus: "Buying",
});
assert.equal(reenteredAgain.sent, false);
assert.equal(sends.length, 3);

delete process.env.BOTBUY_MAIL_API_KEY;
const missing = await notifyNeedsYouEntered({
  deal: { ...imported.deal, id: `${imported.deal.id}_keys` },
  userId: SEED_OWNER.id,
  previousStatus: null,
});
assert.equal(missing.reason, "missing_keys");
assert.equal(missing.sent, false);
assert.equal(sends.length, 3);
const missingEvent = listDealEvents(missing.dealId).find((event) => event.id === missing.eventId);
assert.match(missingEvent?.detail ?? "", /reason=missing_keys/);

process.env.BOTBUY_MAIL_API_KEY = "notify-test-key";
rememberDirectoryUser({
  id: "usr_notify_no_email",
  email: "",
  name: "No Email",
  company: "",
  role: "customer",
  clerkUserId: null,
  notificationEmail: "   ",
  phone: "",
});
const noEmail = await notifyNeedsYouEntered({
  deal: { ...imported.deal, id: `${imported.deal.id}_no_email`, userId: "usr_notify_no_email" },
  userId: "usr_notify_no_email",
  previousStatus: "Found",
});
assert.equal(noEmail.reason, "no_email");
assert.equal(noEmail.sent, false);
assert.equal(sends.length, 3);

const panDeal = {
  ...imported.deal,
  id: `${imported.deal.id}_pan`,
  title: "Card 4111111111111111 listed",
};
const panSend = await notifyNeedsYouEntered({
  deal: panDeal,
  userId: SEED_OWNER.id,
  previousStatus: "Found",
});
assert.equal(panSend.sent, true);
assert.equal(sends.length, 4);
const panBody = JSON.parse(sends[3].init.body) as { text: string };
assert.equal(panBody.text.includes("4111111111111111"), false);
assert.match(panBody.text, /\[redacted\]/);

setNeedsYouNotifyTransport(async () => ({ ok: false, status: 422 }));
const failed = await notifyNeedsYouEntered({
  deal: { ...imported.deal, id: `${imported.deal.id}_fail` },
  userId: SEED_OWNER.id,
  previousStatus: "Found",
});
assert.equal(failed.sent, false);
assert.equal(failed.attempted, true);
assert.equal(failed.reason, "send_failed");
const failedEvent = listDealEvents(failed.dealId).find((event) => event.id === failed.eventId);
assert.match(failedEvent?.detail ?? "", /reason=send_failed/);
assert.match(failedEvent?.detail ?? "", /sent=false/);

const act = actOnBehalfVaultStatus();
assert.equal(act.sent, false);
assert.equal(act.live, false);
assert.equal(act.spend, false);
assert.equal(act.autoApprove, false);
assert.equal(botbuyMailLiveClaimAllowed(), false);
assert.notEqual(process.env.BOTBUY_MAIL_LIVE, "true");

const route = readFileSync(
  new URL("../app/api/ingest/candidates/route.ts", import.meta.url),
  "utf8",
);
assert.match(route, /enteredNeedsYou/);
assert.match(route, /notifyNeedsYouEntered/);
const handoff = readFileSync(
  new URL("../lib/connectors/deal-search.ts", import.meta.url),
  "utf8",
);
assert.match(handoff, /transitionDeal\(found\.id, "Needs you"/);
assert.match(handoff, /notifyNeedsYouEntered/);
const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
assert.match(envExample, /BOTBUY_NOTIFY_LIVE=false/);
assert.match(envExample, /BOTBUY_MAIL_LIVE=false/);
assert.equal(envExample.includes("BOTBUY_MAIL_API_KEY=re_"), false);

setNeedsYouNotifyTransport(null);
delete process.env.BOTBUY_NOTIFY_LIVE;
delete process.env.BOTBUY_MAIL_API_KEY;
delete process.env.BOTBUY_MAIL_FROM;
delete process.env.BOTBUY_MAIL_PROVIDER;

console.log("needs-you-notify-smoke PASS");
