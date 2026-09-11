import { formatUsd } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { AmountStatus } from "@/lib/types";

export function Money({
  amount,
  status,
  className,
}: {
  amount: number;
  status?: AmountStatus;
  className?: string;
}) {
  return (
    <span className={cn("money inline-flex items-baseline gap-2", className)}>
      <span>{formatUsd(amount)}</span>
      {status && status !== "verified" ? (
        <span className="text-[11px] font-medium tracking-normal text-amber-200/80">
          {status === "pending_verify" ? "pending verify" : "imported · unverified"}
        </span>
      ) : null}
    </span>
  );
}
