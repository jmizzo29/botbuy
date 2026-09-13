import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  dealEvents,
  deals,
  intents as intentsTable,
  usageEvents,
  users,
} from "@/lib/db/schema";
import type { EngineJournal } from "@/lib/engine-journal";
import type {
  AgentEvent,
  AgentEventStatus,
  AgentStage,
  AmountStatus,
  Deal,
  DealEvent,
  DealEventActor,
  DealEventType,
  DealStatus,
  DealVerification,
  Intent,
  UsageCostKind,
  UsageEvent,
  UsagePhase,
  UsageStatus,
} from "@/lib/types";

const ENGINE_EXTRAS_KEY = "_engine";

type EngineExtras = {
  timeline: AgentEvent[];
  eventMetadata: Record<string, Record<string, unknown>>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toIso(value: Date | string | null | undefined, fallback?: string) {
  if (!value) return fallback ?? new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(+date)) return fallback ?? new Date().toISOString();
  return date.toISOString();
}

function toNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function packVerification(deal: Deal, events: DealEvent[]): DealVerification & {
  [ENGINE_EXTRAS_KEY]: EngineExtras;
} {
  const eventMetadata: Record<string, Record<string, unknown>> = {};
  for (const event of events) {
    if (event.dealId === deal.id && event.metadata) {
      eventMetadata[event.id] = event.metadata;
    }
  }
  return {
    ...deal.verification,
    [ENGINE_EXTRAS_KEY]: {
      timeline: deal.timeline ?? [],
      eventMetadata,
    },
  };
}

function unpackVerification(raw: unknown): {
  verification: DealVerification;
  extras: EngineExtras;
} {
  const record = asRecord(raw) ?? {};
  const packed = asRecord(record[ENGINE_EXTRAS_KEY]);
  const timeline = Array.isArray(packed?.timeline)
    ? (packed.timeline as AgentEvent[])
    : [];
  const eventMetadata = asRecord(packed?.eventMetadata) as
    | Record<string, Record<string, unknown>>
    | undefined;
  return {
    verification: {
      passed: Boolean(record.passed),
      skipped_reason:
        record.skipped_reason === "imported_ledger" ? "imported_ledger" : null,
      artifacts: Array.isArray(record.artifacts)
        ? (record.artifacts as string[])
        : [],
      receipt_refs:
        asRecord(record.receipt_refs) as Record<string, string> | undefined ??
        {},
    },
    extras: {
      timeline,
      eventMetadata: eventMetadata ?? {},
    },
  };
}

function timelineFromEvents(dealId: string, events: DealEvent[]): AgentEvent[] {
  return events
    .filter((event) => event.dealId === dealId)
    .map((event) => ({
      id: event.id.startsWith("evt_")
        ? event.id.replace(/^evt_/, "ev_")
        : event.id,
      stage: (event.stage ?? "search") as AgentStage,
      title: event.title,
      detail: event.detail,
      at: event.at,
      status: event.status,
    }));
}

async function ensureUserRow(
  db: NonNullable<ReturnType<typeof getDb>>,
  userId: string,
) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (existing[0]) return;
  const token = userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || "buyer";
  try {
    await db.insert(users).values({
      id: userId,
      email: `engine+${token}@users.noreply.botbuyer.ai`,
      name: "Buyer",
      role: "customer",
    });
  } catch {
    // Unique email or race — deal write still requires the users row.
  }
}

function dealToRow(deal: Deal, events: DealEvent[]) {
  return {
    id: deal.id,
    userId: deal.userId,
    title: deal.title,
    category: deal.category,
    marketplace: deal.marketplace,
    status: deal.status,
    priceUsd: deal.priceUsd.toFixed(2),
    currency: deal.currency,
    openedAt: new Date(deal.openedAt),
    closedAt: deal.closedAt ? new Date(deal.closedAt) : null,
    parentDealId: deal.parentDealId,
    receipt: deal.receipt,
    escrow: deal.escrow,
    domainTransfer: deal.domainTransfer,
    blockers: deal.blockers,
    notes: deal.notes,
    source: deal.source || "engine",
    agentExecuted: deal.agentExecuted,
    priceVerified: deal.priceVerified,
    amountVerified: deal.amountVerified,
    amountStatus: deal.amountStatus,
    evidencePath: deal.evidencePath,
    verification: packVerification(deal, events),
    updatedAt: new Date(),
  };
}

