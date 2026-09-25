import Link from "next/link";
import { DealBadges } from "@/components/deal-badges";
import { DealAmount } from "@/components/money";
import { StatusPill } from "@/components/status-pill";
import { HISTORY_MICRO, isImported } from "@/lib/deal-ui";
import {
  listingStatusFromNotes,
  listingStatusLabel,
} from "@/lib/ingest/candidates";
import { formatDate } from "@/lib/utils";
import type { Deal } from "@/lib/types";

function currentStage(deal: Deal) {
  const active = deal.timeline.find(
    (event) => event.status === "active" || event.status === "blocked",
  );
  if (active) return active.title;
  if (deal.status === "Closed") return "Closed";
  return deal.timeline.at(-1)?.title ?? deal.status;
}

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block rounded-2xl bg-surface px-5 py-4 ring-1 ring-[var(--bb-line)] transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-medium tracking-tight">
              {deal.title}
            </h3>
            <StatusPill status={deal.status} />
            <DealBadges deal={deal} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {deal.marketplace} · {deal.category}
            {listingStatusLabel(listingStatusFromNotes(deal.notes))
              ? ` · ${listingStatusLabel(listingStatusFromNotes(deal.notes))}`
              : ""}{" "}
            · {currentStage(deal)}
          </p>
        </div>
        <DealAmount deal={deal} withStatus className="shrink-0" />
      </div>
      {deal.blockers.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-demo">
          {deal.blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>Opened {formatDate(deal.openedAt)}</span>
        {deal.closedAt ? <span>Closed {formatDate(deal.closedAt)}</span> : null}
        {deal.receipt ? (
          <span>
            Order {deal.receipt.order_id}
            {deal.receipt.txn_id ? ` · txn ${deal.receipt.txn_id}` : ""}
          </span>
        ) : null}
        {deal.escrow ? <span>Escrow {deal.escrow.transaction_id}</span> : null}
      </div>
      {isImported(deal) ? (
        <p className="mt-2 text-xs text-muted">{HISTORY_MICRO}</p>
      ) : null}
    </Link>
  );
}
