import { DemoBadge } from "@/components/demo-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { formatDateTime } from "@/lib/utils";
import {
  ADMIN_USAGE_MICRO,
  formatCount,
  formatTokensApprox,
  formatTokensEst,
  SETTINGS_USAGE_MICRO,
  USAGE_DEMO_BADGE,
  USAGE_ESTIMATE_LABEL,
  USAGE_HOLD_NOTE,
  USAGE_NO_PRECISE,
  USAGE_NOT_A_BILL,
  USAGE_SURFACES,
  USAGE_UNTIL_METERED,
  USAGE_YOUR_LABEL,
  rollupUsageBySurface,
} from "@/lib/usage";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import type {
  UsageDayRollup,
  UsageEvent,
  UsageTokensEst,
  UsageUserRollup,
} from "@/lib/types";

function EstimateBadge() {
  return (
    <Badge className={DEMO_PILL_CLASS}>
      {USAGE_ESTIMATE_LABEL}
    </Badge>
  );
}

function Counter({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--bb-radius)] bg-surface px-4 py-3 ring-1 ring-[var(--bb-line)]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function tokensLine(tokens: UsageTokensEst) {
  return `in ${formatTokensEst(tokens.input)} · out ${formatTokensEst(tokens.output)} · total ${formatTokensEst(tokens.total)}`;
}

