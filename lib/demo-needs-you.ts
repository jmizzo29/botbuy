import { DEMO_USER } from "@/lib/auth";
import type { Deal, DealEvent } from "@/lib/types";

/** Demo-only candidate so My deals can show Approve + Reject. Not ledger history. */
export const DEMO_NEEDS_YOU_ID = "deal_demo_needs_you" as const;

/** Listed on the QA fixture only — never CFO pending, burn, or GMV. */
export const DEMO_NEEDS_YOU_LISTED_USD = 420;

export function isDemoQaFixture(deal: Pick<Deal, "id">) {
  return deal.id === DEMO_NEEDS_YOU_ID;
}

/** Engine / deal_demo_* QA fixtures. Not imported ledger history. */
export function isNonLedgerDemoSeed(deal: Pick<Deal, "id" | "source">) {
  return (
    isDemoQaFixture(deal) ||
    deal.source === "engine" ||
    deal.id.startsWith("deal_demo_")
  );
}

/** My deals may show fixtures. Owner imported/pending must not. */
export function countsTowardCfoMoney(deal: Pick<Deal, "id" | "source">) {
  return !isNonLedgerDemoSeed(deal);
}

export function demoPendingListedUsd(
  deals: Pick<Deal, "id" | "source" | "priceUsd">[],
) {
  return (
    Math.round(
      deals
        .filter(isNonLedgerDemoSeed)
        .reduce((sum, deal) => sum + deal.priceUsd, 0) * 100,
    ) / 100
  );
}

export const DEMO_NEEDS_YOU_DEAL: Deal = {
  id: DEMO_NEEDS_YOU_ID,
  userId: DEMO_USER.id,
  title: "Invoice tools license",
  category: "software",
  marketplace: "any_channel",
  status: "Needs you",
  priceUsd: DEMO_NEEDS_YOU_LISTED_USD,
  currency: "USD",
  openedAt: "2026-09-11T16:00:00Z",
  closedAt: null,
  parentDealId: null,
  receipt: null,
  escrow: null,
  domainTransfer: null,
  blockers: [],
  notes: "Demo candidate. Not live. Amount pending verify. Auto-approve OFF.",
  source: "engine",
  agentExecuted: false,
  priceVerified: false,
  amountVerified: false,
  amountStatus: "pending_verify",
  evidencePath: null,
  verification: {
    passed: false,
    skipped_reason: null,
    artifacts: [],
    receipt_refs: {},
  },
  timeline: [
    {
      id: "ev_demo_needs_you_found",
      stage: "diligence",
      title: "Found",
      detail: "Demo listing. Waiting for your approval.",
      at: "2026-09-11T16:10:00Z",
      status: "done",
    },
    {
      id: "ev_demo_needs_you_gate",
      stage: "gate",
      title: "Needs you",
      detail: "BotBuy only runs what you approve.",
      at: "2026-09-11T16:12:00Z",
      status: "blocked",
    },
  ],
};

export const DEMO_NEEDS_YOU_EVENTS: DealEvent[] = [
  {
    id: "evt_demo_needs_you_open",
    dealId: DEMO_NEEDS_YOU_ID,
    type: "search",
    stage: "search",
    title: "Opened",
    detail: "Demo candidate deal. Not a live purchase.",
    at: "2026-09-11T16:00:00Z",
    status: "done",
    actor: "engine",
  },
  {
    id: "evt_demo_needs_you_gate",
    dealId: DEMO_NEEDS_YOU_ID,
    type: "gate",
    stage: "gate",
    title: "Needs you",
    detail: "Human gate. Auto-approve OFF.",
    at: "2026-09-11T16:12:00Z",
    status: "blocked",
    actor: "engine",
    fromStatus: "Found",
    toStatus: "Needs you",
  },
];
