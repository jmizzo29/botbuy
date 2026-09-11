import { Badge } from "@/components/ui/badge";
import {
  BOARD_PURCHASE_LABEL,
  isBoardPurchase,
  isImported,
} from "@/lib/deal-ui";
import type { Deal } from "@/lib/types";

export function DealBadges({ deal }: { deal: Deal }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {isImported(deal) ? (
        <Badge className="bg-sky-500/10 text-sky-800 ring-sky-400/25">
          Imported
        </Badge>
      ) : null}
      {isBoardPurchase(deal) ? (
        <Badge className="bg-accent/15 text-accent ring-accent/25">
          {BOARD_PURCHASE_LABEL}
        </Badge>
      ) : null}
    </span>
  );
}
