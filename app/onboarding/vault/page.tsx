import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VaultRails } from "@/components/vault-rails";
import { VAULT_H1, isVaultReady } from "@/lib/vault-rails";

export const metadata = {
  title: "Onboarding · Vault",
};

export default function OnboardingVaultPage() {
  const ready = isVaultReady();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{VAULT_H1}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Card is Available. Bank, X Money / cash, and Bitcoin are Coming.
          Coming alone does not unlock Run.
        </p>
      </header>
      <Card>
        <CardContent className="pt-5">
          <VaultRails />
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/onboarding/go-live">Continue</Link>
      </Button>
      {!ready ? (
        <p className="text-xs text-zinc-500">
          Run stays locked until an Available method is on the vault.
        </p>
      ) : null}
    </div>
  );
}
