import ledgerJson from "@/data/john-deal-ledger.json";
import {
  hasPersonalClosedHonestyFlags,
  isHonestPersonalClosedEscrow,
  isPublicProofEligible,
  isVerifiedAmount,
} from "@/lib/deal-ui";
import { importedClosedVerification } from "@/lib/verification";
import type {
  AgentEvent,
  AmountStatus,
  Deal,
  DealEvent,
  DealStatus,
  DealVerification,
  Receipt,
} from "@/lib/types";

type RawDeal = (typeof ledgerJson.deals)[number];

const BOTBUYER_EVIDENCE = "data/evidence/namecheap-213804743.json";
const BOTBUYER_ARTIFACTS = [
  BOTBUYER_EVIDENCE,
  "data/evidence/namecheap-213804743-receipt-1.png",
  "data/evidence/namecheap-213804743-receipt-2.png",
  "data/evidence/botbuyer.ai-rdap.json",
];

function toRepoEvidencePath(value: string | null | undefined): string | null {
  if (!value) return null;
  const marker = "data/evidence/";
  const index = value.lastIndexOf(marker);
  if (index >= 0) return value.slice(index);
  return value.startsWith("data/") ? value : value;
}

function rawFlag(deal: RawDeal, key: "amount_verified" | "price_verified"): boolean {
  return Boolean((deal as Record<string, unknown>)[key]);
}

function mapReceipt(deal: RawDeal): Receipt | null {
  if (!("receipt" in deal) || !deal.receipt) return null;
  const raw = deal.receipt as Record<string, unknown>;
  const txn =
    (typeof raw.txn_id === "string" && raw.txn_id) ||
    (typeof raw.transaction_id === "string" && raw.transaction_id) ||
    undefined;
  return {
    merchant: String(raw.merchant ?? ""),
    order_id: String(raw.order_id ?? ""),
    term: typeof raw.term === "string" ? raw.term : undefined,
    account: typeof raw.account === "string" ? raw.account : undefined,
    txn_id: txn || undefined,
    item: typeof raw.item === "string" ? raw.item : undefined,
    payment_method:
      typeof raw.payment_method === "string" ? raw.payment_method : undefined,
  };
}

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
  const receipt = mapReceipt(deal);
  if (receipt) {
    receipt_refs.merchant = receipt.merchant;
    receipt_refs.order_id = receipt.order_id;
    if (receipt.txn_id) receipt_refs.txn_id = receipt.txn_id;
  }
  if ("escrow" in deal && deal.escrow) {
    receipt_refs.escrow_provider = deal.escrow.provider;
    receipt_refs.escrow_transaction_id = deal.escrow.transaction_id;
  }

  if (deal.status === "Closed" && deal.source === "imported") {
    const seeded = importedClosedVerification(receipt_refs);
    if (deal.id === "deal_botbuyer_ai") {
      return {
        ...seeded,
        artifacts: BOTBUYER_ARTIFACTS,
      };
    }
    return seeded;
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
          "Namecheap order 213804743 · txn 259700262 · amount verified $179.96 · account johnmitchellbsl.",
        at: "2026-09-11T14:24:00Z",
        status: "done",
      },
      {
        id: "ev_botbuyer_close",
        stage: "close",
        title: "Close",
        detail:
          "Imported as Closed. verification.skipped_reason=imported_ledger. CHO PASS amount verified $179.96 (Namecheap 213804743 / txn 259700262). Not public proof.",
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
        title: "Closed",
        detail:
          "Personal Closed. source=imported · agent_executed=false · amount_status=imported_unverified · escrow=seller-proceeds-processing. $405 not price_verified. Not Escrow complete. Not GMV.",
        at: "2026-09-11T18:00:00Z",
        status: "done",
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
        title: "Closed",
        detail:
          "Personal Closed. Parent deal_savedfast. source=imported · agent_executed=false · amount_status=imported_unverified. $11.68 not price_verified. Not GMV.",
        at: "2026-09-11T18:00:00Z",
        status: "done",
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
    receipt: mapReceipt(deal),
    escrow: "escrow" in deal ? (deal.escrow ?? null) : null,
    domainTransfer:
      "domain_transfer" in deal ? (deal.domain_transfer ?? null) : null,
    blockers: "blockers" in deal ? [...(deal.blockers ?? [])] : [],
    notes: deal.notes,
    source: deal.source,
    agentExecuted: deal.agent_executed,
    priceVerified: rawFlag(deal, "price_verified"),
    amountVerified: rawFlag(deal, "amount_verified"),
    amountStatus: deal.amount_status as AmountStatus,
    evidencePath:
      "evidence" in deal && deal.evidence
        ? toRepoEvidencePath(deal.evidence.path)
        : null,
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
      detail: `source=${deal.source} · agent_executed=${deal.agentExecuted} · price_verified=${deal.priceVerified} · amount_status=${deal.amountStatus} · amount_verified=${deal.amountVerified}`,
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

/** Seed SoT: data/john-deal-ledger.json. Re-import on boot. */
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
  if (
    !botbuyer.amountVerified ||
    !botbuyer.priceVerified ||
    botbuyer.amountStatus !== "verified" ||
    botbuyer.priceUsd !== 179.96 ||
    botbuyer.evidencePath !== BOTBUYER_EVIDENCE
  ) {
    throw new Error("deal_botbuyer_ai amount must be verified $179.96.");
  }
  if (botbuyer.status !== "Closed") {
    throw new Error("deal_botbuyer_ai status must be Closed.");
  }
  if (!isVerifiedAmount(botbuyer) || isPublicProofEligible(botbuyer)) {
    throw new Error(
      "deal_botbuyer_ai must display verified $179.96 and stay out of public proof.",
    );
  }
  if (savedfast.status !== "Closed" || !hasPersonalClosedHonestyFlags(savedfast)) {
    throw new Error(
      "deal_savedfast must be personal Closed with imported + agent_executed=false + imported_unverified + price_verified=false.",
    );
  }
  if (!isHonestPersonalClosedEscrow(savedfast)) {
    throw new Error(
      "deal_savedfast escrow_stage must be accepted or seller-proceeds-processing (never Escrow complete).",
    );
  }
  if (isVerifiedAmount(savedfast) || isPublicProofEligible(savedfast)) {
    throw new Error("deal_savedfast $405 must stay imported_unverified and out of GMV/proof.");
  }
  if (xfer.parentDealId !== "deal_savedfast" || xfer.status !== "Closed") {
    throw new Error("transfer fee must be personal Closed and parented to deal_savedfast.");
  }
  if (!hasPersonalClosedHonestyFlags(xfer)) {
    throw new Error(
      "transfer fee must keep imported + agent_executed=false + imported_unverified + price_verified=false.",
    );
  }
  if (isVerifiedAmount(xfer) || isPublicProofEligible(xfer)) {
    throw new Error("transfer fee $11.68 must stay imported_unverified and out of GMV/proof.");
  }
}

export function getLedgerDeal(id: string): Deal | undefined {
  return loadLedgerDeals().find((deal) => deal.id === id);
}
