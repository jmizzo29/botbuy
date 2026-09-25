import { quietAmount } from "@/lib/quiet-capital";
import type { Deal, Intent } from "@/lib/types";

/** Track C · Intent agent chat. EXAMPLE until CHO. Auto-approve OFF. */

export const INTENT_TITLE = "Intent" as const;
export const INTENT_EMPTY_SUB =
  "Tell BotBuyer what to find — it searches, then waits for you." as const;
export const INTENT_EMPTY_H = "No intents yet" as const;
export const INTENT_EMPTY_BODY =
  "Set an intent in plain language. Matches land for review — BotBuyer spends only with your OK." as const;
export const INTENT_ASK = "Ask BotBuyer" as const;
export const INTENT_NEW = "New intent" as const;
export const INTENT_EMPTY_MICRO =
  "Nothing is charged on this screen. Auto-approve is off." as const;
export const INTENT_EXAMPLE_EMPTY_CHIP = "EXAMPLE · not CHO-verified" as const;
export const INTENT_LIST_SUB =
  "Your threads — BotBuyer only moves when you approve." as const;
export const INTENT_CRUMB = "Intent · thread" as const;
export const INTENT_CHARGE_MICRO = "Nothing is charged on this screen." as const;
export const INTENT_TRUST_MICRO = "BotBuyer only runs what you approve." as const;
export const INTENT_ASK_DECISION =
  "Approve this listing to continue, or reject and I’ll keep searching." as const;
export const INTENT_HELD_NOTE = "Nothing was charged. Auto-approve is off." as const;
export const INTENT_EXAMPLE_ID = "quiet-ex-saas" as const;
export const INTENT_NEW_HREF = "/intent/new" as const;

export type IntentChip = "Needs you" | "Searching" | "Watching";

export type IntentListRow = {
  id: string;
  title: string;
  last: string;
  chip: IntentChip;
  href: string;
};

export type IntentListing = {
  title: string;
  amount: string;
  example: boolean;
  imported: boolean;
};

export type IntentNoteTurn = {
  kind: "note";
  who: "you" | "agent";
  text: string;
  listing?: IntentListing;
};

export type IntentDecisionTurn = {
  kind: "decision";
  ask: string;
  /** Live Needs you deal. EXAMPLE threads omit this and do not spend. */
  dealId?: string;
};

export type IntentSideRow = {
  id: string;
  title: string;
  last: string;
  href: string;
};

export type IntentThreadModel = {
  id: string;
  title: string;
  side: IntentSideRow[];
  turns: Array<IntentNoteTurn | IntentDecisionTurn>;
  example: boolean;
};

export const INTENT_EXAMPLE_ROWS: IntentListRow[] = [
  {
    id: "quiet-ex-saas",
    title: "SaaS billing tools under $15k",
    last: "Approve this listing to continue…",
    chip: "Needs you",
    href: "/intent/quiet-ex-saas?example=1",
  },
  {
    id: "quiet-ex-newsletter",
    title: "Newsletter stack · Flippa",
    last: "Searching imports — two candidates queued.",
    chip: "Searching",
    href: "/intent/quiet-ex-newsletter?example=1",
  },
  {
    id: "quiet-ex-micro",
    title: "Micro-SaaS · B2B dashboards",
    last: "3 options found · watching quietly.",
    chip: "Watching",
    href: "/intent/quiet-ex-micro?example=1",
  },
  {
    id: "quiet-ex-chrome",
    title: "Chrome extensions · productivity",
    last: "No match yet — still scanning.",
    chip: "Searching",
    href: "/intent/quiet-ex-chrome?example=1",
  },
];

const EXAMPLE_SIDE: IntentSideRow[] = [
  {
    id: "quiet-ex-saas",
    title: "SaaS billing under $15k",
    last: "Approve this listing to continue…",
    href: "/intent/quiet-ex-saas?example=1",
  },
  {
    id: "quiet-ex-newsletter",
    title: "Newsletter stack",
    last: "Searching Flippa imports…",
    href: "/intent/quiet-ex-newsletter?example=1",
  },
  {
    id: "quiet-ex-micro",
    title: "Micro-SaaS dashboards",
    last: "3 options found · watching",
    href: "/intent/quiet-ex-micro?example=1",
  },
];

