import { DealsTable } from "@/components/deals-table";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import {
  AUTO_APPROVE_OFF,
  MY_DEALS_LABEL,
  SPEND_LIMIT_PILL,
} from "@/lib/cpo-techlux";
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
      </header>

      <DealsTable deals={deals} remaining={`Remaining ${remaining}`} payment={payment} />

      <p className="text-xs text-muted">
        Demo · not live traction · no invented GMV
      </p>
    </div>
  );
}
