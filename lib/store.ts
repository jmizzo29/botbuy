import { loadLedgerDeals, seedDealEvents } from "@/lib/ledger";
import { SEED_OWNER } from "@/lib/auth-owner";
import { listPersistedUsers } from "@/lib/db/users";
import { listMemoryUsers, rememberDirectoryUser } from "@/lib/user-directory";
import {
  DEMO_NEEDS_YOU_DEAL,
  DEMO_NEEDS_YOU_EVENTS,
  DEMO_NEEDS_YOU_ID,
  countsTowardCfoMoney,
} from "@/lib/demo-needs-you";
import { isVerifiedAmount } from "@/lib/deal-ui";
import "@/lib/adapters";
import {
  mergeJournals,
  readDurableJournal,
  writeDurableJournal,
  type EngineJournal,
} from "@/lib/engine-journal";
import { JOHN_INTENT_TEMPLATES } from "@/lib/intent-templates";
import {
  assertRunDealSoftHold,
  isEngineRunDealId,
  RUN_SEARCHING_DEAL_ID,
  runDealFromIntent,
  seedRunDealEvents,
} from "@/lib/run-deal";
import {
  SPEND_DEFAULTS,
  SPEND_HARD_GATE_USD,
  clampSpendUsd,
} from "@/lib/spend-policy";
import { assertTransition, TransitionError } from "@/lib/status-engine";
import {
  assertUsageNeverActual,
  buildSearchingUsageStub,
} from "@/lib/usage";
import type {
  AuditLog,
  Deal,
  DealEvent,
  DealStatus,
  Intent,
  SpendLimits,
  UsageEvent,
  User,
  VaultRef,
} from "@/lib/types";

const ledgerDeals = loadLedgerDeals();

const ledgerEvents: DealEvent[] = ledgerDeals.flatMap((deal) =>
  seedDealEvents(deal),
);

type EngineMemory = EngineJournal & { hydrated: boolean };

const engineMemory: EngineMemory = {
  deals: [],
  events: [],
  usage: [],
  hydrated: false,
};

function engineState(): EngineMemory {
  const globalStore = globalThis as typeof globalThis & {
    __botbuyEngine?: EngineMemory;
  };
  if (!globalStore.__botbuyEngine) {
    globalStore.__botbuyEngine = engineMemory;
  }
  if (!globalStore.__botbuyEngine.usage) {
    globalStore.__botbuyEngine.usage = [];
  }
  return globalStore.__botbuyEngine;
}

function allDeals(): Deal[] {
  const engine = engineState();
  return [...engine.deals, ...ledgerDeals];
}

function allEvents(): DealEvent[] {
  return [...ledgerEvents, ...engineState().events];
}

function replaceEngine(journal: EngineJournal) {
  const engine = engineState();
  engine.deals = journal.deals.filter((deal) => deal.source === "engine");
  engine.events = journal.events;
  engine.usage = journal.usage ?? [];
  engine.hydrated = true;
}

function rememberUsage(event: UsageEvent) {
  assertUsageNeverActual(event);
  const engine = engineState();
  engine.usage = [
    ...engine.usage.filter((row) => row.id !== event.id),
    event,
  ];
}

export function listUsageEvents(dealId?: string): UsageEvent[] {
  return engineState()
    .usage.filter((row) => (dealId ? row.dealId === dealId : true))
    .slice()
    .sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt));
}

export function ensureSearchingUsageStub(deal: Deal): UsageEvent {
  const existing = listUsageEvents(deal.id).find(
    (row) => row.phase === "search" && row.dealId === deal.id,
  );
  if (existing) {
    assertUsageNeverActual(existing);
    return existing;
  }
  const event = buildSearchingUsageStub(deal);
  rememberUsage(event);
  return event;
}

function ensureEngineUsageStubs() {
  for (const deal of engineState().deals) {
    if (deal.status === "Searching" || isEngineRunDealId(deal.id)) {
      ensureSearchingUsageStub(deal);
    }
  }
}

function ensureDemoNeedsYou() {
  const engine = engineState();
  if (engine.deals.some((deal) => deal.id === DEMO_NEEDS_YOU_ID)) return;
  if (ledgerDeals.some((deal) => deal.id === DEMO_NEEDS_YOU_ID)) return;
  rememberEngineDeal(
    structuredClone(DEMO_NEEDS_YOU_DEAL),
    structuredClone(DEMO_NEEDS_YOU_EVENTS),
  );
}

