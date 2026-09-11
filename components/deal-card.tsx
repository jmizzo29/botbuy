import Link from "next/link";
import { DealAmount } from "@/components/money";
import { StatusPill } from "@/components/status-pill";
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
      className="block rounded-2xl bg-[#111113] px-5 py-4 ring-1 ring-white/8 transition-colors hover:bg-[#161618] hover:ring-white/14"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-medium tracking-tight">
              {deal.title}
            </h3>
            <StatusPill status={deal.status} />
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {deal.marketplace} · {deal.category} · {currentStage(deal)}
          </p>
        </div>
        <DealAmount deal={deal} className="shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span>Opened {formatDate(deal.openedAt)}</span>
        {deal.closedAt ? <span>Closed {formatDate(deal.closedAt)}</span> : null}
        {deal.receipt ? <span>Order {deal.receipt.order_id}</span> : null}
        {deal.escrow ? <span>Escrow {deal.escrow.transaction_id}</span> : null}
        {deal.source === "imported" ? (
          <span>Imported · not agent-executed</span>
        ) : null}
      </div>
    </Link>
  );
}
