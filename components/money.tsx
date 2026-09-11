import { cn } from "@/lib/utils";
import { amountCopy, isVerifiedAmount } from "@/lib/deal-ui";
import { formatUsd } from "@/lib/money";
import type { Deal } from "@/lib/types";

/**
 * CTO SoT price component.
 * price_verified && amount_status=verified → show $ (botbuyer.ai $179.96).
 * Otherwise soft copy. This $ is never public ProofStrip traction.
 */
export function DealAmount({
  deal,
  className,
}: {
  deal: Deal;
  className?: string;
}) {
  if (isVerifiedAmount(deal)) {
    return (
      <span
        className={cn("money inline-flex items-baseline", className)}
        title={
          deal.receipt
            ? `Verified ${formatUsd(deal.priceUsd)} · ${deal.receipt.merchant} ${deal.receipt.order_id}${deal.receipt.txn_id ? ` / txn ${deal.receipt.txn_id}` : ""}`
            : `Verified ${formatUsd(deal.priceUsd)}`
        }
      >
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