export async function hydrateStore() {
  const engine = engineState();
  const durable = await readDurableJournal();
  replaceEngine(
    mergeJournals(
      { deals: engine.deals, events: engine.events, usage: engine.usage },
      durable,
    ),
  );
  ensureDemoNeedsYou();
  ensureEngineUsageStubs();
  const persisted = await listPersistedUsers();
  if (persisted) {
    for (const user of persisted) rememberDirectoryUser(user);
  }
}

export async function persistEngineStore() {
  const engine = engineState();
  await writeDurableJournal({
    deals: engine.deals,
    events: engine.events,
    usage: engine.usage ?? [],
  });
}

function rememberEngineDeal(deal: Deal, events: DealEvent[]) {
  const engine = engineState();
  engine.deals = [deal, ...engine.deals.filter((row) => row.id !== deal.id)];
  const eventIds = new Set(events.map((event) => event.id));
  engine.events = [
    ...engine.events.filter((event) => !eventIds.has(event.id)),
    ...events,
  ];
}

function openSearchingEngineDeal(userId = SEED_OWNER.id) {
  return engineState().deals.find(
    (deal) => deal.status === "Searching" && deal.userId === userId,
  );
}

function materializeRunDeal(
  id = RUN_SEARCHING_DEAL_ID,
  userId = SEED_OWNER.id,
): Deal {
  const existing =
    engineState().deals.find(
      (deal) => deal.id === id && deal.userId === userId,
    ) ??
    engineState().deals.find(
      (deal) => deal.status === "Searching" && deal.userId === userId,
    );
  if (existing) {
    assertRunDealSoftHold(existing);
    ensureSearchingUsageStub(existing);
    return existing;
  }
  const deal = runDealFromIntent(listIntents(userId)[0], id, userId);
  assertRunDealSoftHold(deal);
  rememberEngineDeal(deal, seedRunDealEvents(deal));
  ensureSearchingUsageStub(deal);
  return deal;
}

const intents: Intent[] = [
  {
    id: "intent_software",
    userId: SEED_OWNER.id,
    summary: JOHN_INTENT_TEMPLATES[0].summary,
    categories: [...JOHN_INTENT_TEMPLATES[0].categories],
    maxPriceUsd: SPEND_HARD_GATE_USD,
    status: "active",
    createdAt: "2026-09-04T18:00:00Z",
  },
  {
    id: "intent_software_domain",
    userId: SEED_OWNER.id,
    summary: JOHN_INTENT_TEMPLATES.find((item) => item.id === "software_domain")
      ?.summary ?? JOHN_INTENT_TEMPLATES[0].summary,
    categories: ["software", "domain"],
    maxPriceUsd: SPEND_HARD_GATE_USD,
    status: "active",
    createdAt: "2026-09-05T12:00:00Z",
  },
  {
    id: "intent_product_domain",
    userId: SEED_OWNER.id,
    summary: "Secure the BotBuyer product domain (botbuyer.ai) on a multi-year term.",
    categories: ["domain"],
    maxPriceUsd: 250,
    status: "fulfilled",
    createdAt: "2026-09-11T14:00:00Z",
  },
];

function defaultSpendLimits(userId: string): SpendLimits {
  return {
    userId,
    hardGateUsd: SPEND_HARD_GATE_USD,
    dailyLimitUsd: SPEND_DEFAULTS.dailyLimitUsd,
    weeklyLimitUsd: SPEND_DEFAULTS.weeklyLimitUsd,
    monthlyLimitUsd: SPEND_DEFAULTS.monthlyLimitUsd,
    perDealLimitUsd: SPEND_DEFAULTS.perDealLimitUsd,
    autoApprove: false,
    updatedAt: "2026-09-04T18:00:00Z",
  };
}

const spendByUser = new Map<string, SpendLimits>([
  [SEED_OWNER.id, defaultSpendLimits(SEED_OWNER.id)],
]);

