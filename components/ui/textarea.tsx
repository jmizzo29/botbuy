import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl bg-surface px-3 py-3 text-sm leading-relaxed text-foreground outline-none ring-1 ring-[var(--bb-line)] placeholder:text-muted focus:ring-primary/40",
        className,
      )}
      {...props}
    />
  );
}
