import Link from "next/link";
import { LimitsForm } from "@/components/limits-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSpendLimits } from "@/lib/store";
import { SPEND_POLICY_LABEL } from "@/lib/spend-policy";

export const metadata = {
  title: "Onboarding · Spend",
};

export default function OnboardingSpendPage() {
  const limits = getSpendLimits();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Set spend</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Set your spend limit. Every deal needs approval before spend.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Your spend limit</CardTitle>
        </CardHeader>
        <CardContent>
          <LimitsForm limits={limits} />
        </CardContent>
      </Card>
      <p className="text-xs text-zinc-500">{SPEND_POLICY_LABEL}</p>
      <Button asChild>
        <Link href="/onboarding/vault">Continue to vault</Link>
      </Button>
    </div>
  );
}
