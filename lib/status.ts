import type { DealStatus } from "@/lib/types";

export const statusStyles: Record<
  DealStatus,
  { label: string; className: string }
> = {
  Searching: {
    label: "Searching",
    className: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  },
  Found: {
    label: "Found",
    className: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
  },
  Buying: {
    label: "Buying",
    className: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  },
  "Needs you": {
    label: "Needs you",
    className: "bg-amber-500/15 text-amber-200 ring-amber-400/30",
  },
  Closing: {
    label: "Closing",
    className: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  },
  Closed: {
    label: "Closed",
    className: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  },
  Failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-300 ring-red-500/20",
  },
  Paused: {
    label: "Paused",
    className: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  },
};