export function DealUsageSection({ events }: { events: UsageEvent[] }) {
  const totals = events.reduce(
    (acc, event) => ({
      modelCalls: acc.modelCalls + event.modelCalls,
      toolCalls: acc.toolCalls + event.toolCalls,
      tokensEst: {
        input: (acc.tokensEst.input ?? 0) + (event.tokensEst.input ?? 0),
        output: (acc.tokensEst.output ?? 0) + (event.tokensEst.output ?? 0),
        total: (acc.tokensEst.total ?? 0) + (event.tokensEst.total ?? 0),
      },
    }),
    {
      modelCalls: 0,
      toolCalls: 0,
      tokensEst: { input: 0, output: 0, total: 0 } satisfies UsageTokensEst,
    },
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Usage</CardTitle>
          <p className="mt-1 text-sm text-muted">
            Coarse token / call meter · {USAGE_DEMO_BADGE}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <EstimateBadge />
          <DemoBadge />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Counter label="model_calls" value={formatCount(totals.modelCalls)} />
          <Counter label="tool_calls" value={formatCount(totals.toolCalls)} />
          <Counter
            label="tokens_est total"
            value={formatTokensEst(totals.tokensEst.total)}
          />
        </div>
        <p className="text-xs text-muted">
          tokens_est {tokensLine(totals.tokensEst)}
        </p>
        {events.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Run / phase</th>
                  <th className="pb-2 pr-3 font-medium">Calls</th>
                  <th className="pb-2 pr-3 font-medium">tokens_est</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bb-line)]">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="py-3 pr-3">
                      <p>
                        {event.phase} · {event.runId}
                      </p>
                      <p className="text-xs text-muted">
                        {event.provider} / {event.model} ·{" "}
                        {formatDateTime(event.startedAt)}
                        {event.endedAt ? ` → ${formatDateTime(event.endedAt)}` : ""}
                      </p>
                    </td>
                    <td className="py-3 pr-3 text-foreground/80">
                      model {formatCount(event.modelCalls)} · tool{" "}
                      {formatCount(event.toolCalls)}
                    </td>
                    <td className="py-3 pr-3 text-foreground/80">
                      {tokensLine(event.tokensEst)}
                    </td>
                    <td className="py-3">
                      <span className="text-foreground/80">{event.status}</span>
                      <p className="text-xs text-demo">
                        {USAGE_ESTIMATE_LABEL}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">
            No usage events. Imported history is not a billed run.
          </p>
        )}
        <p className="text-xs text-muted">{USAGE_HOLD_NOTE}</p>
        <p className="text-xs text-muted">
          <a href="/settings#usage" className="underline-offset-2 hover:underline">
            All usage in Settings
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export function SettingsUsageSection({
  events,
  totals,
}: {
  events: UsageEvent[];
  totals: {
    runs: number;
    modelCalls: number;
    toolCalls: number;
    tokensEst: UsageTokensEst;
  };
}) {
  const surfaces = rollupUsageBySurface(events);
  const max = Math.max(surfaces.search, surfaces.deal_ops, surfaces.other, 1);

  return (
    <div id="usage" data-surface="settings-usage">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
        <p className="mt-1 text-sm text-muted">{USAGE_YOUR_LABEL}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
          <Badge className={DEMO_PILL_CLASS}>{USAGE_UNTIL_METERED}</Badge>
        </div>
        <p className="mt-2 text-xs text-muted">{SETTINGS_USAGE_MICRO}</p>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <Counter
          label="This period"
          value={formatTokensApprox(totals.tokensEst.total)}
        />
        <div className="rounded-[var(--bb-radius)] bg-surface px-4 py-3 ring-1 ring-[var(--bb-line)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
            Estimate
          </p>
          <p className="mt-1 text-2xl font-medium tracking-tight">—</p>
          <p className="mt-1 text-xs text-muted">{USAGE_NOT_A_BILL}</p>
        </div>
      </div>
      <div className="mt-4 rounded-[var(--bb-radius)] bg-surface px-4 py-4 ring-1 ring-[var(--bb-line)]">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          By agent / surface
        </p>
        <ul className="mt-3 space-y-3">
          {USAGE_SURFACES.map((surface) => {
            const value = surfaces[surface.id];
            const width = `${Math.round((value / max) * 100)}%`;
            return (
              <li key={surface.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{surface.label}</span>
                  <span className="text-muted">{formatTokensApprox(value)}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.04]">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: value ? width : "0%" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Your token usage — estimate until metering. {USAGE_NOT_A_BILL}.
        </p>
      </div>
      <div className="mt-4 rounded-[var(--bb-radius)] bg-surface px-4 py-4 ring-1 ring-[var(--bb-line)]">
        <p className="text-sm font-medium">No precise costs yet</p>
        <p className="mt-1 text-sm text-muted">{USAGE_NO_PRECISE}</p>
        <p className="mt-3 text-xs text-muted">{USAGE_HOLD_NOTE}</p>
        <p className="mt-4">
          <a
            href={MY_DEALS_HREF}
            className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm ring-1 ring-[var(--bb-line)]"
          >
            Back to {MY_DEALS_LABEL}
          </a>
        </p>
      </div>
    </div>
  );
}

export function AdminUsageRollup({
  days,
  totals,
  byUser,
  title = "Usage",
  micro = ADMIN_USAGE_MICRO,
}: {
  days: UsageDayRollup[];
  totals: {
    runs: number;
    modelCalls: number;
    toolCalls: number;
    tokensEst: UsageTokensEst;
  };
  byUser?: UsageUserRollup[];
  title?: string;
  micro?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-muted">{micro}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <EstimateBadge />
          <DemoBadge />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Counter label="Runs" value={formatCount(totals.runs)} />
          <Counter label="model_calls" value={formatCount(totals.modelCalls)} />
          <Counter label="tool_calls" value={formatCount(totals.toolCalls)} />
          <Counter
            label="tokens_est total"
            value={formatTokensEst(totals.tokensEst.total)}
          />
        </div>
        {days.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Day</th>
                  <th className="pb-2 pr-3 font-medium">Runs</th>
                  <th className="pb-2 pr-3 font-medium">Calls</th>
                  <th className="pb-2 font-medium">tokens_est</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bb-line)]">
                {days.map((row) => (
                  <tr key={row.day}>
                    <td className="py-3 pr-3">
                      {row.day}
                      <p className="text-xs text-demo">
                        {USAGE_ESTIMATE_LABEL}
                      </p>
                    </td>
                    <td className="py-3 pr-3">{formatCount(row.runs)}</td>
                    <td className="py-3 pr-3">
                      model {formatCount(row.modelCalls)} · tool{" "}
                      {formatCount(row.toolCalls)}
                    </td>
                    <td className="py-3">{tokensLine(row.tokensEst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">
            No usage events yet. Run BotBuy opens a Searching estimate stub.
          </p>
        )}
        {byUser ? (
          byUser.length ? (
            <div className="overflow-x-auto">
              <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                By licensed user
              </p>
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="pb-2 pr-3 font-medium">User</th>
                    <th className="pb-2 pr-3 font-medium">Runs</th>
                    <th className="pb-2 pr-3 font-medium">Calls</th>
                    <th className="pb-2 font-medium">tokens_est</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bb-line)]">
                  {byUser.map((row) => (
                    <tr key={row.userId}>
                      <td className="py-3 pr-3">
                        {row.name}
                        <p className="text-xs text-demo">{USAGE_ESTIMATE_LABEL}</p>
                      </td>
                      <td className="py-3 pr-3">{formatCount(row.runs)}</td>
                      <td className="py-3 pr-3">
                        model {formatCount(row.modelCalls)} · tool{" "}
                        {formatCount(row.toolCalls)}
                      </td>
                      <td className="py-3">{tokensLine(row.tokensEst)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted">
              By-user breakdown when licensed users are metered. Demo · Estimate.
            </p>
          )
        ) : null}
        <p className="text-xs text-muted">{USAGE_HOLD_NOTE}</p>
      </CardContent>
    </Card>
  );
}
