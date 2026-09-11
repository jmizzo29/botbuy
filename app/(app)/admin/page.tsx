import { notFound } from "next/navigation";
import { AdminSection, MetricTile } from "@/components/metric-card";
import { SourceBadge } from "@/components/demo-badge";
import { Card } from "@/components/ui/card";
import { getAdminMetrics } from "@/lib/admin-metrics";
import { isAdmin } from "@/lib/auth";
import { formatUsd } from "@/lib/money";
import { DEAL_STATUSES } from "@/lib/types";
import { STUB_METRICS_BADGE } from "@/lib/flags";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  if (!isAdmin()) notFound();

  const metrics = getAdminMetrics();
  const maxStatus = Math.max(...Object.values(metrics.dealsOps.byStatus), 1);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Build Star Labs · owner
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <SourceBadge source="stub" />
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          Internal console. Customer Home stays personal. Invented numbers are
          never shown as live.
        </p>
      </header>

      <Card className="border-amber-400/20 bg-amber-500/5 px-5 py-4 ring-amber-400/20">
        <p className="text-sm font-medium text-amber-100">{STUB_METRICS_BADGE}</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-100/70">
          Traffic, users, and revenue stay empty until Plausible / Vercel
          Analytics and Stripe are connected. Deals ops use the imported
          customer #1 ledger and are labeled as such.
        </p>
      </Card>

      <AdminSection
        title="Web traffic"
        source={metrics.traffic.source}
        description="Wire Plausible or Vercel Analytics. Placeholders only."
      >
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <ConnectChip
            label="Plausible"
            connected={metrics.traffic.plausible.connected}
            detail={metrics.traffic.plausible.domain ?? "NEXT_PUBLIC_PLAUSIBLE_DOMAIN"}
          />
          <ConnectChip
            label="Vercel Analytics"
            connected={metrics.traffic.vercelAnalytics.connected}
            detail="NEXT_PUBLIC_VERCEL_ANALYTICS"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile label="Visits" value="—" empty hint="Not connected" />
          <MetricTile label="Unique visitors" value="—" empty hint="Not connected" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <EmptyList title="Top pages" />
          <EmptyList title="Referrers" />
        </div>
      </AdminSection>

      <AdminSection
        title="Users"
        source={metrics.users.source}
        description="Signups, actives, and funnel — live auth not connected."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Signups" value="—" empty hint="No live auth count" />
          <MetricTile label="Active users" value="—" empty hint="No live sessions" />
          <MetricTile
            label="Seeded customers"
            value={String(metrics.users.seededCustomers)}
            hint="John Mitchell · ledger only"
          />
        </div>
        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            Conversion funnel
          </p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-4">
            {metrics.users.funnel.map((step, index) => (
              <li
                key={step.step}
                className="rounded-xl bg-white/[0.03] px-3 py-3 ring-1 ring-white/6"
              >
                <p className="text-[11px] text-zinc-500">
                  {index + 1}. {step.step}
                </p>
                <p className="money mt-1 text-xl text-zinc-600">—</p>
              </li>
            ))}
          </ol>
        </div>
      </AdminSection>

      <AdminSection
        title="Revenue"
        source={metrics.revenue.source}
        description="Stripe not connected. Paid vs trial stays empty."
      >
        <ConnectChip
          label="Stripe"
          connected={metrics.revenue.stripeConnected}
          detail="NEXT_PUBLIC_STRIPE_LIVE"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <MetricTile label="MRR" value="—" empty />
          <MetricTile label="ARR" value="—" empty />
          <MetricTile label="ARPU" value="—" empty />
          <MetricTile label="Churn" value="—" empty />
          <MetricTile label="Paid" value="—" empty />
          <MetricTile label="Trial" value="—" empty />
        </div>
      </AdminSection>

      <AdminSection
        title="Deals ops"
        source={metrics.dealsOps.source}
        description={metrics.dealsOps.note}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Deals"
            value={String(metrics.dealsOps.dealCount)}
            hint="Customer #1 imported"
          />
          <MetricTile
            label="$ under management"
            value={formatUsd(metrics.dealsOps.underManagementUsd)}
            hint={`Closed ${formatUsd(metrics.dealsOps.closedUsd)}`}
          />
          <MetricTile
            label="Success rate"
            value={
              metrics.dealsOps.successRate === null
                ? "—"
                : `${Math.round(metrics.dealsOps.successRate * 100)}%`
            }
            hint="Closed / all imported deals"
          />
        </div>
        <ul className="mt-5 space-y-2">
          {DEAL_STATUSES.map((status) => {
            const count = metrics.dealsOps.byStatus[status];
            return (
              <li key={status} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3">
                <span className="text-xs text-zinc-400">{status}</span>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-accent/80"
                    style={{
                      width: count ? `${(count / maxStatus) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="money text-right text-xs text-zinc-400">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </AdminSection>

      <AdminSection
        title="System health"
        source={metrics.systemHealth.source}
        description={metrics.systemHealth.note}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Agent runs"
            value={String(metrics.systemHealth.agentRunsExecuted)}
            hint={`${metrics.systemHealth.reconstructedEvents} reconstructed events`}
          />
          <MetricTile
            label="Human-gate queue"
            value={String(metrics.systemHealth.humanGateDeals)}
            hint={`${metrics.systemHealth.humanGateItems} open blockers`}
          />
          <MetricTile
            label="Spend vs limit"
            value={`${formatUsd(metrics.systemHealth.spendMonthUsd)} / ${formatUsd(metrics.systemHealth.monthlyLimitUsd)}`}
            hint="Imported spend · seeded monthly cap"
          />
        </div>
      </AdminSection>
    </div>
  );
}

function ConnectChip({
  label,
  connected,
  detail,
}: {
  label: string;
  connected: boolean;
  detail: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/8">
      <span
        className={
          connected ? "h-1.5 w-1.5 rounded-full bg-emerald-400" : "h-1.5 w-1.5 rounded-full bg-zinc-600"
        }
      />
      {label}
      <span className="text-zinc-500">
        {connected ? "connected" : `not connected · ${detail}`}
      </span>
    </span>
  );
}

function EmptyList({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-white/[0.02] px-4 py-4 ring-1 ring-white/6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </p>
      <p className="mt-3 text-sm text-zinc-600">No live data</p>
    </div>
  );
}
