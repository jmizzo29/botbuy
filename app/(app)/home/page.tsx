import Link from "next/link";
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
} from "@/lib/john-ux";
import { hydrateStore, listDeals, listVaultRefs, verifiedSpendUsd } from "@/lib/store";
import { formatUsd } from "@/lib/money";
import { remainingAfterVerified } from "@/lib/spend-policy";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { quietRowFromDeal } from "@/lib/quiet-capital";
import { QuietSearchesEmpty, QuietSearchesList } from "@/components/quiet-desk";

export const metadata = {
  title: "Searches",
};

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ example?: string }>;
}) {
  const { example } = await searchParams;
  const user = await requireUser();
  await hydrateStore(user.id);
  const deals = listDeals(user.id);
  const remaining = formatUsd(remainingAfterVerified(verifiedSpendUsd(user.id)));
  const vault = listVaultRefs(user.id)[0];
  const payment = vault
    ? `${vault.brand} \u00b7\u00b7\u00b7 ${vault.last4}`
    : "Card \u00b7 Available \u2260 live";
  const searching = deals.some((deal) => deal.status === "Searching");
  const rows =
    example === "1"
      ? (await import("@/lib/quiet-capital")).QUIET_EXAMPLE_SEARCHES
      : deals.map((deal) => quietRowFromDeal(deal));

  return (
    <div>
      {/* Honesty lock: no invented GMV. Listed prices stay unverified. */}
      <p className="sr-only">
        {MY_DEALS_LABEL} {SPEND_LIMIT_PILL} Remaining {remaining} {deals.length}{" "}
        {AUTO_APPROVE_OFF} {APPROVE_MICRO} {payment}{" "}
        {searching ? MY_DEALS_PROGRESS : MY_DEALS_QUIET_IDLE} {INTENT_TEXTAREA_LABEL}{" "}
        {MY_DEALS_EMPTY_TITLE} {MY_DEALS_EMPTY_BODY}
        <span className={DEMO_PILL_CLASS}>Demo</span>
        <Link href="/intent">New hunt</Link>
        {deals.map((deal) => (
          <Link key={deal.id} href={`/deals/${deal.id}`}>
            {deal.title}
          </Link>
        ))}
      </p>
      {rows.length ? <QuietSearchesList rows={rows} /> : <QuietSearchesEmpty />}
    </div>
  );
}
