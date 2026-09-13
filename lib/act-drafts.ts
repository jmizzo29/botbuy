/**
 * Category-agnostic on-behalf draft builder.
 * Cars / houses / consumer / software / domains / phone / general.
 * Never invents a merchant inbound. Never claims sent.
 */
import {
  DIGITALOCEAN_CATEGORIES,
  DOMAIN_CATEGORIES,
  PHONE_CATEGORIES,
  SOFTWARE_CATEGORIES,
  isConsumerCategory,
  isPropertyCategory,
  isVehicleCategory,
} from "@/lib/intent-categories";
import type { SearchActHandoff } from "@/lib/connectors/search-handoff";
import type { Deal } from "@/lib/types";

export const ACT_DRAFT_KINDS = [
  "vehicle",
  "property",
  "domain",
  "phone",
  "software",
  "consumer",
  "general",
] as const;
export type ActDraftKind = (typeof ACT_DRAFT_KINDS)[number];

export interface ActDraftMessage {
  kind: ActDraftKind;
  subject: string;
  body: string;
}

function firstCandidateLabel(handoff: SearchActHandoff | null): string | null {
  const label = handoff?.candidates[0]?.label?.trim();
  return label || null;
}

export function actDraftKind(
  deal: Deal,
  handoff: SearchActHandoff | null,
): ActDraftKind {
  const category = deal.category.trim().toLowerCase();
  if (isVehicleCategory(category)) return "vehicle";
  if (isPropertyCategory(category)) return "property";
  if (DOMAIN_CATEGORIES.has(category)) return "domain";
  if (PHONE_CATEGORIES.has(category)) return "phone";
  if (SOFTWARE_CATEGORIES.has(category) || DIGITALOCEAN_CATEGORIES.has(category)) {
    return "software";
  }
  if (isConsumerCategory(category)) return "consumer";

  const candidateKind = handoff?.candidates[0]?.kind;
  if (candidateKind === "domain") return "domain";
  if (candidateKind === "phone") return "phone";
  if (candidateKind === "listing") {
    const provider = handoff?.provider ?? "";
    if (provider === "stage_fixture" || provider === "http_json") return "general";
    return "consumer";
  }
  if (candidateKind === "product") return "consumer";
  return "general";
}

function subjectFor(kind: ActDraftKind, title: string, action: "email" | "reply") {
  const prefix = action === "reply" ? "Re: " : "";
  switch (kind) {
    case "vehicle":
      return `${prefix}Following up on the vehicle — ${title}`;
    case "property":
      return `${prefix}Following up on the property — ${title}`;
    case "domain":
      return `${prefix}Domain follow-up — ${title}`;
    case "phone":
      return `${prefix}Number follow-up — ${title}`;
    case "software":
      return `${prefix}Catalog / license follow-up — ${title}`;
    case "consumer":
      return `${prefix}Availability follow-up — ${title}`;
    default:
      return `${prefix}Following up — ${title}`;
  }
}

function intentLine(deal: Deal): string {
  const notes = deal.notes.trim();
  if (!notes) return `Intent: ${deal.category} · ${deal.marketplace}.`;
  return `Intent: ${notes}`;
}

function candidateLine(handoff: SearchActHandoff | null): string | null {
  const label = firstCandidateLabel(handoff);
  if (!label) return null;
  const provider = handoff?.provider ?? "unknown";
  return `Listed candidate on file (unverified, not bought): ${label} · provider=${provider}.`;
}

/**
 * Chase / on-behalf outbound. Draft only.
 */
export function buildEmailDraft(
  deal: Deal,
  handoff: SearchActHandoff | null,
): ActDraftMessage {
  const kind = actDraftKind(deal, handoff);
  const candidate = candidateLine(handoff);
  const lines = [
    "Hello,",
    "",
    `I'm writing on behalf of a BotBuyer client about: ${deal.title}.`,
    "",
    intentLine(deal),
    candidate,
    "",
    "Please reply with availability, next steps, and any documents we should review.",
    "",
    "This is a prepared on-behalf draft. It has not been sent.",
    "",
    "— BotBuyer (on behalf)",
  ].filter((line): line is string => line !== null);
  return {
    kind,
    subject: subjectFor(kind, deal.title, "email"),
    body: lines.join("\n"),
  };
}

/**
 * Merchant-reply draft we would send. Does not invent an inbound seller message.
 */
export function buildReplyDraft(
  deal: Deal,
  handoff: SearchActHandoff | null,
): ActDraftMessage {
  const kind = actDraftKind(deal, handoff);
  const candidate = candidateLine(handoff);
  const lines = [
    "Hello,",
    "",
    `Thank you for the note about ${deal.title}. On behalf of our buyer, we would like to continue.`,
    "",
    intentLine(deal),
    candidate,
    "",
    "Please confirm availability and the next step. We have not invented a merchant reply, and this draft has not been sent.",
    "",
    "— BotBuyer (on behalf)",
  ].filter((line): line is string => line !== null);
  return {
    kind,
    subject: subjectFor(kind, deal.title, "reply"),
    body: lines.join("\n"),
  };
}
