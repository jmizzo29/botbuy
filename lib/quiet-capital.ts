import { isNonLedgerDemoSeed } from "@/lib/demo-needs-you";
import { isVerifiedAmount } from "@/lib/deal-ui";
import { formatUsdCompact } from "@/lib/money";
import type { Deal } from "@/lib/types";

/** Track B · Inner Quiet Capital. Noun searches. Auto-approve OFF. */

export const QUIET_SEARCHES_TITLE = "Searches" as const;
export const QUIET_SEARCHES_SUB =
  "Quiet queue — BotBuyer only moves when you approve." as const;
export const QUIET_SEARCHES_EMPTY_TITLE = "No searches yet" as const;
export const QUIET_SEARCHES_EMPTY_BODY =
  "Start a search. Matches land here for review — BotBuyer spends only with your OK." as const;
export const QUIET_NEW_SEARCH = "New search" as const;
export const QUIET_EXAMPLE_CHIP = "EXAMPLE" as const;
export const QUIET_EXAMPLE_EMPTY_CHIP = "EXAMPLE · not CHO-verified" as const;

export const QUIET_NEEDS_TITLE = "Needs you" as const;
export const QUIET_NEEDS_EMPTY_SUB =
  "Approve or reject — nothing is charged on this screen." as const;
export const QUIET_NEEDS_EMPTY_TITLE = "Nothing needs you" as const;
export const QUIET_NEEDS_EMPTY_BODY =
  "When a search finds a listing that needs a decision, it shows up here." as const;
export const QUIET_NEEDS_POP_SUB =
  "Decide on matches — BotBuyer only runs what you approve." as const;
export const QUIET_CHARGE_MICRO = "Nothing is charged on this screen." as const;
export const QUIET_TRUST_MICRO = "BotBuyer only runs what you approve." as const;
export const QUIET_AUTO_OFF_SENTENCE = "Auto-approve is off." as const;
export const QUIET_EMPTY_TRUST =
  "BotBuyer only runs what you approve. Auto-approve is off." as const;

export const QUIET_IMPORTED_PANEL =
  "Imported scan. Amounts are unverified. Auto-approve is off. BotBuyer has not bought this." as const;
export const QUIET_UNVERIFIED_PANEL =
  "Amounts are unverified. Auto-approve is off. BotBuyer has not bought this." as const;

export const QUIET_LOADING_TITLE = "Loading your searches" as const;
export const QUIET_LOADING_BODY = "One moment." as const;
export const QUIET_ERROR_TITLE = "Couldn’t load searches" as const;
export const QUIET_ERROR_BODY =
  "Nothing was charged. Try again, or go back home." as const;
export const QUIET_TRY_AGAIN = "Try again" as const;
export const QUIET_BACK_SEARCHES = "Back to searches" as const;

export const QUIET_APPROVE = "Approve" as const;
export const QUIET_REJECT = "Reject" as const;
export const QUIET_GROUND = "#0B1F3A" as const;
export const QUIET_TEAL = "#2DD4BF" as const;
export const QUIET_ON_TEAL = "#042F2E" as const;

export type QuietRow = {
  id: string;
  title: string;
  href?: string;
  chip: string;
  amount: string;
  example: boolean;
  live: boolean;
};

export type QuietDetail = {
  id: string;
  title: string;
  chip: string;
  example: boolean;
  amount: string;
  source: string;
  category: string;
  ask: string;
  marketplace: string;
  imported: boolean;
};

export function listedUnverified(amount: number) {
  return `Listed ${formatUsdCompact(amount)} · unverified`;
}

