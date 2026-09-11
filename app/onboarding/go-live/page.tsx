import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { getSpendLimits, listIntents } from "@/lib/store";
import { formatUsd } from "@/lib/money";

export const metadata = {
  title: "Onboarding · Go live",
};

export default function OnboardingGoLivePage() {
  const intent = listIntents()[0];
  const limits = getSpendLimits();

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
          <Row label="Daily" value={formatUsd(limits.dailyLimitUsd)} />
          <Row label="Monthly" value={formatUsd(limits.monthlyLimitUsd)} />
          <Row label="Auto-approve" value={limits.autoApprove ? "ON" : "OFF"} />
          <Row label="Vault" value="Stub ref only · no PAN · no Issuing" />
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/home">Open My deals</Link>
      </Button>
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
