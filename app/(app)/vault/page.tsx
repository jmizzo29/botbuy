import { LimitsForm } from "@/components/limits-form";
import { VaultRails } from "@/components/vault-rails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { SPEND_HARD_GATE_USD, SPEND_POLICY_LABEL } from "@/lib/spend-policy";
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
          Multi-rail fund-in. Spend-out hard gate {formatUsd(SPEND_HARD_GATE_USD)}.
          Every deal needs John. No live rails. PAN never enters BotBuy.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Fund-in rails</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            First-class vault architecture — not Link-only. Unwired rails stay
            Coming soon / Demo.
          </p>
        </CardHeader>
        <CardContent>
          <VaultRails />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card vault ref</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Demo token only. Not a live charge path.
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
              <Badge className="bg-amber-500/10 text-amber-200 ring-amber-400/25">
                Demo
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spend-out</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">{SPEND_POLICY_LABEL}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Cap label="Hard gate" value={formatUsd(SPEND_HARD_GATE_USD)} />
            <Cap label="Working cap" value={formatUsd(limits.perDealLimitUsd)} />
          </div>
          <p className="text-sm text-zinc-400">
            Verified spend this period: {formatUsd(spent)}. Auto-approve OFF —
            every deal needs John. Imported listed amounts are not spend
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
