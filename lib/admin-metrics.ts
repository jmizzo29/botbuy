import { flags, STUB_METRICS_BADGE } from "@/lib/flags";
import {
  listDeals,
  listedUnverifiedUsd,
  verifiedSpendUsd,
  getSpendLimits,
} from "@/lib/store";
import { DEAL_STATUSES, type AdminMetrics, type DealStatus } from "@/lib/types";

export function getAdminMetrics(): AdminMetrics {
  const deals = listDeals();
  const byStatus = Object.fromEntries(
    DEAL_STATUSES.map((status) => [status, 0]),
  ) as Record<DealStatus, number>;

  for (const deal of deals) {
    byStatus[deal.status] += 1;
  }

  const closed = deals.filter((deal) => deal.status === "Closed");
  const gated = deals.filter(
    (deal) => deal.blockers.length > 0 || deal.status === "Needs you",
  );
  const reconstructedEvents = deals.reduce(
    (sum, deal) => sum + deal.timeline.length,
    0,
  ); // deal_events seeded 1:1 from timeline + import row
  const agentRunsExecuted = deals.filter((deal) => deal.agentExecuted).length;
  const limits = getSpendLimits();

  return {
    live: false,
    badge: STUB_METRICS_BADGE,
    generatedAt: new Date().toISOString(),
    traffic: {
      source: flags.analyticsLive ? "live" : "stub",
      plausible: {
        connected: Boolean(flags.plausibleDomain) && flags.analyticsLive,
        domain: flags.plausibleDomain,
      },
      vercelAnalytics: {
        connected: flags.vercelAnalytics && flags.analyticsLive,
      },
      visits: null,
      uniqueVisitors: null,
      topPages: [],
      referrers: [],
    },
    users: {
      source: "stub",
      signups: null,
      activeUsers: null,
      seededCustomers: 1,
      funnel: [
        { step: "Visit", count: null },
        { step: "Signup", count: null },
        { step: "Vault", count: null },
        { step: "First deal", count: null },
      ],
    },
    revenue: {
      source: flags.stripeLive ? "live" : "stub",
      stripeConnected: flags.stripeLive,
      mrr: null,
      arr: null,
      arpu: null,
      churn: null,
      paid: null,
      trial: null,
    },
    dealsOps: {
      source: "imported_ledger",
      byStatus,
      underManagementUsd: listedUnverifiedUsd(),
      closedUsd: closed
        .filter((deal) => deal.priceVerified)
        .reduce((sum, deal) => sum + deal.priceUsd, 0),
      successRate: deals.length ? closed.length / deals.length : null,
      dealCount: deals.length,
      note: "Imported ledger ops only. Listed $ are unverified. Public proof ignores these rows.",
    },
    systemHealth: {
      source: "derived_seed",
      agentRunsExecuted,
      reconstructedEvents,
      humanGateDeals: gated.length,
      humanGateItems: gated.reduce((sum, deal) => sum + deal.blockers.length, 0),
      spendMonthUsd: verifiedSpendUsd(),
      monthlyLimitUsd: limits.monthlyLimitUsd,
      note: "Derived from seeded ledger and vault limits. Not live agent telemetry.",
    },
  };
}
