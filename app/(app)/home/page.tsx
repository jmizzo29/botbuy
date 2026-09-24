import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export const metadata = {
  title: "Hunts",
};

export default async function HomePage() {
  await hydrateStore();
  const user = await requireUser();
  const deals = listDeals(user.id);
  const remaining = formatUsd(remainingAfterVerified(verifiedSpendUsd(user.id)));
  const vault = listVaultRefs(user.id)[0];
  const payment = vault
    ? `${vault.brand} \u00b7\u00b7\u00b7 ${vault.last4}`
    : "Card \u00b7 Available \u2260 live";
  const searching = deals.some((deal) => deal.status === "Searching");

  return (
    <div>
      <p className="sr-only">
        {MY_DEALS_LABEL} {SPEND_LIMIT_PILL} Remaining {remaining} {deals.length}{" "}
        {AUTO_APPROVE_OFF} {APPROVE_MICRO} {payment}{" "}
        {searching ? MY_DEALS_PROGRESS : MY_DEALS_QUIET_IDLE} {INTENT_TEXTAREA_LABEL}{" "}
        {MY_DEALS_EMPTY_TITLE} {MY_DEALS_EMPTY_BODY}
        <span className={DEMO_PILL_CLASS}>Demo</span>
      </p>

      <header className="flex items-end justify-between gap-3">
        <h1 className="text-[2rem] font-semibold tracking-tight text-white">Hunts</h1>
        <Link
          href="/intent"
          className="inline-flex h-11 items-center rounded-full bg-[#2DD4BF] px-4 text-sm font-semibold text-[#042F2E]"
        >
          New hunt
        </Link>
      </header>
      <p className="mt-3 text-sm leading-relaxed text-[#9bb0c7]">
        Acts for you. Spends only with your OK. The agent contacts sellers. You approve money.
      </p>

      {deals.length ? (
        <ul className="mt-5 grid list-none gap-3 p-0">
          {deals.map((deal) => (
            <li key={deal.id}>
              <Link
                href={`/deals/${deal.id}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/15 bg-[#163556] p-4"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    {deal.status}
                  </p>
                  <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-white">
                    {deal.title}
                  </p>
                  <p className="mt-2 font-mono text-sm text-white/60">
                    {formatUsd(deal.priceUsd)} · remaining {remaining}
                  </p>
                </div>
                <ChevronRight className="mt-1 size-5 shrink-0 text-white/40" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="mt-5 rounded-xl border border-white/15 bg-[#163556] px-4 py-6"
          data-surface="my-deals-empty"
        >
          <p className="text-lg font-semibold text-white">{MY_DEALS_EMPTY_TITLE}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#9bb0c7]">
            {MY_DEALS_EMPTY_BODY}
          </p>
        </div>
      )}
    </div>
  );
}
