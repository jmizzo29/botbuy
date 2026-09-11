import Link from "next/link";
import { notFound } from "next/navigation";
import { DealAmount } from "@/components/money";
import { DealBadges } from "@/components/deal-badges";
import { DemoBadge } from "@/components/demo-badge";
import { HealthPill } from "@/components/health-pill";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdmin } from "@/lib/auth";
import { getOwnerFinance } from "@/lib/finance";
import { formatUsd } from "@/lib/money";
import { agentOrgAdmin } from "@/lib/agent-org";
import { listDeals, listDirectoryUsers } from "@/lib/store";
import { DEAL_STATUSES } from "@/lib/types";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  if (!isAdmin()) notFound();

  const deals = listDeals();
  const users = listDirectoryUsers();
  const byStatus = Object.fromEntries(
    DEAL_STATUSES.map((status) => [
      status,
      deals.filter((deal) => deal.status === status).length,
    ]),
  );
  const gated = deals.filter((deal) => deal.blockers.length > 0);
  const finance = getOwnerFinance(deals);
  const agentOrgs = agentOrgAdmin();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <DemoBadge />
        </div>
        <p className="text-sm text-zinc-400">
          Owner overview · not customer-facing
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Web traffic</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Traffic connects when analytics is live.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="text-sm text-zinc-500">
          CHO-gated. No visits, uniques, or referrers until Plausible or Vercel
          Analytics is live. Demo samples are not shown as real.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Users</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Directory count from seed/DB. Not a paid-user total.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-medium tracking-tight">{users.length}</p>
          <ul className="divide-y divide-white/6">
            {users.map((user) => (
              <li key={user.id} className="py-3 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-zinc-500">
                  {user.id === "john-mitchell"
                    ? "customer #1"
                    : user.role}{" "}
                  · {user.company} · {user.email}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500">
            Paid users are not counted. Stripe is not live — no invented totals.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>MRR / revenue</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Revenue connects when Stripe is live.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="text-sm text-zinc-500">
          No MRR, ARR, ARPU, or paid-vs-trial claim. No paid Stripe or Issuing
          in this POC.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Finance</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              CFO widgets. Verified vs Pending/Imported split — Demo until
              Stripe is live.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FinanceTile
              label="Startup costs (verified)"
              value={formatUsd(finance.startupCostsUsd)}
              hint="CHO verified only · botbuyer.ai $179.96"
            />
            <FinanceTile
              label="Imported / pending"
              value={formatUsd(finance.startupCostsPendingUsd)}
              hint="Savedfast + xfer · not burn · not GMV"
            />
            <FinanceTile
              label="Burn"
              value="—"
              hint={finance.burn.label}
              empty
            />
            <FinanceTile
              label="Runway"
              value="—"
              hint={finance.runway.label}
              empty
            />
            <FinanceTile
              label="Domains / infra (verified)"
              value={formatUsd(finance.domainsInfraUsd)}
              hint="Verified domain only · excludes unverified $11.68 xfer"
            />
            <FinanceTile
              label="Customer GMV (verified)"
              value={formatUsd(finance.customerGmvUsd)}
              hint="Verified only · not public proof"
            />
          </div>
          <ul className="divide-y divide-white/6 text-sm">
            {finance.lines.map((line) => (
              <li
                key={line.dealId}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div>
                  <Link
                    href={`/deals/${line.dealId}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {line.title}
                  </Link>
                  <p className="text-xs text-zinc-500">
                    {line.bucket === "domain_infra"
                      ? "Domains / infra"
                      : "Acquisition"}{" "}
                    · {line.amountStatus} ·{" "}
                    {line.amountVerified
                      ? "verified spend"
                      : "not verified spend"}
                  </p>
                </div>
                <span className="money text-zinc-300">
                  {formatUsd(line.listedUsd)}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500">{finance.note}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Deals ops</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Seed/DB deals including John’s imported history. Not public proof.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            {DEAL_STATUSES.filter((status) => byStatus[status]).map((status) => (
              <span key={status}>
                {status} {byStatus[status]}
              </span>
            ))}
            <span>{deals.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Deal</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {deals.map((deal) => (
                  <tr key={deal.id}>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="text-stone-100 underline-offset-2 hover:underline"
                      >
                        {deal.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">
                      <StatusPill status={deal.status} />
                    </td>
                    <td className="py-3 pr-3">
                      <DealAmount deal={deal} />
                    </td>
                    <td className="py-3">
                      <DealBadges deal={deal} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">
            Imported rows are excluded from the public ProofStrip.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Agent orgs</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">{agentOrgs.badge}</p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {agentOrgs.orgs.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  <tr>
                    <th className="pb-2 pr-3 font-medium">Asset</th>
                    <th className="pb-2 pr-3 font-medium">Deal</th>
                    <th className="pb-2 pr-3 font-medium">Agents</th>
                    <th className="pb-2 pr-3 font-medium">Status</th>
                    <th className="pb-2 font-medium">Activated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {agentOrgs.orgs.map((org) => (
                    <tr key={org.id}>
                      <td className="py-2 pr-3">{org.title}</td>
                      <td className="py-2 pr-3">
                        <Link
                          href={`/deals/${org.dealId}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {org.dealId}
                        </Link>
                      </td>
                      <td className="py-2 pr-3">CEO · CFO · CTO · CMO</td>
                      <td className="py-2 pr-3">Demo · not live</td>
                      <td className="py-2">
                        {org.activatedAt
                          ? org.activatedAt.slice(0, 10)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-400">{agentOrgs.empty}</p>
          )}
          <p className="text-xs text-zinc-500">{agentOrgs.note}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>System health</CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Calm status only. No invented availability.
            </p>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-white/6 text-sm">
            <HealthRow label="Analytics" state="Not connected" />
            <HealthRow label="Stripe" state="Not connected" />
            <HealthRow
              label="Fund-in vault"
              state="Demo"
              detail="Card Available. Bank / X Money / Bitcoin Coming. HOLD — not live."
            />
            <HealthRow label="MCP" state="Stub" />
            <HealthRow
              label="Agent orgs"
              state="Demo"
              detail="HOLD. Runtime not live. Agents never bypass $1k John approval."
            />
            <HealthRow
              label="Human gates"
              state={gated.length ? "Degraded" : "OK"}
              detail={
                gated.length
                  ? `${gated.length} imported deal with open blockers`
                  : undefined
              }
            />
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FinanceTile({
  label,
  value,
  hint,
  empty = false,
}: {
  label: string;
  value: string;
  hint: string;
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p
        className={
          empty
            ? "money mt-1 text-2xl font-medium text-zinc-600"
            : "money mt-1 text-2xl font-medium tracking-tight"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

function HealthRow({
  label,
  state,
  detail,
}: {
  label: string;
  state: "OK" | "Degraded" | "Not connected" | "Demo" | "Stub";
  detail?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div>
        <p>{label}</p>
        {detail ? <p className="text-xs text-zinc-500">{detail}</p> : null}
      </div>
      <HealthPill state={state} />
    </li>
  );
}
