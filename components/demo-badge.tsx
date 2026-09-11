import { Badge } from "@/components/ui/badge";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { MetricSource } from "@/lib/types";

const copy: Record<MetricSource, { label: string; className: string }> = {
  stub: {
    label: "Demo / stub metrics — not live",
    className: DEMO_PILL_CLASS,
  },
  imported_ledger: {
    label: "Imported ledger",
    className: "bg-sky-500/10 text-sky-200 ring-sky-400/20",
  },
  derived_seed: {
    label: "Derived from seed",
    className: "bg-zinc-500/15 text-zinc-200 ring-zinc-400/20",
  },
  live: {
    label: "Live",
    className: "bg-success/10 text-success ring-success/25",
  },
};

export function SourceBadge({
  source,
  className,
}: {
  source: MetricSource;
  className?: string;
}) {
  const item = copy[source];
  return (
    <Badge className={cn(item.className, className)}>{item.label}</Badge>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        DEMO_PILL_CLASS,
        className,
      )}
    >
      Demo · not live
    </Badge>
  );
}

export function ProofBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        DEMO_PILL_CLASS,
        className,
      )}
    >
      Demo / empty
    </Badge>
  );
}
