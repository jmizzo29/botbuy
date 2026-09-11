import { DealsTable } from "@/components/deals-table";
import { NeedsYouCta, SearchingEmpty } from "@/components/empty-ctas";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { APPROVE_MICRO, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { hydrateStore, listDeals } from "@/lib/store";
import { formatUsd } from "@/lib/money";
import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: "My deals",
};

export default async function HomePage() {
  await hydrateStore();
  const user = getCurrentUser();
  const deals = listDeals(user.id);
  const gated = deals.filter((deal) => deal.status === "Needs you");
  const searching = deals.some((deal) => deal.status === "Searching");

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {user.company} · {MY_DEALS_LABEL}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{MY_DEALS_LABEL}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge className={DEMO_PILL_CLASS}>
            Spend remaining {formatUsd(SPEND_HARD_GATE_USD)} · Demo
          </Badge>
          <Badge className={DEMO_PILL_CLASS}>
            {deals.length} deal{deals.length === 1 ? "" : "s"}
          </Badge>
          <Badge className={DEMO_PILL_CLASS}>Approval required</Badge>
        </div>
        <p className="text-sm text-muted">{APPROVE_MICRO}</p>
      </header>

      {gated.length ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] bg-surface px-5 py-4 ring-1 ring-[var(--bb-line)]">
          <p className="text-sm text-muted">
            {gated.length} deal{gated.length === 1 ? "" : "s"} need you. Auto-approve
            OFF.
          </p>
          <NeedsYouCta href={`/deals/${gated[0].id}`} />
        </div>
      ) : null}

      {searching ? <SearchingEmpty /> : null}

      <DealsTable deals={deals} />

      <p className="text-xs text-muted">
        Demo · not live traction · no invented GMV
      </p>
    </div>
  );
}
