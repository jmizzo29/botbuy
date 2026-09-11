import { cn } from "@/lib/utils";
import { amountCopy, isVerifiedAmount } from "@/lib/deal-ui";
import { formatUsd } from "@/lib/money";
import type { Deal } from "@/lib/types";

/**
 * CPO confirm: botbuyer.ai = Closed · $179.96.
 * Other rows stay soft unless price_verified && amount_status=verified.
 * Never public ProofStrip traction.
 */
export function DealAmount({
  deal,
  className,
  withStatus = false,
  listedOk = false,
}: {
  deal: Deal;
  className?: string;
  withStatus?: boolean;
  listedOk?: boolean;
}) {
  if (isVerifiedAmount(deal)) {
    const money = formatUsd(deal.priceUsd);
    return (
      <span
        className={cn("money inline-flex items-baseline", className)}
        title={
          deal.receipt
            ? `Verified ${money} · ${deal.receipt.merchant} ${deal.receipt.order_id}${deal.receipt.txn_id ? ` / txn ${deal.receipt.txn_id}` : ""}`
            : `Verified ${money}`
        }
      >
        {withStatus ? `${deal.status} · ${money}` : money}
      </span>
    );
  }

  if (listedOk && typeof deal.priceUsd === "number" && deal.priceUsd > 0) {
    return (
      <span
        className={cn("text-sm font-medium text-demo text-right", className)}
        title="Listed · Demo · not verified spend"
      >
        {formatUsd(deal.priceUsd)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-sm font-medium text-demo text-right",
        className,
      )}
    >
      {amountCopy(deal)}
    </span>
  );
}
