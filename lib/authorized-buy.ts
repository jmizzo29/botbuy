/**
 * STAGE M3 — vault / Link authorized-buy rails scaffold.
 *
 * Official Stripe Checkout Sessions API only (MCP/API-first).
 * Least-privilege vs Elements / raw PaymentIntents: hosted Checkout + Link
 * via Dashboard dynamic methods. Never `payment_method_types`.
 *
 * Prep does not charge. Auto-approve OFF. Fail-closed.
 * Card rail Available ≠ live. Never claim live pay.
 * Dedicated BOTBUY_STRIPE_* only — never Autofleeto / generic STRIPE_SECRET_KEY.
 * Encrypted payment tokens / last4 only. No card PAN in logs or chat.
 */
import { assertAuthorizedBuyAllowed } from "@/lib/connectors/approve-gate";
import { ConnectorError } from "@/lib/connectors/types";
import {
  appendDealEvent,
  getDeal,
  listDealEvents,
  persistEngineStore,
  recordAuditLog,
} from "@/lib/store";
import { sanitizeAuditMetadata } from "@/lib/connectors/sanitize";
import {
  AUTHORIZED_BUY_STRUCTURAL_HONESTY,
  HONESTY_SPEND_FALSE,
  authorizedBuyHonestyFlags,
} from "@/lib/honesty-flags";
import { isWithinHardGate, SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import type { Deal, DealStatus } from "@/lib/types";

export const AUTHORIZED_BUY_PATH = "checkout_session_prep" as const;
export const AUTHORIZED_BUY_UI = "hosted_checkout" as const;
export const AUTHORIZED_BUY_RAIL = "card" as const;

export const AUTHORIZED_BUY_H1 = "Authorized buy";

export const AUTHORIZED_BUY_SUB =
  "After you Approve, BotBuyer can prepare a Stripe/Link Checkout Session for pay-at-purchase. We don’t charge from this screen.";

export const AUTHORIZED_BUY_NOTE =
  "Card Available ≠ live. Checkout Session prep is not live pay. live=false · spend=false · charged=false. Auto-approve OFF. Fail-closed without BOTBUY_STRIPE_*.";

export const AUTHORIZED_BUY_KEYS_MISSING =
  "BOTBUY_STRIPE_SECRET_KEY is not configured. Card rail Available ≠ live. keysConfigured=false · prepared=false · sessionCreated=false · spend=false · charged=false. Auto-approve OFF. Not live pay.";

export const AUTHORIZED_BUY_KEYS_PRESENT =
  "BOTBUY_STRIPE_* present. Checkout Session params prepared. keysConfigured=true · sessionCreated=false · charged=false · spend=false. Auto-approve OFF. Not live pay until CHO wiring proven.";

export function authorizedBuyPrepEventId(dealId: string) {
  return `evt_${dealId}_authorized_buy_prep`;
}

export const AUTHORIZED_BUY_NO_CHARGE =
  "This scaffold never confirms a PaymentIntent, never captures, and never claims live pay.";

/** Dedicated BotBuy Stripe/Link env names. Never read Autofleeto secrets. */
export const BOTBUY_STRIPE_ENV_NAMES = [
  "BOTBUY_STRIPE_SECRET_KEY",
  "BOTBUY_STRIPE_PUBLISHABLE_KEY",
  "BOTBUY_STRIPE_WEBHOOK_SECRET",
  "BOTBUY_STRIPE_LIVE",
] as const;

export interface CheckoutSessionPrepParams {
  mode: "payment";
  ui_mode: "hosted";
  integration_identifier: string;
  client_reference_id: string;
  success_url: string;
  cancel_url: string;
  line_items: Array<{
    quantity: 1;
    price_data: {
      currency: "usd";
      unit_amount: number;
      product_data: { name: string };
    };
  }>;
  metadata: {
    dealId: string;
    trail: "needs_you_to_buying";
    autoApprove: "false";
    live: "false";
    charged: "false";
    spend: "false";
  };
  payment_intent_data: {
    capture_method: "manual";
    metadata: {
      dealId: string;
      autoApprove: "false";
      live: "false";
      spend: "false";
    };
  };
}

export interface AuthorizedBuyPrep {
  live: false;
  spend: false;
  charged: false;
  sessionCreated: false;
  autoApprove: false;
  failClosed: true;
  prepared: boolean;
  keysConfigured: boolean;
  publishableConfigured: boolean;
  webhookConfigured: boolean;
  path: typeof AUTHORIZED_BUY_PATH;
  ui: typeof AUTHORIZED_BUY_UI;
  rail: typeof AUTHORIZED_BUY_RAIL;
  dealId: string | null;
  dealStatus: DealStatus | null;
  trail: "needs_you_to_buying" | "missing";
  amountCents: number | null;
  amountVerified: boolean;
  honestyFlags: string[];
  reason: string;
  checkoutSession: CheckoutSessionPrepParams | null;
}

function truthy(value: string | undefined) {
  return value === "true" || value === "1";
}

function readDedicatedSecretKey() {
  return process.env.BOTBUY_STRIPE_SECRET_KEY?.trim() ?? "";
}

function readDedicatedPublishableKey() {
  return process.env.BOTBUY_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
}

function readDedicatedWebhookSecret() {
  return process.env.BOTBUY_STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}

export function botbuyStripeSecretConfigured() {
  const value = readDedicatedSecretKey();
  return value.startsWith("rk_") || value.startsWith("sk_");
}

export function botbuyStripePublishableConfigured() {
  return readDedicatedPublishableKey().startsWith("pk_");
}

export function botbuyStripeWebhookConfigured() {
  return readDedicatedWebhookSecret().startsWith("whsec_");
}

/**
 * Live pay is never claimed from env. BOTBUY_STRIPE_LIVE may be set later;
 * this scaffold still returns live: false until CHO wiring is proven.
 */
export function botbuyStripeLiveClaimAllowed() {
  if (truthy(process.env.BOTBUY_STRIPE_LIVE)) {
    return false;
  }
  return false;
}

function appOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://botbuyer.ai";
  return raw.replace(/\/$/, "");
}