const vaultRefs: VaultRef[] = [
  {
    id: "vault_bsl_primary",
    userId: SEED_OWNER.id,
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
    userId: SEED_OWNER.id,
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
    userId: SEED_OWNER.id,
    action: "deal.imported",
    entityType: "deal",
    entityId: "deal_savedfast",
    metadata: {
      source: "john-deal-ledger.json",
      escrow_id: "13190302",
      escrow_stage: "seller-proceeds-processing",
      amount_status: "imported_unverified",
      amount_verified: false,
      price_verified: false,
      source_flag: "imported",
      agent_executed: false,
      personal_closed: true,
    },
    createdAt: "2026-09-11T14:28:00Z",
  },
  {
    id: "aud_import_xfer",
    userId: SEED_OWNER.id,
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
      source_flag: "imported",
      agent_executed: false,
      personal_closed: true,
    },
    createdAt: "2026-09-11T14:28:00Z",
  },
  {
    id: "aud_limits_seed",
    userId: SEED_OWNER.id,
    action: "spend.limits_seeded",
    entityType: "spend_limits",
    entityId: SEED_OWNER.id,
    metadata: {
      hardGateUsd: SPEND_HARD_GATE_USD,
      autoApprove: false,
      note: "Spend-out hard gate $1000. Every deal needs John. Fail-closed.",
    },
    createdAt: "2026-09-04T18:00:00Z",
  },
];

export async function createSearchingDealFromRun(
  userId = SEED_OWNER.id,
  email?: string | null,
): Promise<Deal> {
  await hydrateStore();
  const reused = openSearchingEngineDeal(userId);
  if (reused) {
    assertRunDealSoftHold(reused);
    ensureSearchingUsageStub(reused);
    await persistEngineStore();
    return reused;
  }

  const intent = listIntents(userId)[0];
  const id =
    userId === SEED_OWNER.id &&
    !engineState().deals.some((row) => row.id === RUN_SEARCHING_DEAL_ID)
      ? RUN_SEARCHING_DEAL_ID
      : `deal_run_${crypto.randomUUID().slice(0, 8)}`;
  const deal = runDealFromIntent(intent, id, userId);
  assertRunDealSoftHold(deal);
  rememberEngineDeal(deal, seedRunDealEvents(deal, email));
  ensureSearchingUsageStub(deal);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    action: "deal.opened_from_run",
    entityType: "deal",
    entityId: deal.id,
    metadata: {
      status: "Searching",
      intentId: intent?.id ?? null,
      email: email ?? null,
      reused: false,
    },
    createdAt: deal.openedAt,
  });
  await persistEngineStore();
  return deal;
}

export async function createSearchingDealFromIntent(
  intent: Intent,
  userId = SEED_OWNER.id,
  email?: string | null,
): Promise<Deal> {
  await hydrateStore();
  const title = intent.summary.slice(0, 80);
  const existing = engineState().deals.find(
    (deal) =>
      deal.userId === userId &&
      deal.status === "Searching" &&
      deal.title === title,
  );
  if (existing) {
    assertRunDealSoftHold(existing);
    ensureSearchingUsageStub(existing);
    await persistEngineStore();
    return existing;
  }

  const id = `deal_run_${crypto.randomUUID().slice(0, 8)}`;
  const deal = runDealFromIntent(intent, id, userId);
  assertRunDealSoftHold(deal);
  rememberEngineDeal(deal, seedRunDealEvents(deal, email));
  ensureSearchingUsageStub(deal);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    action: "deal.opened_from_intent",
    entityType: "deal",
    entityId: deal.id,
    metadata: {
      status: "Searching",
      intentId: intent.id,
      email: email ?? null,
      templateId: intent.templateId ?? null,
    },
    createdAt: deal.openedAt,
  });
  await persistEngineStore();
  return deal;
}

export function listDirectoryUsers(): User[] {
  return listMemoryUsers();
}

export function listAllDeals(): Deal[] {
  return allDeals().slice();
}

