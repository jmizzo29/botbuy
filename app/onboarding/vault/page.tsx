import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultRails } from "@/components/vault-rails";
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
          Multi-rail fund-in: cards, bank (ACH/wire), X Money, Bitcoin, and
          other types. Card PAN never enters BotBuy. No rail is live.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Fund-in rails</CardTitle>
        </CardHeader>
        <CardContent>
          <VaultRails />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card vault ref</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          {refs.map((ref) => (
            <div key={ref.id}>
              <p>
                {ref.brand} ···· {ref.last4}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {ref.vaultRef} · Demo · not live
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/onboarding/go-live">Continue</Link>
      </Button>
    </div>
  );
}
