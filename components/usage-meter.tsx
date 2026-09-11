import { DemoBadge } from "@/components/demo-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { formatDateTime } from "@/lib/utils";
import {
  formatCount,
  formatTokensEst,
  USAGE_DEMO_BADGE,
  USAGE_ESTIMATE_LABEL,
  USAGE_HOLD_NOTE,
} from "@/lib/usage";
import type { UsageDayRollup, UsageEvent, UsageTokensEst } from "@/lib/types";

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
    <div className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium tracking-tight">{value}</p>
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
          <p className="mt-1 text-sm text-zinc-400">
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
        <p className="text-xs text-zinc-500">
          tokens_est {tokensLine(totals.tokensEst)}
        </p>
        {events.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Run / phase</th>
                  <th className="pb-2 pr-3 font-medium">Calls</th>
                  <th className="pb-2 pr-3 font-medium">tokens_est</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="py-3 pr-3">
                      <p>
                        {event.phase} · {event.runId}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {event.provider} / {event.model} ·{" "}
                        {formatDateTime(event.startedAt)}
                        {event.endedAt ? ` → ${formatDateTime(event.endedAt)}` : ""}
                      </p>
                    </td>
                    <td className="py-3 pr-3 text-zinc-300">
                      model {formatCount(event.modelCalls)} · tool{" "}
                      {formatCount(event.toolCalls)}
                    </td>
                    <td className="py-3 pr-3 text-zinc-300">
                      {tokensLine(event.tokensEst)}
                    </td>
                    <td className="py-3">
                      <span className="text-zinc-300">{event.status}</span>
                      <p className="text-xs text-amber-200/80">
                        {USAGE_ESTIMATE_LABEL}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            No usage events. Imported history is not a billed run.
          </p>
        )}
        <p className="text-xs text-zinc-500">{USAGE_HOLD_NOTE}</p>
      </CardContent>
    </Card>
  );
}

export function AdminUsageRollup({
  days,
  totals,
}: {
  days: UsageDayRollup[];
  totals: {
    runs: number;
    modelCalls: number;
    toolCalls: number;
    tokensEst: UsageTokensEst;
  };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Usage</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Per-day rollup of tokens_est and calls. No $ / user.
          </p>
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
              <thead className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Day</th>
                  <th className="pb-2 pr-3 font-medium">Runs</th>
                  <th className="pb-2 pr-3 font-medium">Calls</th>
                  <th className="pb-2 font-medium">tokens_est</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {days.map((row) => (
                  <tr key={row.day}>
                    <td className="py-3 pr-3">
                      {row.day}
                      <p className="text-xs text-amber-200/80">
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
          <p className="text-sm text-zinc-400">
            No usage events yet. Run BotBuy opens a Searching estimate stub.
          </p>
        )}
        <p className="text-xs text-zinc-500">{USAGE_HOLD_NOTE}</p>
      </CardContent>
    </Card>
  );
}
