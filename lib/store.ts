import { loadLedgerDeals, seedDealEvents } from "@/lib/ledger";
import { DEMO_USER } from "@/lib/auth";
import {
  DEMO_NEEDS_YOU_DEAL,
  DEMO_NEEDS_YOU_EVENTS,
  DEMO_NEEDS_YOU_ID,
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

function openSearchingEngineDeal() {
  return engineState().deals.find((deal) => deal.status === "Searching");
}

function materializeRunDeal(id = RUN_SEARCHING_DEAL_ID): Deal {
  const existing =
    engineState().deals.find((deal) => deal.id === id) ??
    openSearchingEngineDeal() ??
    engineState().deals.find((deal) => deal.id === RUN_SEARCHING_DEAL_ID);
  if (existing) {
    assertRunDealSoftHold(existing);
    ensureSearchingUsageStub(existing);
    return existing;
  }
  const deal = runDealFromIntent(listIntents()[0], id);
  assertRunDealSoftHold(deal);
  rememberEngineDeal(deal, seedRunDealEvents(deal, getSignupSession()?.email));
  ensureSearchingUsageStub(deal);
  return deal;
}

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

export interface SignupSession {
  email: string;
  createdAt: string;
  poc: true;
}

let signupSession: SignupSession | null = null;

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
      source_flag: "imported",
      agent_executed: false,
      personal_closed: true,
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

export function persistSignup(email: string): SignupSession {
  const trimmed = email.trim();
  signupSession = {
    email: trimmed,
    createdAt: new Date().toISOString(),
    poc: true,
  };
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    action: "signup.persisted",
    entityType: "signup",
    entityId: DEMO_USER.id,
    metadata: { email: trimmed, poc: true, theater: false },
    createdAt: signupSession.createdAt,
  });
  return signupSession;
}

export function getSignupSession(): SignupSession | null {
  return signupSession;
}

export async function createSearchingDealFromRun(): Promise<Deal> {
  await hydrateStore();
  const reused = openSearchingEngineDeal();
  if (reused) {
    assertRunDealSoftHold(reused);
    ensureSearchingUsageStub(reused);
    await persistEngineStore();
    return reused;
  }

  const intent = listIntents()[0];
  const signup = getSignupSession();
  const id = engineState().deals.some((row) => row.id === RUN_SEARCHING_DEAL_ID)
    ? `deal_run_${crypto.randomUUID().slice(0, 8)}`
    : RUN_SEARCHING_DEAL_ID;
  const deal = runDealFromIntent(intent, id);
  assertRunDealSoftHold(deal);
  rememberEngineDeal(deal, seedRunDealEvents(deal, signup?.email));
  ensureSearchingUsageStub(deal);
  auditLogs.unshift({
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    userId: DEMO_USER.id,
    action: "deal.opened_from_run",
    entityType: "deal",
    entityId: deal.id,
    metadata: {
      status: "Searching",
      intentId: intent?.id ?? null,
      email: signup?.email ?? null,
      reused: false,
    },
    createdAt: deal.openedAt,
  });
  await persistEngineStore();
  return deal;
}

export function listDirectoryUsers(): User[] {
  return [DEMO_USER];
}

export function listDeals(userId = DEMO_USER.id): Deal[] {
  return allDeals()
    .filter((deal) => deal.userId === userId)
    .slice()
    .sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
}

export function getDeal(id: string, userId = DEMO_USER.id): Deal | undefined {
  const found = allDeals().find((deal) => deal.id === id && deal.userId === userId);
  if (found) return found;
  if (isEngineRunDealId(id)) {
    const deal = materializeRunDeal(
      engineState().deals.some((row) => row.id === RUN_SEARCHING_DEAL_ID)
        ? RUN_SEARCHING_DEAL_ID
        : id,
    );
    return deal.userId === userId ? deal : undefined;
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
  if (deal.source === "engine") {
    rememberEngineDeal(deal, []);
    void persistEngineStore();
  }
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
