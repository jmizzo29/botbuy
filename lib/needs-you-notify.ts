/**
 * Out-of-app email when a deal first enters Needs you.
 *
 * Does not approve, spend, buy, or send merchant mail.
 * Act-on-behalf stays on BOTBUY_MAIL_LIVE (false) in lib/act-on-behalf.ts.
 * User alerts send only when BOTBUY_NOTIFY_LIVE is exactly "true"
 * and Resend keys are present. Otherwise the transition stands and
 * a deal event records why notify was skipped.
 */
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { saveHuntEvent } from "@/lib/db/hunts";
import { isFreshNeedsYouTransition } from "@/lib/ingest/candidates";
import { isPendingClerkEmail } from "@/lib/john-ux";
import { sanitizeAuditMetadata } from "@/lib/connectors/sanitize";
import {
  appendDealEvent,
  listAuditLogs,
  listDealEvents,
  recordAuditLog,
} from "@/lib/store";
import { getDirectoryUser } from "@/lib/user-directory";
import type { Deal, DealStatus } from "@/lib/types";
import { eq } from "drizzle-orm";

export const NEEDS_YOU_NOTIFY_SUBJECT = "BotBuyer needs you";

const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export type NeedsYouNotifyReason =
  | "sent"
  | "notify_live_off"
  | "missing_keys"
  | "no_email"
  | "send_failed"
  | "already_needs_you";

export interface NeedsYouNotifyResult {
  attempted: boolean;
  sent: boolean;
  reason: NeedsYouNotifyReason;
  dealId: string;
  eventId: string | null;
}

type NotifyTransport = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string },
) => Promise<{ ok: boolean; status: number }>;

function transportSlot(): { current: NotifyTransport | null } {
  const globalStore = globalThis as typeof globalThis & {
    __botbuyNeedsYouTransport?: { current: NotifyTransport | null };
  };
  if (!globalStore.__botbuyNeedsYouTransport) {
    globalStore.__botbuyNeedsYouTransport = { current: null };
  }
  return globalStore.__botbuyNeedsYouTransport;
}

/** Test hook. Production uses fetch. Pass null to restore. */
export function setNeedsYouNotifyTransport(next: NotifyTransport | null) {
  transportSlot().current = next;
}

export function needsYouNotifyLive() {
  return process.env.BOTBUY_NOTIFY_LIVE?.trim() === "true";
}

export function needsYouAppBase() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://botbuyer.ai";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "https://botbuyer.ai";
    }
    return url.origin;
  } catch {
    return "https://botbuyer.ai";
  }
}

export function pickNotifyRecipient(
  notificationEmail?: string | null,
  accountEmail?: string | null,
) {
  const notify = notificationEmail?.trim() ?? "";
  const account = accountEmail?.trim() ?? "";
  const chosen =
    (notify && !isPendingClerkEmail(notify) ? notify : "") ||
    (account && !isPendingClerkEmail(account) ? account : "");
  if (!chosen || !/^[^\s@]+@[^\s@]+$/.test(chosen)) return null;
  return chosen;
}

export function needsYouNotifyEventId(dealId: string, episode: number) {
  return `evt_${dealId}_needs_you_notify_${episode}`;
}

export function listNeedsYouNotifyAudits(userId: string) {
  return listAuditLogs(userId).filter(
    (row) =>
      row.action === "needs_you.notify.sent" ||
      row.action === "needs_you.notify.skipped",
  );
}

export function needsYouNotifyText(input: {
  title: string;
  dealId: string;
  appUrl: string;
}) {
  const link = `${input.appUrl}/deals/${encodeURIComponent(input.dealId)}`;
  return [
    input.title,
    "",
    "Something on this deal needs your OK. Open Needs you to review it.",
    link,
    "",
    "Nothing is approved, bought, or spent until you say so. Auto-approve is off.",
  ].join("\n");
}

function publicTitle(title: string) {
  const cleaned = title
    .replace(/\b(?:\d[ -]?){13,19}\b/g, "[redacted]")
    .replace(/[\r\n]+/g, " ")
    .trim();
  return cleaned.slice(0, 120) || "A deal";
}

function mailKeys() {
  const provider = process.env.BOTBUY_MAIL_PROVIDER?.trim().toLowerCase() ?? "";
  const apiKey = process.env.BOTBUY_MAIL_API_KEY?.trim() ?? "";
  const from = process.env.BOTBUY_MAIL_FROM?.trim() ?? "";
  return {
    ready: provider === "resend" && Boolean(apiKey) && Boolean(from),
    apiKey,
    from,
  };
}

function entryEpisode(dealId: string) {
  const entries = listDealEvents(dealId).filter(
    (event) =>
      (event.type === "status" || event.type === "import") &&
      event.toStatus === "Needs you" &&
      event.fromStatus !== "Needs you",
  );
  return Math.max(1, entries.length);
}

