import { loadLedgerDeals, seedDealEvents } from "@/lib/ledger";
import { DEMO_USER } from "@/lib/auth";
import { isVerifiedAmount } from "@/lib/deal-ui";
import "@/lib/adapters";
import { JOHN_INTENT_TEMPLATES } from "@/lib/intent-templates";
import {
  SPEND_DEFAULTS,
  SPEND_HARD_GATE_USD,
  clampSpendUsd,
} from "@/lib/spend-policy";
import { assertTransition, TransitionError } from "@/lib/status-engine";
import type {
  AuditLog,
  Deal,
  DealEvent,
  DealStatus,
  Intent,
  SpendLimits,
  User,
  VaultRef,
} from "@/lib/types";

const deals = loadLedgerDeals();

const dealEvents: DealEvent[] = deals.flatMap((deal) => seedDealEvents(deal));

const intents: Intent[] = [
  {
    id: "intent_software",
    userId: DEMO_USER.id,
    summary: JOHN_INTENT_TEMPLATES[0].summary,
    categories: [...JOHN_INTENT_TEMPLATES[0].categories],
    maxPriceUsd: JOHN_INTENT_TEMPLATES[0].maxPriceUsd,
    status: "active",
    createdAt: "2026-09-04T18:00:00Z",
  },
  {
    id: "intent_software_domain",
    userId: DEMO_USER.id,
    summary: JOHN_INTENT_TEMPLATES[1].summary,
    categories: [...JOHN_INTENT_TEMPLATES[1].categories],
    maxPriceUsd: JOHN_INTENT_TEMPLATES[1].maxPriceUsd,
    status: "active",
    createdAt: "2026-09-05T12:00:00Z",
  },
  {
    id: "intent_product_domain",
    userId: DEMO_USER.id,
    summary: "Secure the BotBuy product domain (botbuyer.ai) on a multi-year term.",
    categories: ["domain"],
    maxPriceUsd: 250,
    status: "fulfilled",
    createdAt: "2026-09-11T14:00:00Z",
  },
];

let spendLimits: SpendLimits = {
  userId: DEMO_USER.id,
  hardGateUsd: SPEND_HARD_GATE_USD,
  dailyLimitUsd: SPEND_DEFAULTS.dailyLimitUsd,
  weeklyLimitUsd: SPEND_DEFAULTS.weeklyLimitUsd,
  monthlyLimitUsd: SPEND_DEFAULTS.monthlyLimitUsd,
  perDealLimitUsd: SPEND_DEFAULTS.perDealLimitUsd,
  autoApprove: false,
  updatedAt: "2026-09-04T18:00:00Z",
};

const vaultRefs: VaultRef[] = [
  {
    id: "vault_bsl_primary",
    userId: DEMO_USER.id,
    provider: "vault_stub",
    vaultRef: "tok_vault_bsl_7f3a91c2",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2028,
    status: "active",
  },
];

const auditLogs: AuditLog[] = [
  {
    id: "aud_import_botbuyer",
    userId: DEMO_USER.id,
    action: "deal.imported",
    entityType: "deal",
    entityId: "deal_botbuyer_ai",
    metadata: {
      source: "john-deal-ledger.json",
      order_id: "213804743",
      txn_id: "259700262",
      amount_status: "verified",
      amount_verified: true,
      price_verified: true,
      source_flag: "imported",
      agent_executed: false,
      skipped_reason: "imported_ledger",
      evidence: "data/evidence/namecheap-213804743.json",
      cho: "PASS display $179.96 · not public proof",
    },
    createdAt: "2026-09-11T14:28:00Z",
  },
  {
    id: "aud_import_savedfast",
    userId: DEMO_USER.id,
    action: "deal.imported",
    entityType: "deal",
    entityId: "deal_savedfast",
    metadata: {
      source: "john-deal-ledger.json",
      escrow_id: "13190302",
      amount_status: "imported_unverified",
      amount_verified: false,
      price_verified: false,
    },
    createdAt: "2026-09-11T14:28:00Z",
  },
  {
    id: "aud_import_xfer",
    userId: DEMO_USER.id,
    action: "deal.imported",
    entityType: "deal",
    entityId: "deal_namecheap_savedfast_xfer",
    metadata: {
      source: "john-deal-ledger.json",
      order_id: "213803826",
      parent_deal_id: "deal_savedfast",
      amount_status: "imported_unverified",
      amount_verified: false,
      price_verified: false,
    },
    createdAt: "2026-09-11T14:28:00Z",
  },
  {
    id: "aud_limits_seed",
    userId: DEMO_USER.id,
    action: "spend.limits_seeded",
    entityType: "spend_limits",
    entityId: DEMO_USER.id,
    metadata: {
      hardGateUsd: SPEND_HARD_GATE_USD,
      autoApprove: false,
      note: "Spend-out hard gate $1000. Every deal needs John. Fail-closed.",
    },
    createdAt: "2026-09-04T18:00:00Z",
  },
];

export function listDirectoryUsers(): User[] {
  return [DEMO_USER];
}

