import { Badge } from "@/components/ui/badge";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export type HealthState = "OK" | "Degraded" | "Not connected" | "Demo" | "Stub";

const styles: Record<HealthState, string> = {
  OK: "bg-zinc-500/15 text-zinc-200 ring-zinc-400/20",
  Degraded: "bg-amber-500/10 text-amber-200 ring-amber-400/25",
  "Not connected": "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
  Demo: DEMO_PILL_CLASS,
  Stub: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
};

export function HealthPill({ state }: { state: HealthState }) {
  return <Badge className={cn(styles[state])}>{state}</Badge>;
}
