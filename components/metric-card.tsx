import { SourceBadge } from "@/components/demo-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MetricSource } from "@/lib/types";

export function MetricTile({
  label,
  value,
  hint,
  empty = false,
}: {
  label: string;
  value: string;
  hint?: string;
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p
        className={cn(
          "money mt-1 text-2xl font-medium tracking-tight",
          empty && "text-zinc-600",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function AdminSection({
  title,
  source,
  description,
  children,
}: {
  title: string;
  source: MetricSource;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        <SourceBadge source={source} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
