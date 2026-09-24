import { neon } from "@neondatabase/serverless";
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditLogs, dealEvents, deals, intents, users } from "@/lib/db/schema";
import type {
  AgentEventStatus,
  AgentStage,
  AmountStatus,
  Deal,
  DealEvent,
  DealStatus,
  Intent,
} from "@/lib/types";

function databaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("Database is not connected.");
  return url;
}

async function ensureHuntTables() {
  const sql = neon(databaseUrl());
  await sql`
    CREATE TABLE IF NOT EXISTS intents (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id),
      summary text NOT NULL,
      categories jsonb NOT NULL DEFAULT '[]'::jsonb,
      max_price_usd numeric(12, 2) NOT NULL,
      status text NOT NULL DEFAULT 'active',
      template_id text,
      must_include text,
      avoid text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deals (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id),
      title text NOT NULL,
      category text NOT NULL,
      marketplace text NOT NULL,
      status text NOT NULL,
      price_usd numeric(12, 2) NOT NULL,
      currency text NOT NULL DEFAULT 'USD',
      opened_at timestamptz NOT NULL,
      closed_at timestamptz,
      parent_deal_id text,
      receipt jsonb,
      escrow jsonb,
      domain_transfer jsonb,
      blockers jsonb DEFAULT '[]'::jsonb,
      notes text,
      source text NOT NULL DEFAULT 'imported',
      agent_executed boolean NOT NULL DEFAULT false,
      price_verified boolean NOT NULL DEFAULT false,
      amount_verified boolean NOT NULL DEFAULT false,
      amount_status text NOT NULL DEFAULT 'imported_unverified',
      evidence_path text,
      verification jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id),
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id text NOT NULL,
      metadata jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_events (
      id text PRIMARY KEY,
      deal_id text NOT NULL REFERENCES deals(id),
      type text NOT NULL,
      stage text,
      title text NOT NULL,
      detail text NOT NULL,
      at timestamptz NOT NULL,
      status text NOT NULL,
      from_status text,
      to_status text,
      actor text NOT NULL DEFAULT 'imported'
    )
  `;
}