function integrationIdentifier() {
  const suffix = crypto.randomUUID().replace(/[^a-z]/gi, "").slice(0, 8).toLowerCase();
  const pad = `${suffix}authbuy`.slice(0, 8);
  return `botbuy_authbuy_${pad}`;
}

export function amountToCents(priceUsd: number) {
  if (!Number.isFinite(priceUsd) || priceUsd < 0) return 0;
  return Math.round(priceUsd * 100);
}

export function buildCheckoutSessionPrep(deal: Deal): CheckoutSessionPrepParams {
  const origin = appOrigin();
  const amountCents = amountToCents(deal.priceUsd);
  return {
    mode: "payment",
    ui_mode: "hosted",
    integration_identifier: integrationIdentifier(),
    client_reference_id: deal.id,
    success_url: `${origin}/deals/${deal.id}?checkout=return&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/deals/${deal.id}?checkout=cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: { name: deal.title },
        },
      },
    ],
    metadata: {
      dealId: deal.id,
      trail: "needs_you_to_buying",
      autoApprove: "false",
      live: "false",
      charged: "false",
      spend: "false",
    },
    payment_intent_data: {
      capture_method: "manual",
      metadata: {
        dealId: deal.id,
        autoApprove: "false",
        live: "false",
        spend: "false",
      },
    },
  };
}

function honestResult(
  partial: Omit<
    AuthorizedBuyPrep,
    | "live"
    | "spend"
    | "charged"
    | "sessionCreated"
    | "autoApprove"
    | "failClosed"
    | "path"
    | "ui"
    | "rail"
    | "honestyFlags"
  >,
): AuthorizedBuyPrep {
  return {
    live: false,
    spend: false,
    charged: false,
    sessionCreated: false,
    autoApprove: false,
    failClosed: true,
    path: AUTHORIZED_BUY_PATH,
    ui: AUTHORIZED_BUY_UI,
    rail: AUTHORIZED_BUY_RAIL,
    honestyFlags: authorizedBuyHonestyFlags({
      keysConfigured: partial.keysConfigured,
      publishableConfigured: partial.publishableConfigured,
      webhookConfigured: partial.webhookConfigured,
      prepared: partial.prepared,
    }),
    ...partial,
  };
}

/** Fail-closed Checkout prep payload. Never claims live spend or a charge. */
export function authorizedBuyFailClosed(partial: {
  reason: string;
  dealId?: string | null;
  dealStatus?: DealStatus | null;
  trail?: "needs_you_to_buying" | "missing";
  prepared?: boolean;
  amountCents?: number | null;
  amountVerified?: boolean;
}): Pick<
  AuthorizedBuyPrep,
  | "live"
  | "spend"
  | "charged"
  | "sessionCreated"
  | "autoApprove"
  | "failClosed"
  | "prepared"
  | "keysConfigured"
  | "publishableConfigured"
  | "webhookConfigured"
  | "honestyFlags"
  | "reason"
  | "checkoutSession"
> & {
  dealId: string | null;
  dealStatus: DealStatus | null;
  trail: "needs_you_to_buying" | "missing";
  amountCents: number | null;
  amountVerified: boolean;
} {
  const keysConfigured = botbuyStripeSecretConfigured();
  const publishableConfigured = botbuyStripePublishableConfigured();
  const webhookConfigured = botbuyStripeWebhookConfigured();
  const prepared = false;
  return {
    live: false,
    spend: false,
    charged: false,
    sessionCreated: false,
    autoApprove: false,
    failClosed: true,
    prepared,
    keysConfigured,
    publishableConfigured,
    webhookConfigured,
    dealId: partial.dealId ?? null,
    dealStatus: partial.dealStatus ?? null,
    trail: partial.trail ?? "missing",
    amountCents: partial.amountCents ?? null,
    amountVerified: partial.amountVerified ?? false,
    honestyFlags: authorizedBuyHonestyFlags({
      keysConfigured,
      publishableConfigured,
      webhookConfigured,
      prepared,
    }),
    reason: partial.reason,
    checkoutSession: null,
  };
}

export function authorizedBuyVaultStatus(): Pick<
  AuthorizedBuyPrep,
  | "live"
  | "spend"
  | "charged"
  | "sessionCreated"
  | "autoApprove"
  | "failClosed"
  | "keysConfigured"
  | "publishableConfigured"
  | "webhookConfigured"
  | "path"
  | "ui"
  | "rail"
  | "honestyFlags"
  | "reason"
> {
  const keysConfigured = botbuyStripeSecretConfigured();
  const publishableConfigured = botbuyStripePublishableConfigured();
  const webhookConfigured = botbuyStripeWebhookConfigured();
  return {
    live: false,
    spend: false,
    charged: false,
    sessionCreated: false,
    autoApprove: false,
    failClosed: true,
    keysConfigured,
    publishableConfigured,
    webhookConfigured,
    path: AUTHORIZED_BUY_PATH,
    ui: AUTHORIZED_BUY_UI,
    rail: AUTHORIZED_BUY_RAIL,
    honestyFlags: authorizedBuyHonestyFlags({
      keysConfigured,
      publishableConfigured,
      webhookConfigured,
      prepared: false,
    }),
    reason: keysConfigured ? AUTHORIZED_BUY_KEYS_PRESENT : AUTHORIZED_BUY_KEYS_MISSING,
  };
}

export function prepareAuthorizedBuy(input: {
  userId: string;
  dealId: string;
}): AuthorizedBuyPrep {
  void botbuyStripeLiveClaimAllowed();
  const keysConfigured = botbuyStripeSecretConfigured();
  const publishableConfigured = botbuyStripePublishableConfigured();
  const webhookConfigured = botbuyStripeWebhookConfigured();

  const gate = assertAuthorizedBuyAllowed({
    userId: input.userId,
    dealId: input.dealId,
  });
  const deal = gate.deal;

  if (!isWithinHardGate(deal.priceUsd)) {
    throw new ConnectorError(
      `Deal amount is outside the spend limit ($${SPEND_HARD_GATE_USD}). Fail-closed. Not live pay.`,
      "approve",
    );
  }

  const amountCents = amountToCents(deal.priceUsd);
  if (amountCents <= 0) {
    const result = honestResult({
      prepared: false,
      keysConfigured,
      publishableConfigured,
      webhookConfigured,
      dealId: deal.id,
      dealStatus: deal.status,
      trail: "needs_you_to_buying",
      amountCents,
      amountVerified: deal.amountVerified && deal.priceVerified,
      reason:
        "Deal amount is zero. Checkout Session prep skipped. Not live pay.",
      checkoutSession: null,
    });
    recordAuthorizedBuyAudit(input.userId, result);
    persistAuthorizedBuyDealEvent(input.userId, result);
    return result;
  }

  // Fail-closed: never prepare Checkout Session params without BOTBUY_STRIPE_*.
  // Do not read Autofleeto / generic STRIPE_SECRET_KEY. Do not charge.
  const checkoutSession = keysConfigured ? buildCheckoutSessionPrep(deal) : null;
  const result = honestResult({
    prepared: keysConfigured,
    keysConfigured,
    publishableConfigured,
    webhookConfigured,
    dealId: deal.id,
    dealStatus: deal.status,
    trail: "needs_you_to_buying",
    amountCents,
    amountVerified: deal.amountVerified && deal.priceVerified,
    reason: keysConfigured ? AUTHORIZED_BUY_KEYS_PRESENT : AUTHORIZED_BUY_KEYS_MISSING,
    checkoutSession,
  });
  recordAuthorizedBuyAudit(input.userId, result);
  persistAuthorizedBuyDealEvent(input.userId, result);
  return result;
}

function persistAuthorizedBuyDealEvent(userId: string, result: AuthorizedBuyPrep) {
  if (!result.dealId) return;
  const deal = getDeal(result.dealId, userId);
  if (!deal) return;
  const id = authorizedBuyPrepEventId(deal.id);
  if (listDealEvents(deal.id).some((event) => event.id === id)) return;
  const at = new Date().toISOString();
  const detail = [
    "live=false",
    HONESTY_SPEND_FALSE,
    `charged=${String(result.charged)}`,
    `sessionCreated=${String(result.sessionCreated)}`,
    `prepared=${String(result.prepared)}`,
    `keysConfigured=${String(result.keysConfigured)}`,
    `publishableConfigured=${String(result.publishableConfigured)}`,
    `webhookConfigured=${String(result.webhookConfigured)}`,
    `autoApprove=${String(result.autoApprove)}`,
    `amountCents=${String(result.amountCents)}`,
    `amountVerified=${String(result.amountVerified)}`,
    `trail=${result.trail}`,
    ...AUTHORIZED_BUY_STRUCTURAL_HONESTY,
    result.reason,
  ].join(" · ");
  appendDealEvent({
    id,
    dealId: deal.id,
    type: "note",
    stage: "purchase",
    title: "Checkout Session prep",
    detail,
    at,
    status: "done",
    actor: "engine",
    metadata: sanitizeAuditMetadata({
      live: false,
      spend: false,
      charged: false,
      sessionCreated: false,
      autoApprove: false,
      prepared: result.prepared,
      keysConfigured: result.keysConfigured,
      publishableConfigured: result.publishableConfigured,
      webhookConfigured: result.webhookConfigured,
      amountCents: result.amountCents,
      amountVerified: result.amountVerified,
      trail: result.trail,
      path: result.path,
    }),
  });
  void persistEngineStore().catch((error) => {
    console.error(
      "[authorized-buy] persist after prep failed",
      error instanceof Error ? error.message : error,
    );
  });
}

function recordAuthorizedBuyAudit(userId: string, result: AuthorizedBuyPrep) {
  recordAuditLog({
    userId,
    action: "authorized_buy.prep",
    entityType: "deal",
    entityId: result.dealId ?? "missing",
    metadata: sanitizeAuditMetadata({
      live: false,
      spend: false,
      charged: false,
      sessionCreated: false,
      autoApprove: false,
      prepared: result.prepared,
      keysConfigured: result.keysConfigured,
      trail: result.trail,
      dealStatus: result.dealStatus,
      amountCents: result.amountCents,
      amountVerified: result.amountVerified,
      path: result.path,
      ui: result.ui,
    }),
  });
}

export type { ConnectorError };
