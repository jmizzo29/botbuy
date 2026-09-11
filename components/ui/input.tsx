import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl bg-surface px-3 text-sm text-foreground outline-none ring-1 ring-[var(--bb-line)] placeholder:text-muted focus:ring-primary/40",
        className,
      )}
      {...props}
    />
  );
}