async function resolveRecipient(userId: string) {
  const db = getDb();
  if (db) {
    try {
      const [row] = await db
        .select({
          email: users.email,
          notificationEmail: users.notificationEmail,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (row) return pickNotifyRecipient(row.notificationEmail, row.email);
    } catch (error) {
      console.error(
        "[needs-you-notify] user lookup failed",
        error instanceof Error ? error.message : "error",
      );
    }
  }
  const memory = getDirectoryUser(userId);
  if (!memory) return null;
  return pickNotifyRecipient(memory.notificationEmail, memory.email);
}

async function postResend(input: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  const body = JSON.stringify({
    from: input.from,
    to: [input.to],
    subject: input.subject,
    text: input.text,
  });
  const init = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body,
  };
  const override = transportSlot().current;
  if (override) {
    return override(RESEND_EMAILS_URL, init);
  }
  const response = await fetch(RESEND_EMAILS_URL, init);
  return { ok: response.ok, status: response.status };
}

function skipped(
  dealId: string,
  reason: NeedsYouNotifyReason,
): NeedsYouNotifyResult {
  return {
    attempted: false,
    sent: false,
    reason,
    dealId,
    eventId: null,
  };
}

async function recordNotify(input: {
  deal: Deal;
  userId: string;
  previousStatus: DealStatus | null;
  episode: number;
  reason: NeedsYouNotifyReason;
  sent: boolean;
  attempted: boolean;
  persist: "memory" | "hunt";
}): Promise<NeedsYouNotifyResult> {
  const eventId = needsYouNotifyEventId(input.deal.id, input.episode);
  const at = new Date().toISOString();
  const detail = [
    `reason=${input.reason}`,
    `sent=${String(input.sent)}`,
    "autoApprove=false",
    "spend=false",
    "merchantMail=false",
    "Needs you user alert. Not an approval. Not a purchase.",
  ].join(" · ");
  const event = appendDealEvent({
    id: eventId,
    dealId: input.deal.id,
    type: "note",
    stage: "gate",
    title: input.sent ? "Needs you email sent" : "Needs you email skipped",
    detail,
    at,
    status: "done",
    actor: "engine",
    fromStatus: input.previousStatus,
    toStatus: "Needs you",
    metadata: sanitizeAuditMetadata({
      kind: "needs_you_notify",
      reason: input.reason,
      sent: input.sent,
      autoApprove: false,
      spend: false,
      merchantMail: false,
      provider: input.attempted ? "resend" : null,
    }),
  });
  recordAuditLog({
    userId: input.userId,
    action: input.sent ? "needs_you.notify.sent" : "needs_you.notify.skipped",
    entityType: "deal",
    entityId: input.deal.id,
    metadata: sanitizeAuditMetadata({
      reason: input.reason,
      sent: input.sent,
      autoApprove: false,
      spend: false,
      merchantMail: false,
    }),
  });
  if (input.persist === "hunt") {
    try {
      await saveHuntEvent(event);
    } catch (error) {
      console.error(
        "[needs-you-notify] event persist failed",
        error instanceof Error ? error.message : "error",
      );
    }
  }
  console.info(
    `[needs-you-notify] ${input.reason} deal=${input.deal.id} sent=${String(input.sent)}`,
  );
  return {
    attempted: input.attempted,
    sent: input.sent,
    reason: input.reason,
    dealId: input.deal.id,
    eventId,
  };
}

async function notifyNeedsYouEnteredInner(input: {
  deal: Deal;
  userId: string;
  previousStatus: DealStatus | null;
  persist?: "memory" | "hunt";
}): Promise<NeedsYouNotifyResult> {
  const persist = input.persist ?? "memory";
  if (!isFreshNeedsYouTransition(input.previousStatus, input.deal.status)) {
    return skipped(input.deal.id, "already_needs_you");
  }

  const episode = entryEpisode(input.deal.id);
  const eventId = needsYouNotifyEventId(input.deal.id, episode);
  if (listDealEvents(input.deal.id).some((event) => event.id === eventId)) {
    return skipped(input.deal.id, "already_needs_you");
  }

  const base = {
    deal: input.deal,
    userId: input.userId,
    previousStatus: input.previousStatus,
    episode,
    persist,
  };

  if (!needsYouNotifyLive()) {
    return recordNotify({
      ...base,
      reason: "notify_live_off",
      sent: false,
      attempted: false,
    });
  }

  const keys = mailKeys();
  if (!keys.ready) {
    return recordNotify({
      ...base,
      reason: "missing_keys",
      sent: false,
      attempted: false,
    });
  }

  const to = await resolveRecipient(input.userId);
  if (!to) {
    return recordNotify({
      ...base,
      reason: "no_email",
      sent: false,
      attempted: false,
    });
  }

  const subject = NEEDS_YOU_NOTIFY_SUBJECT;
  const text = needsYouNotifyText({
    title: publicTitle(input.deal.title),
    dealId: input.deal.id,
    appUrl: needsYouAppBase(),
  });

  let sent = false;
  try {
    const response = await postResend({
      apiKey: keys.apiKey,
      from: keys.from,
      to,
      subject,
      text,
    });
    sent = response.ok;
  } catch (error) {
    console.error(
      "[needs-you-notify] resend request failed",
      error instanceof Error ? error.message : "error",
    );
    sent = false;
  }

  return recordNotify({
    ...base,
    reason: sent ? "sent" : "send_failed",
    sent,
    attempted: true,
  });
}

/**
 * Email the owner when this call is the edge into Needs you.
 * Never throws. Never changes deal status.
 */
export async function notifyNeedsYouEntered(input: {
  deal: Deal;
  userId: string;
  previousStatus: DealStatus | null;
  persist?: "memory" | "hunt";
}): Promise<NeedsYouNotifyResult> {
  try {
    return await notifyNeedsYouEnteredInner(input);
  } catch (error) {
    console.error(
      "[needs-you-notify] failed",
      error instanceof Error ? error.message : "error",
    );
    return skipped(input.deal.id, "send_failed");
  }
}
