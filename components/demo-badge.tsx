import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MetricSource } from "@/lib/types";

const copy: Record<MetricSource, { label: string; className: string }> = {
  stub: {
    label: "Demo / stub metrics — not live",
    className: "bg-amber-500/10 text-amber-200 ring-amber-400/25",
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
    className: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/20",
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
        "bg-amber-500/10 text-amber-200 ring-amber-400/25",
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
        "bg-amber-500/10 text-amber-200 ring-amber-400/25",
        className,
      )}
    >
      Demo / empty
    </Badge>
  );
}