function rowToDeal(
  row: typeof deals.$inferSelect,
  events: DealEvent[],
): Deal {
  const { verification, extras } = unpackVerification(row.verification);
  const timeline =
    extras.timeline.length > 0
      ? extras.timeline
      : timelineFromEvents(row.id, events);
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    category: row.category,
    marketplace: row.marketplace,
    status: row.status as DealStatus,
    priceUsd: toNumber(row.priceUsd),
    currency: row.currency,
    openedAt: toIso(row.openedAt),
    closedAt: row.closedAt ? toIso(row.closedAt) : null,
    parentDealId: row.parentDealId,
    receipt: (row.receipt as Deal["receipt"]) ?? null,
    escrow: (row.escrow as Deal["escrow"]) ?? null,
    domainTransfer: (row.domainTransfer as Deal["domainTransfer"]) ?? null,
    blockers: Array.isArray(row.blockers) ? row.blockers : [],
    notes: row.notes ?? "",
    source: row.source,
    agentExecuted: row.agentExecuted,
    priceVerified: row.priceVerified,
    amountVerified: row.amountVerified,
    amountStatus: row.amountStatus as AmountStatus,
    evidencePath: row.evidencePath,
    verification,
    timeline,
  };
}

function eventToRow(event: DealEvent) {
  return {
    id: event.id,
    dealId: event.dealId,
    type: event.type,
    stage: event.stage ?? null,
    title: event.title,
    detail: event.detail,
    at: new Date(event.at),
    status: event.status,
    fromStatus: event.fromStatus ?? null,
    toStatus: event.toStatus ?? null,
    actor: event.actor,
  };
}

function rowToEvent(
  row: typeof dealEvents.$inferSelect,
  metadata?: Record<string, unknown>,
): DealEvent {
  return {
    id: row.id,
    dealId: row.dealId,
    type: row.type as DealEventType,
    stage: (row.stage as AgentStage | null) ?? undefined,
    title: row.title,
    detail: row.detail,
    at: toIso(row.at),
    status: row.status as AgentEventStatus,
    actor: (row.actor as DealEventActor) ?? "engine",
    fromStatus: (row.fromStatus as DealStatus | null) ?? null,
    toStatus: (row.toStatus as DealStatus | null) ?? null,
    metadata,
  };
}

function usageToRow(event: UsageEvent) {
  return {
    id: event.id,
    dealId: event.dealId,
    runId: event.runId,
    phase: event.phase,
    stage: event.stage,
    modelCalls: event.modelCalls,
    toolCalls: event.toolCalls,
    tokensEstInput: event.tokensEst.input,
    tokensEstOutput: event.tokensEst.output,
    tokensEstTotal: event.tokensEst.total,
    provider: event.provider,
    model: event.model,
    startedAt: new Date(event.startedAt),
    endedAt: event.endedAt ? new Date(event.endedAt) : null,
    status: event.status,
    costKind: "estimate" as UsageCostKind,
    billed: false,
    live: false,
  };
}

function rowToUsage(row: typeof usageEvents.$inferSelect): UsageEvent {
  return {
    id: row.id,
    dealId: row.dealId,
    runId: row.runId,
    phase: row.phase as UsagePhase,
    stage: row.stage as UsagePhase,
    modelCalls: row.modelCalls,
    toolCalls: row.toolCalls,
    tokensEst: {
      input: row.tokensEstInput,
      output: row.tokensEstOutput,
      total: row.tokensEstTotal,
    },
    provider: row.provider,
    model: row.model,
    startedAt: toIso(row.startedAt),
    endedAt: toIso(row.endedAt, toIso(row.startedAt)),
    status: row.status as UsageStatus,
    costKind: "estimate",
    billed: false,
    live: false,
  };
}

function intentToRow(intent: Intent) {
  return {
    id: intent.id,
    userId: intent.userId,
    summary: intent.summary,
    categories: intent.categories,
    maxPriceUsd: intent.maxPriceUsd.toFixed(2),
    status: intent.status,
    templateId: intent.templateId ?? null,
    mustInclude: intent.mustInclude ?? null,
    avoid: intent.avoid ?? null,
    createdAt: new Date(intent.createdAt),
  };
}

