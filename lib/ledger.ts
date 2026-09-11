import ledgerJson from "@/data/john-deal-ledger.json";
import { importedClosedVerification } from "@/lib/verification";
import type {
  AgentEvent,
  AmountStatus,
  Deal,
  DealEvent,
  DealStatus,
  DealVerification,
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

function verificationFor(deal: RawDeal): DealVerification {
  const receipt_refs: Record<string, string> = {};
  if ("receipt" in deal && deal.receipt) {
    receipt_refs.merchant = deal.receipt.merchant;
    receipt_refs.order_id = deal.receipt.order_id;
    if (deal.receipt.txn_id) receipt_refs.txn_id = deal.receipt.txn_id;
  }
  if ("escrow" in deal && deal.escrow) {
    receipt_refs.escrow_provider = deal.escrow.provider;
    receipt_refs.escrow_transaction_id = deal.escrow.transaction_id;
  }

  if (deal.status === "Closed" && deal.source === "imported") {
    return importedClosedVerification(receipt_refs);
  }

  return {
    passed: false,
    skipped_reason: null,
    artifacts: [],
    receipt_refs,
  };
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
        detail:
          "Namecheap order 213804743 · amount pending verify · account johnmitchellbsl.",
        at: "2026-09-11T14:24:00Z",
        status: "done",
      },
      {
        id: "ev_botbuyer_close",
        stage: "close",
        title: "Close",
        detail:
          "Imported as Closed. verification.skipped_reason=imported_ledger. Amount is not verified spend.",
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
        detail: "Escrow.com 13190302 · imported · amount unverified.",
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
        detail:
          "Domain transfer / waiting WP + registrar transfer. Closed is blocked until verification artifacts.",
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
        detail:
          "Namecheap order 213803826 · txn 259699130 · 1 year inbound transfer · imported · amount unverified.",
        at: "2026-09-11T14:06:00Z",
        status: "done",
      },
      {
        id: "ev_xfer_close",
        stage: "close",
        title: "Closing",
        detail:
          "Transfer In — will begin shortly. Parent deal_savedfast. Closed blocked until transfer complete.",
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
    verification: verificationFor(deal),
    timeline: timelineFor(deal),
  };
}

export function seedDealEvents(deal: Deal): DealEvent[] {
  const events: DealEvent[] = [
    {
      id: `evt_${deal.id}_import`,
      dealId: deal.id,
      type: "import",
      title: "Imported ledger",
      detail: `source=imported · agent_executed=${deal.agentExecuted} · amount_status=${deal.amountStatus}`,
      at: deal.openedAt,
      status: "done",
      actor: "imported",
      toStatus: deal.status,
    },
  ];

  for (const item of deal.timeline) {
    events.push({
      id: item.id,
      dealId: deal.id,
      type: item.stage,
      stage: item.stage,
      title: item.title,
      detail: item.detail,
      at: item.at,
      status: item.status,
      actor: deal.agentExecuted ? "agent" : "reconstructed",
    });
  }

  return events;
}

export const ledgerMeta = {
  customer: ledgerJson.customer,
  proofStripPolicy: ledgerJson.proof_strip_policy,
  updatedAt: ledgerJson.updated_at,
  choReview: ledgerJson.cho_review,
};

export function loadLedgerDeals(): Deal[] {
  const deals = ledgerJson.deals.map(mapDeal);
  assertJohnLedger(deals);
  return deals;
}

function assertJohnLedger(deals: Deal[]) {
  const byId = Object.fromEntries(deals.map((deal) => [deal.id, deal]));
  const botbuyer = byId.deal_botbuyer_ai;
  const savedfast = byId.deal_savedfast;
  const xfer = byId.deal_namecheap_savedfast_xfer;

  if (!botbuyer || !savedfast || !xfer) {
    throw new Error("John ledger missing required customer #1 deals.");
  }
  if (botbuyer.source !== "imported" || botbuyer.agentExecuted) {
    throw new Error("deal_botbuyer_ai must be imported and not agent-executed.");
  }
  if (botbuyer.priceVerified || botbuyer.amountStatus !== "pending_verify") {
    throw new Error("deal_botbuyer_ai amount must stay pending_verify.");
  }
  if (botbuyer.status !== "Closed") {
    throw new Error("deal_botbuyer_ai status must be Closed.");
  }
  if (savedfast.status !== "Closing" || !savedfast.blockers.some((item) => item.includes("403"))) {
    throw new Error("deal_savedfast must stay Closing with WP 403 blocker.");
  }
  if (xfer.parentDealId !== "deal_savedfast" || xfer.status !== "Closing") {
    throw new Error("transfer fee must be Closing and parented to deal_savedfast.");
  }
}

export function getLedgerDeal(id: string): Deal | undefined {
  return loadLedgerDeals().find((deal) => deal.id === id);
}
