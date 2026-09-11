import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl bg-white/4 px-3 text-sm text-foreground outline-none ring-1 ring-[color-mix(in_srgb,var(--bb-text)_6%,transparent)] placeholder:text-muted focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
}
