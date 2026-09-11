import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listVaultRefs } from "@/lib/store";

export const metadata = {
  title: "Onboarding · Vault",
};

export default function OnboardingVaultPage() {
  const refs = listVaultRefs();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Vault it</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Card PAN never enters BotBuy. No paid Stripe or Issuing in this POC.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Vault reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          {refs.map((ref) => (
            <div key={ref.id}>
              <p>
                {ref.brand} ···· {ref.last4}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {ref.vaultRef} · {ref.provider}
              </p>
            </div>
          ))}
          <p className="text-xs text-zinc-500">
            Fail-closed stub. Live vault attach is later — not GTM.
          </p>
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/onboarding/go-live">Continue</Link>
      </Button>
    </div>
  );
}
