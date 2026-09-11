import { LimitsForm } from "@/components/limits-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { SPEND_POLICY_LABEL } from "@/lib/spend-policy";
import {
  getSpendLimits,
  listVaultRefs,
  listedUnverifiedUsd,
  verifiedSpendUsd,
} from "@/lib/store";

export const metadata = {
  title: "Vault & limits",
};

export default function VaultPage() {
  const refs = listVaultRefs();
  const limits = getSpendLimits();
  const spent = verifiedSpendUsd();
  const listed = listedUnverifiedUsd();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Vault & limits</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
          Hard-cap story. No live card spend. No paid Stripe or Issuing. PAN
          never enters BotBuy.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Vault shell</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Token reference only. Fail-closed until a processor is connected.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {refs.map((ref) => (
            <div
              key={ref.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/8"
            >
              <div>
                <p className="font-mono text-sm text-zinc-300">{ref.vaultRef}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  last4 {ref.last4} · display only · not a live charge path
                </p>
              </div>
              <Badge className="bg-zinc-500/10 text-zinc-300 ring-zinc-500/20">
                Stub · no live spend
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hard caps</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">{SPEND_POLICY_LABEL}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Cap label="Daily" value={formatUsd(limits.dailyLimitUsd)} />
            <Cap label="Monthly" value={formatUsd(limits.monthlyLimitUsd)} />
            <Cap label="Per deal" value={formatUsd(limits.perDealLimitUsd)} />
          </div>
          <p className="text-sm text-zinc-400">
            Verified spend this period: {formatUsd(spent)}. Auto-approve OFF.
            Imported listed amounts are not spend
            {listed > 0 ? " and stay hidden from this cap" : ""}.
          </p>
          <LimitsForm limits={limits} />
        </CardContent>
      </Card>
    </div>
  );
}

function Cap({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="money mt-1 text-xl font-medium">{value}</p>
    </div>
  );
}
