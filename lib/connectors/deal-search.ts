import {
  connectorResultHasCandidates,
  routeIntentToSearch,
} from "@/lib/connectors/intent-route";
import { invokeConnectorTool } from "@/lib/connectors/runtime";
import {
  assertNoSecretsLogged,
  sanitizeAuditMetadata,
} from "@/lib/connectors/sanitize";
import type { ConnectorToolResult } from "@/lib/connectors/types";
import { assertRunDealSoftHold } from "@/lib/run-deal";
import {
  appendDealEvent,
  getDeal,
  listDealEvents,
  persistEngineStore,
  recordAuditLog,
  transitionDeal,
} from "@/lib/store";
import type { Deal, Intent } from "@/lib/types";

export const CONNECTOR_SEARCH_EVENT_SUFFIX = "_connector_search" as const;

export function connectorSearchEventId(dealId: string) {
  return `evt_${dealId}_connector_search`;
}

export function connectorQuoteEventId(dealId: string) {
  return `evt_${dealId}_connector_quote`;
}

export function dealHasConnectorSearchAttempt(
  dealId: string,
  events = listDealEvents(dealId),
) {
  return events.some((event) => event.id === connectorSearchEventId(dealId));
}

function compactDetail(parts: Record<string, unknown>) {
  const clean = sanitizeAuditMetadata(parts);
  assertNoSecretsLogged(clean);
  return Object.entries(clean)
    .map(([key, value]) =>
      `${key}=${typeof value === "string" ? value : JSON.stringify(value)}`,
    )
    .join(" · ");
}

function firstCandidateDomain(result: ConnectorToolResult): string | null {
  const data = result.data ?? {};
  if (typeof data.domain === "string" && data.available === true) {
    return data.domain;
  }
  const candidates = data.candidates;
  if (!Array.isArray(candidates)) return null;
  for (const row of candidates) {
    if (!row || typeof row !== "object") continue;
    const domain = (row as { domain?: unknown }).domain;
    if (typeof domain === "string" && domain) return domain;
  }
  return null;
}

function attachTimeline(
  deal: Deal,
  title: string,
  detail: string,
  at: string,
  id: string,
) {
  if (deal.timeline.some((item) => item.id === id)) return;
  deal.timeline = [
    ...deal.timeline,
    {
      id,
      stage: "search",
      title,
      detail,
      at,
      status: "done",
    },
  ];
}

function appendSearchNote(deal: Deal, line: string) {
  if (deal.notes.includes(line)) return;
  deal.notes = `${deal.notes} ${line}`.trim();
}

function failedSearchStub(
  provider: "namecheap" | "twilio",
  dealId: string,
): ConnectorToolResult {
  return {
    ok: false,
    live: false,
    provider,
    tool: "search",
    dealId,
    result: "error",
    reason: "Connector search failed closed. Honest stub. Not live.",
    data: { available: null, amountStatus: "unverified", candidates: [] },
  };
}

/**
 * After a Searching deal opens, attempt a mapped connector search (or an
 * honest unmapped stub). Search/quote only — never register/buy.
 */
