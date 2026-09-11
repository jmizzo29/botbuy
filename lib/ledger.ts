import ledgerJson from "@/data/john-deal-ledger.json";
import type {
  AgentEvent,
  AmountStatus,
  Deal,
  DealStatus,
} from "@/lib/types";

type RawDeal = (typeof ledgerJson.deals)[number];

function asStatus(value: string): DealStatus {
  const allowed: DealStatus[] = [
    "Searching",
    "Found",
    "Buying",
    "Needs you",
    "Closing",
    "Closed",
    "Failed",
    "Paused",
  ];
  if (allowed.includes(value as DealStatus)) return value as DealStatus;
  return "Paused";
}

function timelineFor(deal: RawDeal): AgentEvent[] {
  if (deal.id === "deal_botbuyer_ai") {
    return [
      {
        id: "ev_botbuyer_search",
        stage: "search",
        title: "Search",
        detail: "Namecheap scan for botbuyer.ai — board-approved product domain.",
        at: "2026-09-11T14:22:00Z",
        status: "done",
      },
      {
        id: "ev_botbuyer_diligence",
        stage: "diligence",
        title: "Diligence",
        detail: "Availability and 2-year term confirmed. Brand: botbuyer.ai.",
        at: "2026-09-11T14:23:00Z",
        status: "done",
      },
      {
        id: "ev_botbuyer_purchase",
        stage: "purchase",
        title: "Purchase",
        detail: "Namecheap order 213804743 · $179.96 · account johnmitchellbsl.",
        at: "2026-09-11T14:24:00Z",
        status: "done",
      },
      {
        id: "ev_botbuyer_close",
        stage: "close",
        title: "Close",
        detail: "Domain registered. Amount pending receipt verify (CHO).",
        at: "2026-09-11T14:26:00Z",
        status: "done",
      },
    ];
  }

  if (deal.id === "deal_savedfast") {
    return [
      {
        id: "ev_savedfast_search",
        stage: "search",
        title: "Search",
        detail: "Flippa listing 12890562 — Savedfast Online Tools (savedfast.com).",
        at: "2026-09-05T00:00:00Z",
        status: "done",
      },
      {
        id: "ev_savedfast_diligence",
        stage: "diligence",
        title: "Diligence",
        detail: "Micro-acq review. AdSense account carved out of sale (accepted).",
        at: "2026-09-06T12:00:00Z",
        status: "done",
      },
      {
        id: "ev_savedfast_purchase",
        stage: "purchase",
        title: "Purchase",
        detail: "Escrow.com 13190302 funded at $405.",
        at: "2026-09-08T16:00:00Z",
        status: "done",
      },
      {
        id: "ev_savedfast_gate",
        stage: "gate",
        title: "Needs you",
        detail:
          "WordPress wp-login/wp-admin still LiteSpeed 403. Do not mark Escrow received until domain control + WP verified.",
        at: "2026-09-11T14:06:00Z",
        status: "blocked",
      },
      {
        id: "ev_savedfast_close",
        stage: "close",
        title: "Closing",
        detail: "Domain transfer / waiting WP + registrar transfer.",
        at: "2026-09-11T14:06:00Z",
        status: "active",
      },
    ];
  }

  if (deal.id === "deal_namecheap_savedfast_xfer") {
    return [
      {
        id: "ev_xfer_purchase",
        stage: "purchase",
        title: "Purchase",
        detail: "Namecheap order 213803826 · txn 259699130 · 1 year inbound transfer · $11.68.",
        at: "2026-09-11T14:06:00Z",
        status: "done",
      },
      {
        id: "ev_xfer_close",
        stage: "close",
        title: "Closing",
        detail: "Transfer In — will begin shortly. Tied to Savedfast acquisition.",
        at: "2026-09-11T14:06:00Z",
        status: "active",
      },
    ];
  }

  return [];
}

function mapDeal(deal: RawDeal): Deal {
  return {
    id: deal.id,
    userId: ledgerJson.customer.id,
    title: deal.title,
    category: deal.category,
    marketplace: deal.marketplace,
    status: asStatus(deal.status),
    priceUsd: deal.price_usd,
    currency: deal.currency,
    openedAt: deal.opened_at,
    closedAt: deal.closed_at,
    parentDealId: "parent_deal_id" in deal ? (deal.parent_deal_id ?? null) : null,
    receipt: "receipt" in deal ? (deal.receipt ?? null) : null,
    escrow: "escrow" in deal ? (deal.escrow ?? null) : null,
    domainTransfer:
      "domain_transfer" in deal ? (deal.domain_transfer ?? null) : null,
    blockers: "blockers" in deal ? [...(deal.blockers ?? [])] : [],
    notes: deal.notes,
    source: deal.source,
    agentExecuted: deal.agent_executed,
    priceVerified: deal.price_verified,
    amountStatus: deal.amount_status as AmountStatus,
    timeline: timelineFor(deal),
  };
}

export const ledgerMeta = {
  customer: ledgerJson.customer,
  proofStripPolicy: ledgerJson.proof_strip_policy,
  updatedAt: ledgerJson.updated_at,
  choReview: ledgerJson.cho_review,
};

export function loadLedgerDeals(): Deal[] {
  return ledgerJson.deals.map(mapDeal);
}

export function getLedgerDeal(id: string): Deal | undefined {
  return loadLedgerDeals().find((deal) => deal.id === id);
}