function money(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function stamp(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function explainHuntSaveError(error: unknown) {
  const raw = error instanceof Error ? error.message : "";
  if (/not connected/i.test(raw)) return "The database is not connected.";
  if (/does not exist/i.test(raw) || /relation/i.test(raw)) {
    return "The database is missing the hunts tables.";
  }
  if (/users/i.test(raw) && /foreign key|violates/i.test(raw)) {
    return "Your account is not in the database yet.";
  }
  return "Could not save the hunt.";
}

export async function saveOpenedHunt(
  intent: Intent,
  deal: Deal,
  events: DealEvent[],
) {
  const db = getDb();
  // In-memory journal is the store until DATABASE_URL is set. Do not fail
  // a search that already landed in that journal.
  if (!db) return;
  await ensureHuntTables();
  await db
    .insert(intents)
    .values({
      id: intent.id,
      userId: intent.userId,
      summary: intent.summary,
      categories: intent.categories,
      maxPriceUsd: money(intent.maxPriceUsd),
      status: intent.status,
      templateId: intent.templateId ?? null,
      mustInclude: intent.mustInclude ?? null,
      avoid: intent.avoid ?? null,
      createdAt: stamp(intent.createdAt) ?? new Date(),
    })
    .onConflictDoNothing();
  await db
    .insert(deals)
    .values({
      id: deal.id,
      userId: deal.userId,
      title: deal.title,
      category: deal.category,
      marketplace: deal.marketplace,
      status: deal.status,
      priceUsd: money(deal.priceUsd),
      currency: deal.currency || "USD",
      openedAt: stamp(deal.openedAt) ?? new Date(),
      closedAt: stamp(deal.closedAt),
      parentDealId: deal.parentDealId,
      receipt: deal.receipt,
      escrow: deal.escrow,
      domainTransfer: deal.domainTransfer,
      blockers: deal.blockers,
      notes: deal.notes,
      source: deal.source,
      agentExecuted: deal.agentExecuted,
      priceVerified: deal.priceVerified,
      amountVerified: deal.amountVerified,
      amountStatus: deal.amountStatus,
      evidencePath: deal.evidencePath,
      verification: deal.verification,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: deals.id,
      set: {
        title: deal.title,
        status: deal.status,
        marketplace: deal.marketplace,
        notes: deal.notes,
        blockers: deal.blockers,
        updatedAt: new Date(),
      },
    });
  for (const event of events) {
    await saveHuntEvent(event);
  }
}

export async function saveHuntEvent(event: DealEvent) {
  const db = getDb();
  if (!db) return;
  await ensureHuntTables();
  await db
    .insert(dealEvents)
    .values({
      id: event.id,
      dealId: event.dealId,
      type: event.type,
      stage: event.stage ?? null,
      title: event.title,
      detail: event.detail,
      at: stamp(event.at) ?? new Date(),
      status: event.status,
      fromStatus: event.fromStatus ?? null,
      toStatus: event.toStatus ?? null,
      actor: event.actor,
    })
    .onConflictDoNothing();
}

export async function saveIngestedCandidate(input: {
  ownerUserId: string;
  deal: Deal;
  event: DealEvent | null;
  audit: {
    id: string;
    action: string;
    metadata: Record<string, unknown>;
  };
}) {
  await ensureHuntTables();
  const db = getDb();
  if (!db) throw new Error("Database is not connected.");
  const [owner] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, input.ownerUserId))
    .limit(1);
  if (!owner) throw new Error("Owner account is not in the database yet.");

  const [existing] = await db
    .select()
    .from(deals)
    .where(eq(deals.id, input.deal.id))
    .limit(1);
  if (existing && existing.userId !== input.ownerUserId) {
    throw new Error("That listing is already stored for another account.");
  }

  const workflowStatus =
    existing && existing.status !== "Needs you" ? existing.status : "Needs you";
  const previousPrice = existing ? Number(existing.priceUsd) : null;
  const previousStatus = existing?.notes?.match(/listing_status=([a-z_]+)/)?.[1] ?? null;
  const nextStatus = input.deal.notes.match(/listing_status=([a-z_]+)/)?.[1] ?? null;
  const changed =
    !existing ||
    previousPrice !== input.deal.priceUsd ||
    previousStatus !== nextStatus;

  await db
    .insert(deals)
    .values({
      id: input.deal.id,
      userId: input.ownerUserId,
      title: input.deal.title,
      category: input.deal.category,
      marketplace: input.deal.marketplace,
      status: workflowStatus,
      priceUsd: money(input.deal.priceUsd),
      currency: "USD",
      openedAt: stamp(input.deal.openedAt) ?? new Date(),
      closedAt: null,
      parentDealId: null,
      receipt: null,
      escrow: null,
      domainTransfer: null,
      blockers: input.deal.blockers,
      notes: input.deal.notes,
      source: "imported",
      agentExecuted: false,
      priceVerified: false,
      amountVerified: false,
      amountStatus: "imported_unverified",
      evidencePath: input.deal.evidencePath,
      verification: input.deal.verification,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: deals.id,
      set: {
        title: input.deal.title,
        marketplace: input.deal.marketplace,
        status: workflowStatus,
        priceUsd: money(input.deal.priceUsd),
        notes: input.deal.notes,
        blockers: input.deal.blockers,
        source: "imported",
        agentExecuted: false,
        priceVerified: false,
        amountVerified: false,
        amountStatus: "imported_unverified",
        evidencePath: input.deal.evidencePath,
        updatedAt: new Date(),
      },
    });

  if (changed && input.event) {
    await saveHuntEvent({ ...input.event, toStatus: workflowStatus as DealStatus });
  }

  await db.insert(auditLogs).values({
    id: input.audit.id,
    userId: input.ownerUserId,
    action: input.audit.action,
    entityType: "deal",
    entityId: input.deal.id,
    metadata: input.audit.metadata,
    createdAt: new Date(),
  });

  return {
    created: !existing,
    changed,
    status: workflowStatus,
    priceUsd: input.deal.priceUsd,
  };
}

