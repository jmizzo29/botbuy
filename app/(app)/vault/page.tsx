import { LimitsForm } from "@/components/limits-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { getSpendLimits, listVaultRefs, spendInFlight } from "@/lib/store";

export const metadata = {
  title: "Vault & limits",
};

export default function VaultPage() {
  const refs = listVaultRefs();
  const limits = getSpendLimits();
  const spent = spendInFlight();
  const remaining = Math.max(limits.monthlyLimitUsd - spent, 0);
  const usedPct = Math.min(100, (spent / limits.monthlyLimitUsd) * 100);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Vault & limits</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
          BotBuy never sees or logs a card number. Only a vault reference and
          last four digits live here.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {refs.map((ref) => (
            <div
              key={ref.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/8"
            >
              <div>
                <p className="text-sm font-medium">
                  {ref.brand} ···· {ref.last4}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  ref {ref.vaultRef}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-500/10 text-emerald-300 ring-emerald-500/20">
                  {ref.status}
                </Badge>
                <p className="mt-1 text-xs text-zinc-500">
                  {String(ref.expiryMonth).padStart(2, "0")}/{ref.expiryYear}
                </p>
              </div>
            </div>
          ))}
          <p className="text-xs leading-relaxed text-zinc-500">
            Provider placeholder: {refs[0]?.provider ?? "none"}. PAN, CVV, and
            full account numbers are out of scope for this app and the audit
            log.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spend this period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="money text-3xl font-medium">{formatUsd(spent)}</p>
              <p className="mt-1 text-sm text-zinc-500">
                of {formatUsd(limits.monthlyLimitUsd)} monthly ·{" "}
                {formatUsd(remaining)} remaining
              </p>
            </div>
            <p className="text-xs text-zinc-500">From imported ledger totals</p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limits</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Agent purchases stop at these ceilings. Per-deal cap is the hard
            gate.
          </p>
        </CardHeader>
        <CardContent>
          <LimitsForm limits={limits} />
        </CardContent>
      </Card>
    </div>
  );
}
