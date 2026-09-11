import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { getSpendLimits, listIntents } from "@/lib/store";
import { formatUsd } from "@/lib/money";
import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import { isVaultReady, vaultReadyCopy } from "@/lib/vault-rails";

export const metadata = {
  title: "Onboarding · Go live",
};

export default function OnboardingGoLivePage() {
  const intent = listIntents()[0];
  const limits = getSpendLimits();
  const ready = isVaultReady();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">BotBuy buys</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Recap. The app is not announced live. {BRAND.origin} DNS attaches later.
        </p>
      </header>
      <Card>
        <CardContent className="space-y-3 pt-5 text-sm">
          <Row label="Intent" value={intent?.summary ?? "Set in previous step"} />
          <Row label="Hard gate" value={formatUsd(SPEND_HARD_GATE_USD)} />
          <Row label="Working cap" value={formatUsd(limits.perDealLimitUsd)} />
          <Row
            label="Approval"
            value="Every deal needs approval before spend"
          />
          <Row label="Vault" value={vaultReadyCopy(ready)} />
        </CardContent>
      </Card>
      {ready ? (
        <Button asChild>
          <Link href="/home">Run</Link>
        </Button>
      ) : (
        <div className="space-y-2">
          <Button disabled>Run</Button>
          <p className="text-xs text-zinc-500">
            Coming rails alone do not unlock Run. Add an Available payment
            method.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className="max-w-[16rem] text-right">{value}</span>
    </div>
  );
}
