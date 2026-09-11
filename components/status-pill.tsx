import { Badge } from "@/components/ui/badge";
import { statusStyles } from "@/lib/status";
import type { DealStatus } from "@/lib/types";

export function StatusPill({ status }: { status: DealStatus }) {
  const style = statusStyles[status];
  return <Badge className={style.className}>{style.label}</Badge>;
}
