import type { DealStatus } from "@/lib/types";

export const statusStyles: Record<
  DealStatus,
  { label: string; className: string }
> = {
  Searching: {
    label: "Searching",
    className: "bg-white/80 text-demo ring-[var(--bb-line)]",
  },
  Found: {
    label: "Found",
    className: "bg-indigo-500/10 text-indigo-800 ring-indigo-500/20",
  },
  Buying: {
    label: "Buying",
    className: "bg-violet-500/10 text-violet-800 ring-violet-500/20",
  },
  "Needs you": {
    label: "Needs you",
    className: "bg-white/80 text-demo ring-[var(--bb-line)]",
  },
  Closing: {
    label: "Closing",
    className: "bg-orange-500/10 text-orange-800 ring-orange-500/20",
  },
  Closed: {
    label: "Closed",
    className: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/20",
  },
  Failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-800 ring-red-500/20",
  },
  Paused: {
    label: "Paused",
    className: "bg-black/[0.04] text-muted ring-[var(--bb-line)]",
  },
};
