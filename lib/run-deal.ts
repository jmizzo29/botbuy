import { SEED_OWNER } from "@/lib/auth-owner";
import { isPublicProofEligible, isVerifiedAmount } from "@/lib/deal-ui";
import {
  inferIntentCategories,
  primaryDealCategory,
} from "@/lib/intent-categories";
import type { Deal, DealEvent, Intent } from "@/lib/types";

/** Stable go-live deal. Random deal_run_<uuid> IDs 404 after a new isolate. */
export const RUN_SEARCHING_DEAL_ID = "deal_run_searching";

export const ENGINE_RUN_PREFIX = "deal_run_";

export const RUN_DEAL_HOLD_NOTE =
  "Opened from go-live Run. Search stub · not a live agent purchase. HOLD.";

export function isEngineRunDealId(id: string) {
  return id.startsWith(ENGINE_RUN_PREFIX);
}

export function buildRunSearchingDeal(input: {
  id?: string;
  userId?: string;
  title: string;
  category: string;
  openedAt?: string;
  intentSummary?: string | null;
}): Deal {
  const now = input.openedAt ?? new Date().toISOString();
  const id = input.id ?? RUN_SEARCHING_DEAL_ID;
  return {
    id,
    userId: input.userId ?? SEED_OWNER.id,
    title: input.title.slice(0, 80) || "First BotBuyer search",
    category: primaryDealCategory(input.category ? [input.category] : []),
    marketplace: "any_channel",
    status: "Searching",
    priceUsd: 0,
    currency: "USD",
    openedAt: now,
    closedAt: null,
    parentDealId: null,
    receipt: null,
    escrow: null,
    domainTransfer: null,
    blockers: [],
    notes: RUN_DEAL_HOLD_NOTE,
    source: "engine",
    agentExecuted: false,
    priceVerified: false,
    amountVerified: false,
    amountStatus: "pending_verify",
    evidencePath: null,
    verification: {
      passed: false,
      skipped_reason: null,
      artifacts: [],
      receipt_refs: {},
    },
    timeline: [
      {
        id: `ev_${id}_search`,
        stage: "search",
        title: "Searching",
        detail: input.intentSummary
          ? `PLAN intent: ${input.intentSummary}`
          : "Opened from Run. Searching within spend limit.",
        at: now,
        status: "active",
      },
    ],
  };
}

export function runDealFromIntent(
  intent: Intent | undefined,
  id = RUN_SEARCHING_DEAL_ID,
  userId?: string,
): Deal {
  const extras = [
    intent?.mustInclude ? `Must include: ${intent.mustInclude}` : null,
    intent?.avoid ? `Avoid: ${intent.avoid}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const deal = buildRunSearchingDeal({
    id,
    userId: userId ?? intent?.userId ?? SEED_OWNER.id,
    title: intent?.summary?.slice(0, 80) || "First BotBuyer search",
    category: primaryDealCategory(
      inferIntentCategories({
        summary: intent?.summary,
        mustInclude: intent?.mustInclude,
        avoid: intent?.avoid,
        explicit: intent?.categories,
      }),
    ),
    intentSummary: intent?.summary ?? null,
  });
  if (extras) {
    deal.notes = `${RUN_DEAL_HOLD_NOTE} ${extras}`;
    if (deal.timeline[0]) {
      deal.timeline[0].detail = intent?.summary
        ? `PLAN intent: ${intent.summary} · ${extras}`
        : extras;
    }
  }
  return deal;
}

export function seedRunDealEvents(deal: Deal, email?: string | null): DealEvent[] {
  return [
    {
      id: `evt_${deal.id}_opened`,
      dealId: deal.id,
      type: "status",
      title: "Deal opened",
      detail: `Go-live Run created Searching deal${email ? ` · ${email}` : ""}.`,
      at: deal.openedAt,
      status: "done",
      actor: "engine",
      fromStatus: null,
      toStatus: "Searching",
    },
    {
      id: `evt_${deal.id}_search`,
      dealId: deal.id,
      type: "search",
      stage: "search",
      title: "Searching",
      detail: deal.timeline[0]?.detail ?? "Searching",
      at: deal.openedAt,
      status: "active",
      actor: "engine",
      toStatus: "Searching",
    },
  ];
}

/** Soft-signal HOLD — never book GMV or verified spend. */
export function assertRunDealSoftHold(deal: Deal) {
  if (deal.priceUsd !== 0 || deal.amountVerified || deal.priceVerified) {
    throw new Error("Go-live Searching deal must stay $0 and unverified.");
  }
  if (deal.amountStatus === "verified" || deal.agentExecuted) {
    throw new Error("Go-live Searching deal is a HOLD stub, not an executed buy.");
  }
  if (isVerifiedAmount(deal) || isPublicProofEligible(deal)) {
    throw new Error("Go-live Searching deal cannot enter verified spend or public proof.");
  }
}
