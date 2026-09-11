import { runFirstBuyAction } from "@/app/onboarding/go-live/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { GO_LIVE_PRIMARY_LABEL } from "@/lib/designer-wire-notes";
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
          Recap. {BRAND.footerHold}. Run opens a Searching deal — agent runtime
          is not live.
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
        <form action={runFirstBuyAction}>
          <Button type="submit" size="lg" data-cta="go-live-run">
            {GO_LIVE_PRIMARY_LABEL}
          </Button>
        </form>
      ) : (
        <div className="space-y-2">
          <Button disabled size="lg" data-cta="go-live-run">
            {GO_LIVE_PRIMARY_LABEL}
          </Button>
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
