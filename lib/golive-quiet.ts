import { formatUsdCompact } from "@/lib/money";
import type { Intent, SpendLimits, VaultRef } from "@/lib/types";

/**
 * Track E · Go-live (Run BotBuyer) · Quiet Capital.
 * Onboarding chrome — not a fifth tab. Auto-approve OFF. EXAMPLE until CHO.
 * Recap is a masked method only. Never a wallet or a stored balance.
 */

export const GOLIVE_INCOMPLETE_TITLE = "Go live";
export const GOLIVE_INCOMPLETE_SUB =
  "Finish setup before BotBuyer can search. Nothing runs until you say so.";

export const GOLIVE_READY_TITLE = "Ready to run";
export const GOLIVE_READY_SUB =
  "Recap your setup. BotBuyer starts searching when you run it.";

export const GOLIVE_RUNNING_STATUS = "Running";
export const GOLIVE_RUNNING_TITLE = "BotBuyer is searching";
export const GOLIVE_RUNNING_COPY =
  "Working against your intent. Deals that need you will land in Needs you — nothing is charged until you approve.";

export const GOLIVE_VIEW_SEARCHES = "View searches";
export const GOLIVE_RECAP_LABEL = "Setup recap";
export const GOLIVE_ADD_METHOD = "Add payment method";
export const GOLIVE_SET_INTENT = "Set intent";
export const GOLIVE_SET_SPEND = "Set spend limit";

export const GOLIVE_HONESTY_APPROVE = "BotBuyer only runs what you approve.";
export const GOLIVE_HONESTY_CHARGE =
  "Nothing is charged until you approve a deal.";
export const GOLIVE_AUTO_OFF = "Auto-approve off.";
export const GOLIVE_EXAMPLE_CHIP = "EXAMPLE · not CHO-verified";

export const GOLIVE_INTENT_HREF = "/intent/new";
export const GOLIVE_SPEND_HREF = "/vault?panel=spend-limit";
export const GOLIVE_METHOD_HREF = "/vault";
export const GOLIVE_SEARCHES_HREF = "/home";

export type GolivePanel = "incomplete" | "ready" | "running";

export type GoliveRow = {
  label: string;
  meta: string;
  done: boolean;
  href?: string;
  hrefLabel?: string;
};

export type GoliveModel = {
  panel: GolivePanel;
  title: string;
  sub: string;
  rows: GoliveRow[];
  secondaryHref?: string;
  secondaryLabel?: string;
  recap: string[];
};

export const GOLIVE_EXAMPLE: Record<GolivePanel, GoliveModel> = {
  incomplete: {
    panel: "incomplete",
    title: GOLIVE_INCOMPLETE_TITLE,
    sub: GOLIVE_INCOMPLETE_SUB,
    rows: [
      { label: "Intent", meta: "Mid-market SaaS · set", done: true },
      { label: "Spend limit", meta: "$25,000 / month", done: true },
      {
        label: "Payment method",
        meta: "Not linked",
        done: false,
        href: "/craft/vault?panel=empty",
        hrefLabel: GOLIVE_ADD_METHOD,
      },
    ],
    secondaryHref: "/craft/vault?panel=empty",
    secondaryLabel: GOLIVE_ADD_METHOD,
    recap: [],
  },
  ready: {
    panel: "ready",
    title: GOLIVE_READY_TITLE,
    sub: GOLIVE_READY_SUB,
    rows: [
      { label: "Intent", meta: "Mid-market SaaS · ARR $2–8M", done: true },
      { label: "Spend limit", meta: "$25,000 / month", done: true },
      { label: "Payment method", meta: "Visa · •••• 4242", done: true },
    ],
    recap: [
      "Intent · Mid-market SaaS · ARR $2–8M",
      "Spend limit · $25,000 / month",
      "Payment · Visa · •••• 4242",
    ],
  },
  running: {
    panel: "running",
    title: GOLIVE_RUNNING_TITLE,
    sub: GOLIVE_RUNNING_COPY,
    rows: [],
    recap: [
      "Intent · Mid-market SaaS · ARR $2–8M",
      "Spend limit · $25,000 / month",
      "Payment · Visa · •••• 4242",
    ],
  },
};

export function golivePanelOf(value: string | undefined): GolivePanel {
  if (value === "ready" || value === "running" || value === "incomplete") {
    return value;
  }
  return "incomplete";
}

function maskedMethod(method: VaultRef) {
  const brand = method.brand?.trim() || "Card";
  const last4 = method.last4?.trim() || "••••";
  return `${brand} · •••• ${last4}`;
}

export function goliveFromAccount(input: {
  intents: Intent[];
  limits: SpendLimits;
  methods: VaultRef[];
  panel?: string;
}): GoliveModel {
  const newest = input.intents[0];
  const intent = newest?.summary?.trim() ? newest : undefined;
  const method = input.methods.find((row) => row.status === "active" && row.last4);
  const spendSet = input.limits.monthlyLimitUsd > 0;
  const intentDone = Boolean(intent);
  const methodDone = Boolean(method);
  const all = intentDone && spendSet && methodDone;
  const asked = golivePanelOf(input.panel);
  const panel: GolivePanel = all ? (asked === "running" ? "running" : "ready") : "incomplete";

  const intentMeta = intent?.summary?.trim() || "Not set";
  const spendMeta = spendSet
    ? `${formatUsdCompact(input.limits.monthlyLimitUsd)} / month`
    : "Not set";
  const methodMeta = method ? maskedMethod(method) : "Not linked";

  const rows: GoliveRow[] = [
    intentDone
      ? { label: "Intent", meta: intentMeta, done: true }
      : {
          label: "Intent",
          meta: "Not set",
          done: false,
          href: GOLIVE_INTENT_HREF,
          hrefLabel: GOLIVE_SET_INTENT,
        },
    spendSet
      ? { label: "Spend limit", meta: spendMeta, done: true }
      : {
          label: "Spend limit",
          meta: "Not set",
          done: false,
          href: GOLIVE_SPEND_HREF,
          hrefLabel: GOLIVE_SET_SPEND,
        },
    methodDone
      ? { label: "Payment method", meta: methodMeta, done: true }
      : {
          label: "Payment method",
          meta: "Not linked",
          done: false,
          href: GOLIVE_METHOD_HREF,
          hrefLabel: GOLIVE_ADD_METHOD,
        },
  ];

  const missing = rows.find((row) => !row.done);
  const readyTitle = panel === "incomplete" ? GOLIVE_INCOMPLETE_TITLE : GOLIVE_READY_TITLE;
  const readySub = panel === "incomplete" ? GOLIVE_INCOMPLETE_SUB : GOLIVE_READY_SUB;

  return {
    panel,
    title: panel === "running" ? GOLIVE_RUNNING_TITLE : readyTitle,
    sub: panel === "running" ? GOLIVE_RUNNING_COPY : readySub,
    rows,
    secondaryHref: missing?.href,
    secondaryLabel: missing?.hrefLabel,
    recap: [
      `Intent · ${intentMeta}`,
      `Spend limit · ${spendMeta}`,
      `Payment · ${methodMeta}`,
    ],
  };
}
