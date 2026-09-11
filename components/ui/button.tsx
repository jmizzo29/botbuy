import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON_CLASS, PRIMARY_BUTTON_STYLE } from "@/lib/ui-tokens";
// Designer wire notes: primary is Electric Teal fill + dark label.

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium shadow-none transition-colors disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: PRIMARY_BUTTON_CLASS,
        secondary:
          "bg-white/5 text-stone-100 hover:bg-white/10 ring-1 ring-[color-mix(in_srgb,var(--bb-text)_6%,transparent)]",
        ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
        outline:
          "ring-1 ring-[color-mix(in_srgb,var(--bb-text)_6%,transparent)] bg-transparent text-stone-100 hover:bg-white/5",
        danger: "bg-danger/15 text-danger hover:bg-danger/25",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 font-semibold md:h-13",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const isPrimary = variant === undefined || variant === "default";
  return (
    <Comp
      data-contrast={isPrimary ? "primary" : variant}
      className={cn(buttonVariants({ variant, size }), className)}
      style={isPrimary ? { ...PRIMARY_BUTTON_STYLE, ...style } : style}
      {...props}
    />
  );
}

export { buttonVariants };
