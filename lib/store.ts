import { loadLedgerDeals } from "@/lib/ledger";
import { DEMO_USER } from "@/lib/auth";
import type { AuditLog, Deal, Intent, SpendLimits, VaultRef } from "@/lib/types";

const deals = loadLedgerDeals();

const intents: Intent[] = [
  {
    id: "intent_micro_saas",
    userId: DEMO_USER.id,
    summary: "Acquire a clean micro-SaaS or online tool under $500 with transferable domain.",
    categories: ["software", "domain"],
    maxPriceUsd: 500,
    status: "active",
    createdAt: "2026-09-04T18:00:00Z",
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
  dailyLimitUsd: 500,
  weeklyLimitUsd: 750,
  monthlyLimitUsd: 2000,
  perDealLimitUsd: 500,
  updatedAt: "2026-09-04T18:00:00Z",
};

const vaultRefs: VaultRef[] = [
  {
    id: "vault_bsl_primary",
    userId: DEMO_USER.id,
    provider: "stripe_setup_placeholder",
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
      amount_status: "pending_verify",
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
      monthlyLimitUsd: 2000,
      perDealLimitUsd: 500,
    },
    createdAt: "2026-09-04T18:00:00Z",
  },
];

export function listDeals(userId = DEMO_USER.id): Deal[] {
  return deals
    .filter((deal) => deal.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
}

export function getDeal(id: string, userId = DEMO_USER.id): Deal | undefined {
  return deals.find((deal) => deal.id === id && deal.userId === userId);
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
    maxPriceUsd: input.maxPriceUsd,
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
  patch: Partial<Omit<SpendLimits, "userId">>,
): SpendLimits {
  spendLimits = {
    ...spendLimits,
    ...patch,
    userId: DEMO_USER.id,
    updatedAt: new Date().toISOString(),
  };
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    action: "spend.limits_updated",
    entityType: "spend_limits",
    entityId: DEMO_USER.id,
    metadata: {
      dailyLimitUsd: spendLimits.dailyLimitUsd,
      weeklyLimitUsd: spendLimits.weeklyLimitUsd,
      monthlyLimitUsd: spendLimits.monthlyLimitUsd,
      perDealLimitUsd: spendLimits.perDealLimitUsd,
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

export function spendInFlight(userId = DEMO_USER.id): number {
  return listDeals(userId).reduce((sum, deal) => sum + deal.priceUsd, 0);
}
