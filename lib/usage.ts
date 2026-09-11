import type {
  Deal,
  UsageDayRollup,
  UsageEvent,
  UsageTokensEst,
  UsageUserRollup,
  User,
} from "@/lib/types";

export const USAGE_DEMO_BADGE = "Demo · not live";
export const USAGE_ESTIMATE_LABEL = "Estimate";
export const USAGE_HOLD_NOTE =
  "Estimate until CHO promote. Demo · not live · not billed. Never Actual $.";

export const ADMIN_USAGE_MICRO =
  "Platform aggregate across all licensed users. Sum of runs / model_calls / tool_calls / tokens_est. No $ / user. Demo · Estimate. Never Actual $.";

export const SETTINGS_USAGE_MICRO =
  "This account only. Demo · Estimate. Never Actual $.";

/** Synthetic search-phase stub. Labeled Estimate / Demo — not billed. */
export const SEARCH_USAGE_STUB = {
  modelCalls: 1,
  toolCalls: 1,
  tokensEst: { input: 400, output: 80, total: 480 },
  provider: "unknown",
  model: "unknown",
} as const;

export function runIdForDeal(dealId: string) {
  return `run_${dealId}`;
}

export function searchingUsageEventId(dealId: string) {
  return `usage_${dealId}_${runIdForDeal(dealId)}_search`;
}

export function assertUsageNeverActual(event: UsageEvent) {
  if (event.costKind !== "estimate" || event.billed !== false || event.live !== false) {
    throw new Error(
      "CHO BLOCK: usage rows stay Estimate / Demo / not billed until CHO promote. Never Actual $.",
    );
  }
}

export function buildSearchingUsageStub(
  deal: Deal,
  at = deal.openedAt,
): UsageEvent {
  const event: UsageEvent = {
    id: searchingUsageEventId(deal.id),
    dealId: deal.id,
    runId: runIdForDeal(deal.id),
    phase: "search",
    stage: "search",
    modelCalls: SEARCH_USAGE_STUB.modelCalls,
    toolCalls: SEARCH_USAGE_STUB.toolCalls,
    tokensEst: { ...SEARCH_USAGE_STUB.tokensEst },
    provider: SEARCH_USAGE_STUB.provider,
    model: SEARCH_USAGE_STUB.model,
    startedAt: at,
    endedAt: at,
    status: "ok",
    costKind: "estimate",
    billed: false,
    live: false,
  };
  assertUsageNeverActual(event);
  return event;
}

export function sumTokensEst(events: UsageEvent[]): UsageTokensEst {
  let input = 0;
  let output = 0;
  let total = 0;
  let hasInput = false;
  let hasOutput = false;
  let hasTotal = false;
  for (const event of events) {
    if (event.tokensEst.input != null) {
      input += event.tokensEst.input;
      hasInput = true;
    }
    if (event.tokensEst.output != null) {
      output += event.tokensEst.output;
      hasOutput = true;
    }
    if (event.tokensEst.total != null) {
      total += event.tokensEst.total;
      hasTotal = true;
    }
  }
  return {
    input: hasInput ? input : null,
    output: hasOutput ? output : null,
    total: hasTotal ? total : null,
  };
}

export function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export function rollupUsageByDay(events: UsageEvent[]): UsageDayRollup[] {
  const byDay = new Map<string, UsageEvent[]>();
  for (const event of events) {
    assertUsageNeverActual(event);
    const key = dayKey(event.startedAt);
    const list = byDay.get(key) ?? [];
    list.push(event);
    byDay.set(key, list);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([day, rows]) => ({
      day,
      runs: new Set(rows.map((row) => row.runId)).size,
      modelCalls: rows.reduce((sum, row) => sum + row.modelCalls, 0),
      toolCalls: rows.reduce((sum, row) => sum + row.toolCalls, 0),
      tokensEst: sumTokensEst(rows),
      costKind: "estimate" as const,
    }));
}

export function rollupUsageTotals(events: UsageEvent[]) {
  for (const event of events) assertUsageNeverActual(event);
  return {
    runs: new Set(events.map((event) => event.runId)).size,
    modelCalls: events.reduce((sum, event) => sum + event.modelCalls, 0),
    toolCalls: events.reduce((sum, event) => sum + event.toolCalls, 0),
    tokensEst: sumTokensEst(events),
  };
}

/** Admin-only. One row per licensed user that has metered events. */
export function rollupUsageByUser(
  events: UsageEvent[],
  deals: Deal[],
  users: User[],
): UsageUserRollup[] {
  for (const event of events) assertUsageNeverActual(event);
  const userByDeal = new Map(deals.map((deal) => [deal.id, deal.userId]));
  const nameByUser = new Map(users.map((user) => [user.id, user.name]));
  const byUser = new Map<string, UsageEvent[]>();
  for (const event of events) {
    const userId = userByDeal.get(event.dealId);
    if (!userId) continue;
    const list = byUser.get(userId) ?? [];
    list.push(event);
    byUser.set(userId, list);
  }
  return [...byUser.entries()]
    .map(([userId, rows]) => ({
      userId,
      name: nameByUser.get(userId) ?? userId,
      ...rollupUsageTotals(rows),
      costKind: "estimate" as const,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function formatTokensEst(value: number | null) {
  if (value == null) return "—";
  return `${formatCount(value)} est`;
}