const EXAMPLE_THREADS: Record<string, IntentThreadModel> = {
  "quiet-ex-saas": {
    id: "quiet-ex-saas",
    title: "SaaS billing tools under $15k",
    side: EXAMPLE_SIDE,
    example: true,
    turns: [
      {
        kind: "note",
        who: "you",
        text: "Find SaaS billing tools under $15k — Flippa or similar, B2B preferred.",
      },
      {
        kind: "note",
        who: "agent",
        text: "Found one match from an imported scan. Amounts are unverified. Auto-approve is off.",
        listing: {
          title: "InvoiceFlow · SaaS billing",
          amount: "Listed $8,900 · unverified",
          example: true,
          imported: true,
        },
      },
      {
        kind: "decision",
        ask: INTENT_ASK_DECISION,
      },
    ],
  },
  "quiet-ex-newsletter": {
    id: "quiet-ex-newsletter",
    title: "Newsletter stack · Flippa",
    side: EXAMPLE_SIDE,
    example: true,
    turns: [
      {
        kind: "note",
        who: "you",
        text: "Newsletter stack · Flippa",
      },
      {
        kind: "note",
        who: "agent",
        text: "Searching imports — two candidates queued. Amounts are unverified. Auto-approve is off.",
      },
    ],
  },
  "quiet-ex-micro": {
    id: "quiet-ex-micro",
    title: "Micro-SaaS · B2B dashboards",
    side: EXAMPLE_SIDE,
    example: true,
    turns: [
      {
        kind: "note",
        who: "you",
        text: "Micro-SaaS · B2B dashboards",
      },
      {
        kind: "note",
        who: "agent",
        text: "3 options found · watching quietly. Amounts are unverified. Auto-approve is off. Nothing is charged on this screen.",
      },
    ],
  },
  "quiet-ex-chrome": {
    id: "quiet-ex-chrome",
    title: "Chrome extensions · productivity",
    side: EXAMPLE_SIDE,
    example: true,
    turns: [
      {
        kind: "note",
        who: "you",
        text: "Chrome extensions · productivity",
      },
      {
        kind: "note",
        who: "agent",
        text: "No match yet — still scanning. Auto-approve is off. Nothing is charged on this screen.",
      },
    ],
  },
};

export function exampleIntentThread(id: string) {
  return EXAMPLE_THREADS[id] ?? null;
}

export function isExampleIntentId(id: string) {
  return id in EXAMPLE_THREADS;
}

function dealForIntent(intent: Intent, deals: Deal[]) {
  const title = intent.summary.slice(0, 80);
  return deals.find((deal) => deal.title === title);
}

export function intentRowsFromLive(intents: Intent[], deals: Deal[]): IntentListRow[] {
  return intents.map((intent) => {
    const deal = dealForIntent(intent, deals);
    const needs = deal?.status === "Needs you";
    return {
      id: intent.id,
      title: intent.summary,
      last: needs
        ? "A match is waiting. Nothing is charged on this screen."
        : "Searching. BotBuyer spends only with your OK.",
      chip: needs ? "Needs you" : "Searching",
      href: `/intent/${intent.id}`,
    };
  });
}

export function intentThreadFromLive(
  intent: Intent,
  intents: Intent[],
  deals: Deal[],
): IntentThreadModel {
  const deal = dealForIntent(intent, deals);
  const needs = Boolean(deal && deal.status === "Needs you" && deal.priceUsd > 0);
  const listing =
    needs && deal
      ? {
          title: deal.title,
          amount: quietAmount(deal),
          example: !deal.priceVerified,
          imported:
            deal.source === "imported" || deal.amountStatus === "imported_unverified",
        }
      : undefined;
  const rows = intentRowsFromLive(intents, deals);
  const turns: IntentThreadModel["turns"] = [
    { kind: "note", who: "you", text: intent.summary },
    {
      kind: "note",
      who: "agent",
      text: listing
        ? "Found one match. Amounts are unverified. Auto-approve is off."
        : "Searching. Amounts stay unverified. Auto-approve is off. Nothing is charged on this screen.",
      listing,
    },
  ];
  if (needs && deal) {
    turns.push({
      kind: "decision",
      ask: INTENT_ASK_DECISION,
      dealId: deal.id,
    });
  }
  return {
    id: intent.id,
    title: intent.summary,
    example: false,
    side: rows.map((row) => ({
      id: row.id,
      title: row.title,
      last: row.last,
      href: row.href,
    })),
    turns,
  };
}