export async function applyDealSearchPipeline(input: {
  deal: Deal;
  userId: string;
  intent?: Pick<
    Intent,
    "summary" | "categories" | "mustInclude" | "avoid"
  > | null;
}): Promise<Deal> {
  const deal = getDeal(input.deal.id, input.userId) ?? input.deal;
  if (dealHasConnectorSearchAttempt(deal.id)) {
    assertRunDealSoftHold(deal);
    return deal;
  }

  const route = routeIntentToSearch({
    summary: input.intent?.summary ?? deal.title,
    categories: input.intent?.categories ?? [deal.category],
    mustInclude: input.intent?.mustInclude,
    avoid: input.intent?.avoid,
    category: deal.category,
  });

  const at = new Date().toISOString();
  let searchResult: ConnectorToolResult | null = null;

  if (route.provider) {
    try {
      searchResult = await invokeConnectorTool({
        userId: input.userId,
        provider: route.provider,
        tool: "search",
        dealId: deal.id,
        payload: {
          query: route.query || undefined,
          domain: route.domain ?? undefined,
          country: route.country,
        },
      });
    } catch {
      searchResult = failedSearchStub(route.provider, deal.id);
    }
  }

  const detail = searchResult
    ? `live:false · ${compactDetail({
        provider: searchResult.provider,
        tool: "search",
        result: searchResult.result,
        reason: searchResult.reason,
        query: route.query || route.domain || "",
        available: searchResult.data?.available ?? null,
        candidates: Array.isArray(searchResult.data?.candidates)
          ? (searchResult.data?.candidates as unknown[]).length
          : 0,
        amountStatus: searchResult.data?.amountStatus ?? "unverified",
        mapped: route.reason,
      })}`
    : `live:false · ${compactDetail({
        provider: "none",
        tool: "search",
        result: "stub",
        reason: route.reason,
        query: route.query,
        available: null,
        candidates: 0,
        amountStatus: "unverified",
      })}`;

  appendDealEvent({
    id: connectorSearchEventId(deal.id),
    dealId: deal.id,
    type: "search",
    stage: "search",
    title: route.provider ? "Connector search" : "Search stub",
    detail,
    at,
    status: "done",
    actor: "engine",
    toStatus: deal.status,
  });
  attachTimeline(
    deal,
    route.provider ? "Connector search" : "Search stub",
    detail,
    at,
    `ev_${deal.id}_connector_search`,
  );
  appendSearchNote(
    deal,
    route.provider
      ? `Connector search · ${searchResult?.provider} · ${searchResult?.result ?? "stub"} · live:false · amountStatus=unverified.`
      : "Search stub · no mapped connector · live:false · no invented results.",
  );

  if (!searchResult) {
    recordAuditLog({
      userId: input.userId,
      action: "deal.search_stub",
      entityType: "deal",
      entityId: deal.id,
      metadata: sanitizeAuditMetadata({
        live: false,
        result: "stub",
        reason: route.reason,
      }),
    });
    assertRunDealSoftHold(deal);
    await persistEngineStore();
    return deal;
  }

  if (
    route.provider === "namecheap" &&
    connectorResultHasCandidates(searchResult.data)
  ) {
    const domain = firstCandidateDomain(searchResult);
    if (domain) {
      const quote = await invokeConnectorTool({
        userId: input.userId,
        provider: "namecheap",
        tool: "quote",
        dealId: deal.id,
        payload: { domain, query: domain },
      });
      const quoteAt = new Date().toISOString();
      const quoteDetail = `live:false · ${compactDetail({
        provider: "namecheap",
        tool: "quote",
        result: quote.result,
        reason: quote.reason,
        domain,
        listedUsd: quote.data?.listedUsd ?? null,
        amountStatus: quote.data?.amountStatus ?? "unverified",
        verified: false,
      })}`;
      appendDealEvent({
        id: connectorQuoteEventId(deal.id),
        dealId: deal.id,
        type: "note",
        stage: "diligence",
        title: "Connector quote",
        detail: quoteDetail,
        at: quoteAt,
        status: "done",
        actor: "engine",
      });
      attachTimeline(
        deal,
        "Connector quote",
        quoteDetail,
        quoteAt,
        `ev_${deal.id}_connector_quote`,
      );
      appendSearchNote(
        deal,
        `Namecheap quote stub · listedUsd=${String(quote.data?.listedUsd ?? "null")} · unverified · not a verified price.`,
      );
    }
  }

  if (
    connectorResultHasCandidates(searchResult.data) &&
    deal.status === "Searching"
  ) {
    const next = transitionDeal(deal.id, "Found", input.userId);
    appendSearchNote(
      next,
      "Candidates found · Found · human review · not bought · auto-approve OFF.",
    );
    assertRunDealSoftHold(next);
    await persistEngineStore();
    return next;
  }

  assertRunDealSoftHold(deal);
  await persistEngineStore();
  return deal;
}