export function listDeals(userId = DEMO_USER.id): Deal[] {
  return deals
    .filter((deal) => deal.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
}

export function getDeal(id: string, userId = DEMO_USER.id): Deal | undefined {
  return deals.find((deal) => deal.id === id && deal.userId === userId);
}

export function appendDealEvent(
  event: Omit<DealEvent, "id"> & { id?: string },
): DealEvent {
  const row: DealEvent = {
    ...event,
    actor: event.actor ?? "engine",
    id: event.id ?? `evt_${crypto.randomUUID()}`,
  };
  dealEvents.push(row);
  return row;
}

export function listDealEvents(dealId: string): DealEvent[] {
  return dealEvents
    .filter((event) => event.dealId === dealId)
    .slice()
    .sort((a, b) => +new Date(a.at) - +new Date(b.at));
}

export function transitionDeal(id: string, to: DealStatus): Deal {
  const deal = getDeal(id);
  if (!deal) {
    throw new TransitionError("Deal not found");
  }
  const check = assertTransition(deal, to);
  if (!check.ok) {
    throw new TransitionError(check.reason);
  }
  const from = deal.status;
  deal.status = to;
  if (to === "Closed") {
    deal.closedAt = new Date().toISOString();
  }
  const at = new Date().toISOString();
  appendDealEvent({
    dealId: deal.id,
    type: "status",
    title: `Status ${from} → ${to}`,
    detail: `Append-only deal_events. Engine accepted ${from} → ${to}.`,
    at,
    status: "done",
    actor: "engine",
    fromStatus: from,
    toStatus: to,
  });
  deal.timeline = [
    ...deal.timeline,
    {
      id: `ev_${deal.id}_${Date.now()}`,
      stage: to === "Closed" ? "close" : "gate",
      title: to,
      detail: `Status ${from} → ${to}`,
      at,
      status: "done",
    },
  ];
  return deal;
}

export function listIntents(userId = DEMO_USER.id): Intent[] {
  return intents
    .filter((intent) => intent.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addIntent(
  input: Omit<Intent, "id" | "userId" | "createdAt" | "status"> & {
    status?: Intent["status"];
  },
): Intent {
  const intent: Intent = {
    id: `intent_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    createdAt: new Date().toISOString(),
    status: input.status ?? "active",
    summary: input.summary,
    categories: input.categories,
    maxPriceUsd: clampSpendUsd(input.maxPriceUsd),
  };
  intents.unshift(intent);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    action: "intent.created",
    entityType: "intent",
    entityId: intent.id,
    metadata: { summary: intent.summary, maxPriceUsd: intent.maxPriceUsd },
    createdAt: intent.createdAt,
  });
  return intent;
}

export function getSpendLimits(userId = DEMO_USER.id): SpendLimits {
  return spendLimits.userId === userId
    ? spendLimits
    : { ...spendLimits, userId };
}

export function updateSpendLimits(
  patch: Partial<Omit<SpendLimits, "userId" | "autoApprove" | "hardGateUsd">>,
): SpendLimits {
  const working = clampSpendUsd(
    patch.perDealLimitUsd ??
      patch.dailyLimitUsd ??
      patch.monthlyLimitUsd ??
      patch.weeklyLimitUsd ??
      spendLimits.perDealLimitUsd,
  );
  spendLimits = {
    userId: DEMO_USER.id,
    hardGateUsd: SPEND_HARD_GATE_USD,
    dailyLimitUsd: working,
    weeklyLimitUsd: working,
    monthlyLimitUsd: working,
    perDealLimitUsd: working,
    autoApprove: false,
    updatedAt: new Date().toISOString(),
  };
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    action: "spend.limits_updated",
    entityType: "spend_limits",
    entityId: DEMO_USER.id,
    metadata: {
      hardGateUsd: SPEND_HARD_GATE_USD,
      workingCapUsd: working,
      autoApprove: false,
    },
    createdAt: spendLimits.updatedAt,
  });
  return spendLimits;
}

export function listVaultRefs(userId = DEMO_USER.id): VaultRef[] {
  return vaultRefs.filter((ref) => ref.userId === userId);
}

export function listAuditLogs(userId = DEMO_USER.id): AuditLog[] {
  return auditLogs
    .filter((log) => log.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function isVerifiedSpend(deal: Deal) {
  return isVerifiedAmount(deal);
}

export function verifiedSpendUsd(userId = DEMO_USER.id): number {
  return listDeals(userId)
    .filter(isVerifiedSpend)
    .reduce((sum, deal) => sum + deal.priceUsd, 0);
}

export function listedUnverifiedUsd(userId = DEMO_USER.id): number {
  return listDeals(userId)
    .filter((deal) => !isVerifiedSpend(deal))
    .reduce((sum, deal) => sum + deal.priceUsd, 0);
}

/** @deprecated unverified listed amounts are not spend */
export function spendInFlight(userId = DEMO_USER.id): number {
  return verifiedSpendUsd(userId);
}

export function autoApproveAllowed() {
  return false;
}