function rowToIntent(row: typeof intentsTable.$inferSelect): Intent {
  return {
    id: row.id,
    userId: row.userId,
    summary: row.summary,
    categories: Array.isArray(row.categories) ? row.categories : [],
    maxPriceUsd: toNumber(row.maxPriceUsd),
    status: row.status as Intent["status"],
    createdAt: toIso(row.createdAt),
    templateId: row.templateId,
    mustInclude: row.mustInclude,
    avoid: row.avoid,
  };
}

export function isNeonEngineConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function readNeonJournal(): Promise<EngineJournal | null> {
  const db = getDb();
  if (!db) return null;
  const dealRows = await db
    .select()
    .from(deals)
    .where(eq(deals.source, "engine"));
  const dealIds = dealRows.map((row) => row.id);
  const eventRows = dealIds.length
    ? await db
        .select()
        .from(dealEvents)
        .where(inArray(dealEvents.dealId, dealIds))
    : [];
  const usageRows = await db.select().from(usageEvents);
  const intentRows = await db.select().from(intentsTable);

  const extrasByDeal = new Map(
    dealRows.map((row) => [row.id, unpackVerification(row.verification).extras]),
  );
  const events = eventRows.map((row) =>
    rowToEvent(row, extrasByDeal.get(row.dealId)?.eventMetadata[row.id]),
  );
  return {
    deals: dealRows.map((row) => rowToDeal(row, events)),
    events,
    usage: usageRows.map(rowToUsage),
    intents: intentRows.map(rowToIntent),
  };
}

export async function writeNeonJournal(journal: EngineJournal): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const engineDeals = journal.deals.filter((deal) => deal.source === "engine");
  const userIds = new Set<string>();
  for (const deal of engineDeals) userIds.add(deal.userId);
  for (const intent of journal.intents ?? []) userIds.add(intent.userId);
  for (const userId of userIds) {
    await ensureUserRow(db, userId);
  }

  for (const deal of engineDeals) {
    const row = dealToRow(deal, journal.events);
    await db
      .insert(deals)
      .values(row)
      .onConflictDoUpdate({
        target: deals.id,
        set: {
          title: row.title,
          category: row.category,
          marketplace: row.marketplace,
          status: row.status,
          priceUsd: row.priceUsd,
          currency: row.currency,
          openedAt: row.openedAt,
          closedAt: row.closedAt,
          parentDealId: row.parentDealId,
          receipt: row.receipt,
          escrow: row.escrow,
          domainTransfer: row.domainTransfer,
          blockers: row.blockers,
          notes: row.notes,
          source: row.source,
          agentExecuted: row.agentExecuted,
          priceVerified: row.priceVerified,
          amountVerified: row.amountVerified,
          amountStatus: row.amountStatus,
          evidencePath: row.evidencePath,
          verification: row.verification,
          updatedAt: row.updatedAt,
        },
      });
  }

  if (journal.events.length) {
    await db
      .insert(dealEvents)
      .values(journal.events.map(eventToRow))
      .onConflictDoNothing();
  }

  for (const event of journal.usage ?? []) {
    const row = usageToRow(event);
    await db
      .insert(usageEvents)
      .values(row)
      .onConflictDoUpdate({
        target: usageEvents.id,
        set: {
          dealId: row.dealId,
          runId: row.runId,
          phase: row.phase,
          stage: row.stage,
          modelCalls: row.modelCalls,
          toolCalls: row.toolCalls,
          tokensEstInput: row.tokensEstInput,
          tokensEstOutput: row.tokensEstOutput,
          tokensEstTotal: row.tokensEstTotal,
          provider: row.provider,
          model: row.model,
          startedAt: row.startedAt,
          endedAt: row.endedAt,
          status: row.status,
          costKind: "estimate",
          billed: false,
          live: false,
        },
      });
  }

  for (const intent of journal.intents ?? []) {
    const row = intentToRow(intent);
    await db
      .insert(intentsTable)
      .values(row)
      .onConflictDoUpdate({
        target: intentsTable.id,
        set: {
          userId: row.userId,
          summary: row.summary,
          categories: row.categories,
          maxPriceUsd: row.maxPriceUsd,
          status: row.status,
          templateId: row.templateId,
          mustInclude: row.mustInclude,
          avoid: row.avoid,
        },
      });
  }

  return true;
}
