import { cn } from "@/lib/utils";
import { amountCopy, isVerifiedAmount } from "@/lib/deal-ui";
import { formatUsd } from "@/lib/money";
import type { Deal } from "@/lib/types";

/** CHO: unverified amounts never render as confident $. */
export function DealAmount({
  deal,
  className,
}: {
  deal: Deal;
  className?: string;
}) {
  if (isVerifiedAmount(deal)) {
    return (
      <span className={cn("money inline-flex items-baseline", className)}>
        {formatUsd(deal.priceUsd)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-sm font-medium text-amber-200 text-right",
        className,
      )}
    >
      {amountCopy(deal)}
    </span>
  );
}
