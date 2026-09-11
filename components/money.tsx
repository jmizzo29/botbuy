import { formatUsd } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/types";

export function DealAmount({
  deal,
  className,
}: {
  deal: Deal;
  className?: string;
}) {
  if (deal.priceVerified && deal.amountStatus === "verified") {
    return (
      <span className={cn("money inline-flex items-baseline", className)}>
        {formatUsd(deal.priceUsd)}
      </span>
    );
  }

  const label =
    deal.amountStatus === "pending_verify"
      ? "Pending verify"
      : "Imported · unverified";

  return (
    <span className={cn("inline-flex flex-col items-end text-right", className)}>
      <span className="text-sm font-medium text-amber-200">{label}</span>
      <span className="mt-0.5 text-[11px] text-zinc-500">
        listed {formatUsd(deal.priceUsd)} · not verified spend
      </span>
    </span>
  );
}
