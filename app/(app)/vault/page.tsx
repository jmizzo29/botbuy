import { HonestyFlag } from "@/components/honesty-flag";
import { LimitsForm } from "@/components/limits-form";
import { VaultRails } from "@/components/vault-rails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authorizedBuyVaultStatus } from "@/lib/authorized-buy";
import { requireUser } from "@/lib/auth";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import { formatUsd } from "@/lib/money";
import { SPEND_HARD_GATE_USD, SPEND_POLICY_LABEL } from "@/lib/spend-policy";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import {
  getSpendLimits,
  listedUnverifiedUsd,
  listVaultRefs,
  verifiedSpendUsd,
} from "@/lib/store";
import {
  VAULT_AUTHORIZED_BUY_NOTE,
  VAULT_H1,
  VAULT_SUB,
  VAULT_TRUST,
} from "@/lib/vault-rails";

export const metadata = {
  title: VAULT_H1,
};

export default async function VaultPage() {
  const user = await requireUser();
  const limits = getSpendLimits(user.id);
  const spent = verifiedSpendUsd(user.id);
  const listed = listedUnverifiedUsd(user.id);
  const card = listVaultRefs(user.id)[0];
  const authorizedBuy = authorizedBuyVaultStatus();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{VAULT_H1}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {VAULT_SUB}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {VAULT_TRUST}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
        </CardHeader>
        <CardContent>
          <VaultRails cardBrand={card?.brand} cardLast4={card?.last4} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authorized buy</CardTitle>
          <p className="mt-1 text-sm text-muted">{VAULT_AUTHORIZED_BUY_NOTE}</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>Stripe/Link Checkout Session prep uses official APIs only.</p>
          <p>Needs you → Approve → Buying is required. Auto-approve stays OFF.</p>
          <div
            className="space-y-2 text-xs"
            data-surface="vault-authorized-buy-status"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <HonestyFlag token="live=false" />
              <HonestyFlag token="spend=false" />
              <HonestyFlag token="charged=false" />
              <HonestyFlag token="autoApprove=false" />
              <HonestyFlag
                token={`keysConfigured=${String(authorizedBuy.keysConfigured)}`}
              />
              <HonestyFlag
                token={`publishableConfigured=${String(authorizedBuy.publishableConfigured)}`}
              />
              <HonestyFlag
                token={`webhookConfigured=${String(authorizedBuy.webhookConfigured)}`}
              />
              <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
            </div>
            <p className="leading-relaxed">{authorizedBuy.reason}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spend policy</CardTitle>
          <p className="mt-1 text-sm text-muted">{SPEND_POLICY_LABEL}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Cap label="Spend limit" value={formatUsd(SPEND_HARD_GATE_USD)} />
            <Cap label="Working cap" value={formatUsd(limits.perDealLimitUsd)} />
          </div>
          <p className="text-sm text-muted">
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
    <div className="rounded-[var(--bb-radius)] bg-surface px-4 py-3 ring-1 ring-[var(--bb-line)]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="money mt-1 text-xl font-medium">{value}</p>
    </div>
  );
}