export function listDeals(userId = SEED_OWNER.id): Deal[] {
  return allDeals()
    .filter((deal) => deal.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
}

export function getDeal(
  id: string,
  userId = SEED_OWNER.id,
  asAdmin = false,
): Deal | undefined {
  const found = allDeals().find((deal) => {
    if (deal.id !== id) return false;
    return asAdmin || deal.userId === userId;
  });
  if (found) return found;
  if (isEngineRunDealId(id)) {
    const deal = materializeRunDeal(id, userId);
    return asAdmin || deal.userId === userId ? deal : undefined;
  }
  return undefined;
}

export function appendDealEvent(
  event: Omit<DealEvent, "id"> & { id?: string },
): DealEvent {
  const row: DealEvent = {
    ...event,
    actor: event.actor ?? "engine",
    id: event.id ?? `evt_${crypto.randomUUID()}`,
  };
  const engine = engineState();
  engine.events.push(row);
  return row;
}

export function listDealEvents(dealId: string): DealEvent[] {
  return allEvents()
    .filter((event) => event.dealId === dealId)
    .slice()
    .sort((a, b) => +new Date(a.at) - +new Date(b.at));
}

export function transitionDeal(
  id: string,
  to: DealStatus,
  userId = SEED_OWNER.id,
  asAdmin = false,
): Deal {
  const deal = getDeal(id, userId, asAdmin);
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
  if (deal.source === "engine") {
    rememberEngineDeal(deal, []);
    void persistEngineStore();
  }
  return deal;
}

export function listIntents(userId = SEED_OWNER.id): Intent[] {
  return intents
    .filter((intent) => intent.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addIntent(
  input: Omit<Intent, "id" | "userId" | "createdAt" | "status"> & {
    status?: Intent["status"];
  },
  userId = SEED_OWNER.id,
): Intent {
  const intent: Intent = {
    id: `intent_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    createdAt: new Date().toISOString(),
    status: input.status ?? "active",
    summary: input.summary,
    categories: input.categories,
    maxPriceUsd: clampSpendUsd(input.maxPriceUsd),
    templateId: input.templateId ?? null,
    mustInclude: input.mustInclude ?? null,
    avoid: input.avoid ?? null,
  };
  intents.unshift(intent);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    action: "intent.created",
    entityType: "intent",
    entityId: intent.id,
    metadata: { summary: intent.summary, maxPriceUsd: intent.maxPriceUsd },
    createdAt: intent.createdAt,
  });
  return intent;
}

export function getSpendLimits(userId = SEED_OWNER.id): SpendLimits {
  const existing = spendByUser.get(userId);
  if (existing) return existing;
  const created = defaultSpendLimits(userId);
  spendByUser.set(userId, created);
  return created;
}

export function updateSpendLimits(
  patch: Partial<Omit<SpendLimits, "userId" | "autoApprove" | "hardGateUsd">>,
  userId = SEED_OWNER.id,
): SpendLimits {
  const current = getSpendLimits(userId);
  const working = clampSpendUsd(
    patch.perDealLimitUsd ??
      patch.dailyLimitUsd ??
      patch.monthlyLimitUsd ??
      patch.weeklyLimitUsd ??
      current.perDealLimitUsd,
  );
  const next: SpendLimits = {
    userId,
    hardGateUsd: SPEND_HARD_GATE_USD,
    dailyLimitUsd: working,
    weeklyLimitUsd: working,
    monthlyLimitUsd: working,
    perDealLimitUsd: working,
    autoApprove: false,
    updatedAt: new Date().toISOString(),
  };
  spendByUser.set(userId, next);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    action: "spend.limits_updated",
    entityType: "spend_limits",
    entityId: userId,
    metadata: {
      hardGateUsd: SPEND_HARD_GATE_USD,
      workingCapUsd: working,
      autoApprove: false,
    },
    createdAt: next.updatedAt,
  });
  return next;
}

export function listVaultRefs(userId = SEED_OWNER.id): VaultRef[] {
  return vaultRefs.filter((ref) => ref.userId === userId);
}

export function recordAuditLog(
  entry: Omit<AuditLog, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): AuditLog {
  const row: AuditLog = {
    id: entry.id ?? `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: entry.userId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    metadata: entry.metadata ?? {},
    createdAt: entry.createdAt ?? new Date().toISOString(),
  };
  auditLogs.unshift(row);
  return row;
}

export function listAuditLogs(userId = SEED_OWNER.id): AuditLog[] {
  return auditLogs
    .filter((log) => log.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function isVerifiedSpend(deal: Deal) {
  return isVerifiedAmount(deal);
}

export function verifiedSpendUsd(userId = SEED_OWNER.id): number {
  return listDeals(userId)
    .filter(countsTowardCfoMoney)
    .filter(isVerifiedSpend)
    .reduce((sum, deal) => sum + deal.priceUsd, 0);
}

export function listedUnverifiedUsd(userId = SEED_OWNER.id): number {
  return listDeals(userId)
    .filter(countsTowardCfoMoney)
    .filter((deal) => !isVerifiedSpend(deal))
    .reduce((sum, deal) => sum + deal.priceUsd, 0);
}

/** @deprecated unverified listed amounts are not spend */
export function spendInFlight(userId = SEED_OWNER.id): number {
  return verifiedSpendUsd(userId);
}

export function autoApproveAllowed() {
  return false;
}