function deskLabel(value: string) {
  const known: Record<string, string> = {
    flippa: "Flippa",
    any_channel: "Any channel",
    software: "Software",
    imported: "Imported",
    engine: "Engine",
  };
  return (
    known[value] ??
    value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function quietAmount(deal: Pick<
  Deal,
  "id" | "priceUsd" | "priceVerified" | "amountStatus" | "source" | "status"
>) {
  if (isVerifiedAmount(deal) && deal.priceUsd > 0) {
    return formatUsdCompact(deal.priceUsd);
  }
  if (deal.priceUsd > 0) return listedUnverified(deal.priceUsd);
  return "Listed — · unverified";
}

export function quietRowFromDeal(deal: Deal): QuietRow {
  return {
    id: deal.id,
    title: deal.title,
    href: `/deals/${deal.id}`,
    chip: deal.status,
    amount: quietAmount(deal),
    example: isNonLedgerDemoSeed(deal),
    live: true,
  };
}

export function quietDetailFromDeal(deal: Deal): QuietDetail {
  const imported = deal.source === "imported" || deal.id.startsWith("ing_");
  const marketplace = deskLabel(deal.marketplace);
  return {
    id: deal.id,
    title: deal.title,
    chip: deal.status,
    example: isNonLedgerDemoSeed(deal),
    amount: quietAmount(deal),
    source: imported ? `Imported · ${marketplace}` : deskLabel(deal.source),
    category: deskLabel(deal.category),
    ask: quietAmount(deal),
    marketplace,
    imported,
  };
}

export const QUIET_EXAMPLE_DEAL: QuietDetail = {
  id: "quiet-ex-saas",
  title: "SaaS billing tools under $15k",
  chip: "Needs you",
  example: true,
  amount: "Listed $8,900 · unverified",
  source: "Imported · Flippa",
  category: "SaaS · billing",
  ask: "Listed $8,900 · unverified",
  marketplace: "Flippa",
  imported: true,
};

export const QUIET_EXAMPLE_SEARCHES: QuietRow[] = [
  {
    id: "quiet-ex-saas",
    title: "SaaS billing tools under $15k",
    href: "/craft/quiet?panel=deal",
    chip: "Needs you",
    amount: "Listed $8,900 · unverified",
    example: true,
    live: false,
  },
  {
    id: "quiet-ex-newsletter",
    title: "Newsletter stack · Flippa import",
    chip: "Searching",
    amount: "Listed $4,200 · unverified",
    example: false,
    live: false,
  },
  {
    id: "quiet-ex-micro",
    title: "Micro-SaaS · B2B dashboards",
    chip: "Watching",
    amount: "Listed $12,500 · unverified",
    example: false,
    live: false,
  },
  {
    id: "quiet-ex-chrome",
    title: "Chrome extensions · productivity",
    chip: "Searching",
    amount: "Listed $3,100 · unverified",
    example: false,
    live: false,
  },
  {
    id: "quiet-ex-content",
    title: "Content sites · niche reviews",
    chip: "Watching",
    amount: "Listed $6,750 · unverified",
    example: true,
    live: false,
  },
  {
    id: "quiet-ex-api",
    title: "API wrappers · developer tools",
    chip: "Searching",
    amount: "Listed $9,400 · unverified",
    example: false,
    live: false,
  },
];

export const QUIET_EXAMPLE_NEEDS: QuietRow[] = [
  {
    id: "quiet-ex-saas",
    title: "SaaS billing tools under $15k",
    href: "/craft/quiet?panel=deal",
    chip: "Needs you",
    amount: "Listed $8,900 · unverified",
    example: true,
    live: false,
  },
  {
    id: "quiet-ex-digest",
    title: "Email digest · niche SaaS",
    chip: "Needs you",
    amount: "Listed $5,400 · unverified",
    example: false,
    live: false,
  },
  {
    id: "quiet-ex-shopify",
    title: "Shopify app · inventory sync",
    href: "/craft/quiet?panel=deal",
    chip: "Needs you",
    amount: "Listed $11,200 · unverified",
    example: true,
    live: false,
  },
  {
    id: "quiet-ex-devtools",
    title: "Devtools template marketplace",
    chip: "Needs you",
    amount: "Listed $7,800 · unverified",
    example: false,
    live: false,
  },
];
