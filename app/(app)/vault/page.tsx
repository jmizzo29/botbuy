import { LimitsForm } from "@/components/limits-form";
import { VaultRails } from "@/components/vault-rails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { SPEND_HARD_GATE_USD, SPEND_POLICY_LABEL } from "@/lib/spend-policy";
import {
  getSpendLimits,
  listedUnverifiedUsd,
  verifiedSpendUsd,
} from "@/lib/store";
import { VAULT_H1 } from "@/lib/vault-rails";

export const metadata = {
  title: "Fund your vault",
};

export default function VaultPage() {
  const limits = getSpendLimits();
  const spent = verifiedSpendUsd();
  const listed = listedUnverifiedUsd();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{VAULT_H1}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
          Multi-rail vault. Card is Available. Coming rails do not unlock Run.
          Soft-signal HOLD — never live.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
        </CardHeader>
        <CardContent>
          <VaultRails />
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
            Verified spend this period: {formatUsd(spent)}. Every deal needs
            approval before spend. Imported listed amounts are not spend
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
