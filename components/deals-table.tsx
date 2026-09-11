import Link from "next/link";
import { DealApproveActions } from "@/components/deal-approve-actions";
import { DealsPhoneList } from "@/components/deals-phone-list";
import { DealAmount } from "@/components/money";
import { Badge } from "@/components/ui/badge";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn, formatRelative } from "@/lib/utils";
import type { Deal } from "@/lib/types";

function updatedAt(deal: Deal) {
  return deal.timeline.at(-1)?.at ?? deal.openedAt;
}

export function DealsTable({
  deals,
  remaining,
  payment,
}: {
  deals: Deal[];
  remaining: string;
  payment: string;
}) {
  return (
    <>
      <DealsPhoneList deals={deals} remaining={remaining} payment={payment} />
      <div
        className={cn(
          "hidden overflow-x-auto rounded-[var(--bb-radius)] bg-surface md:block",
          SURFACE_RING_CLASS,
        )}
      >
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--bb-line)] text-[11px] uppercase tracking-[0.14em] text-muted">
              <th className="px-5 py-3 font-medium">Deal</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Spend</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--bb-line)]">
            {deals.map((deal) => (
              <tr key={deal.id} className="align-middle">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="font-medium tracking-tight hover:underline"
                  >
                    {deal.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <Badge className={DEMO_PILL_CLASS}>
                    {deal.status} · Demo
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <DealAmount deal={deal} />
                </td>
                <td className="px-5 py-3.5 text-muted">
                  {formatRelative(updatedAt(deal))}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  {deal.status === "Needs you" ? (
                    <DealApproveActions
                      dealId={deal.id}
                      status={deal.status}
                      title={deal.title}
                      spend={
                        deal.priceUsd > 0
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(deal.priceUsd)
                          : undefined
                      }
                      remaining={remaining}
                      payment={payment}
                      compact
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