function asStatus(value: string): DealStatus {
  const allowed = [
    "Searching",
    "Found",
    "Buying",
    "Needs you",
    "Closing",
    "Closed",
    "Failed",
    "Paused",
  ] as const;
  return (allowed as readonly string[]).includes(value)
    ? (value as DealStatus)
    : "Searching";
}

export async function loadUserHunts(userId: string): Promise<{
  deals: Deal[];
  events: DealEvent[];
  intents: Intent[];
} | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const intentRows = await db
      .select()
      .from(intents)
      .where(eq(intents.userId, userId));
    const dealRows = await db.select().from(deals).where(eq(deals.userId, userId));
    const ids = dealRows.map((row) => row.id);
    const eventRows = ids.length
      ? await db.select().from(dealEvents).where(inArray(dealEvents.dealId, ids))
      : [];
    const events: DealEvent[] = eventRows.map((row) => ({
      id: row.id,
      dealId: row.dealId,
      type: row.type as DealEvent["type"],
      stage: (row.stage as AgentStage | null) ?? undefined,
      title: row.title,
      detail: row.detail,
      at: (stamp(row.at) ?? new Date()).toISOString(),
      status: row.status as AgentEventStatus,
      actor: row.actor as DealEvent["actor"],
      fromStatus: (row.fromStatus as DealStatus | null) ?? null,
      toStatus: (row.toStatus as DealStatus | null) ?? null,
    }));
    return {
      intents: intentRows.map((row) => ({
        id: row.id,
        userId: row.userId,
        summary: row.summary,
        categories: row.categories ?? [],
        maxPriceUsd: Number(row.maxPriceUsd),
        status: (row.status as Intent["status"]) || "active",
        createdAt: (stamp(row.createdAt) ?? new Date()).toISOString(),
        templateId: row.templateId,
        mustInclude: row.mustInclude,
        avoid: row.avoid,
      })),
      events,
      deals: dealRows.map((row) => {
        const timeline = events
          .filter((event) => event.dealId === row.id)
          .map((event) => ({
            id: event.id,
            stage: event.stage ?? "search",
            title: event.title,
            detail: event.detail,
            at: event.at,
            status: event.status,
          }));
        return {
          id: row.id,
          userId: row.userId,
          title: row.title,
          category: row.category,
          marketplace: row.marketplace,
          status: asStatus(row.status),
          priceUsd: Number(row.priceUsd),
          currency: row.currency,
          openedAt: (stamp(row.openedAt) ?? new Date()).toISOString(),
          closedAt: stamp(row.closedAt)?.toISOString() ?? null,
          parentDealId: row.parentDealId,
          receipt: (row.receipt as Deal["receipt"]) ?? null,
          escrow: (row.escrow as Deal["escrow"]) ?? null,
          domainTransfer: (row.domainTransfer as Deal["domainTransfer"]) ?? null,
          blockers: row.blockers ?? [],
          notes: row.notes ?? "",
          source: row.source,
          agentExecuted: row.agentExecuted,
          priceVerified: row.priceVerified,
          amountVerified: row.amountVerified,
          amountStatus: row.amountStatus as AmountStatus,
          evidencePath: row.evidencePath,
          verification: (row.verification as Deal["verification"] | null) ?? {
            passed: false,
            skipped_reason: null,
            artifacts: [],
            receipt_refs: {},
          },
          timeline,
        } satisfies Deal;
      }),
    };
  } catch {
    return null;
  }
}
