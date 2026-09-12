import Link from "next/link";
import { DealsTable } from "@/components/deals-table";
import { IntentForm } from "@/components/intent-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import {
  APPROVE_MICRO,
  AUTO_APPROVE_OFF,
  MY_DEALS_LABEL,
  SPEND_LIMIT_PILL,
} from "@/lib/cpo-techlux";
import {
  INTENT_TEXTAREA_LABEL,
  MY_DEALS_EMPTY_BODY,
  MY_DEALS_EMPTY_TITLE,
  MY_DEALS_PROGRESS,
  MY_DEALS_QUIET_IDLE,
  hasReachableEmail,
} from "@/lib/john-ux";
import { hydrateStore, listDeals, listVaultRefs, verifiedSpendUsd } from "@/lib/store";
import { formatUsd } from "@/lib/money";
import { remainingAfterVerified } from "@/lib/spend-policy";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: "My deals",
};

export default async function HomePage() {
  await hydrateStore();
  const user = await requireUser();
  const deals = listDeals(user.id);
  const remaining = formatUsd(remainingAfterVerified(verifiedSpendUsd(user.id)));
  const vault = listVaultRefs(user.id)[0];
  const payment = vault
    ? `${vault.brand} ··· ${vault.last4}`
    : "Card · Available ≠ live";
  const searching = deals.some((deal) => deal.status === "Searching");

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{MY_DEALS_LABEL}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
          <Badge className={DEMO_PILL_CLASS}>{SPEND_LIMIT_PILL}</Badge>
          <Badge className={DEMO_PILL_CLASS}>Remaining {remaining}</Badge>
          <Badge className={DEMO_PILL_CLASS}>
            {deals.length} deal{deals.length === 1 ? "" : "s"}
          </Badge>
          <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
        </div>
        {searching ? (
          <p className="text-sm leading-relaxed text-muted">{MY_DEALS_PROGRESS}</p>
        ) : deals.length ? (
          <p className="text-sm leading-relaxed text-muted">
            {MY_DEALS_QUIET_IDLE}{" "}
            <Link href="/intent" className="text-foreground underline-offset-2 hover:underline">
              {INTENT_TEXTAREA_LABEL}
            </Link>
          </p>
        ) : null}
        <p className="text-sm text-muted">{APPROVE_MICRO}</p>
      </header>

      {deals.length ? (
        <DealsTable deals={deals} remaining={`Remaining ${remaining}`} payment={payment} />
      ) : (
        <Card className="px-5 py-8" data-surface="my-deals-empty">
          <p className="text-base font-medium tracking-tight">{MY_DEALS_EMPTY_TITLE}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{MY_DEALS_EMPTY_BODY}</p>
          <div className="mt-5">
            <IntentForm compact emailMissing={!hasReachableEmail(user)} />
          </div>
        </Card>
      )}

      <p className="text-xs text-muted">
        Demo · not live traction · no invented GMV
      </p>
    </div>
  );
}
