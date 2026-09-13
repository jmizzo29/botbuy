/**
 * STAGE — act / interact-on-behalf after Needs you → Buying.
 *
 * Fail-closed scaffolds: reply draft, email draft, register stub.
 * Never sends mail. Never claims registered. Auto-approve OFF.
 * BOTBUY_MAIL_* names honesty only. BOTBUY_MAIL_LIVE stays false.
 * Register HTTP stays on the existing connector tools path
 * (approve-gate + BOTBUY_CONNECTORS_LIVE, default false).
 */
import {
  ACT_ON_BEHALF_NOTE,
  actOnBehalfTimelineTitle,
  type ActOnBehalfAction,
} from "@/lib/act-copy";
import { buildEmailDraft, buildReplyDraft } from "@/lib/act-drafts";
import { assertActOnBehalfAllowed } from "@/lib/connectors/approve-gate";
import { connectorsLiveEnabled } from "@/lib/connectors/http";
import {
  DIGITALOCEAN_CATEGORIES,
  DOMAIN_CATEGORIES,
  GITHUB_CATEGORIES,
  HTTP_JSON_CATEGORIES,
  PHONE_CATEGORIES,
  SOFTWARE_CATEGORIES,
} from "@/lib/intent-categories";
import { extractDomainCandidate } from "@/lib/connectors/intent-route";
import { providerEnvPresent } from "@/lib/connectors/keys";
import { sanitizeAuditMetadata } from "@/lib/connectors/sanitize";
import { readSearchActHandoff } from "@/lib/connectors/search-handoff";
import {
  CONNECTOR_PROVIDERS,
  ConnectorError,
  type ConnectorProvider,
} from "@/lib/connectors/types";
import { isConnectorProvider } from "@/lib/connectors/vault";
import {
  ACT_ON_BEHALF_STRUCTURAL_HONESTY,
  actOnBehalfHonestyFlags,
} from "@/lib/honesty-flags";
import {
  appendDealEvent,
  getDeal,
  listDealEvents,
  persistEngineStore,
  recordAuditLog,
} from "@/lib/store";
import type { Deal, DealStatus } from "@/lib/types";

export {
  ACT_ON_BEHALF_ACTIONS,
  ACT_ON_BEHALF_H1,
  ACT_ON_BEHALF_NOTE,
  ACT_ON_BEHALF_PREPARED_NOT_REGISTERED,
  ACT_ON_BEHALF_PREPARED_NOT_SENT,
  ACT_ON_BEHALF_SUB,
  actOnBehalfTimelineTitle,
  isActOnBehalfAction,
  type ActOnBehalfAction,
} from "@/lib/act-copy";

export const ACT_ON_BEHALF_NO_SEND =
  "This scaffold never sends SMTP or provider mail, even if BOTBUY_MAIL_* is later present, unless a future human Approve and BOTBUY_MAIL_LIVE=true are both proven. BOTBUY_MAIL_LIVE stays false.";

export const ACT_ON_BEHALF_NO_REGISTER =
  "This act surface never calls register HTTP. Existing /api/connectors/tools register still requires Approve + BOTBUY_CONNECTORS_LIVE (default false). registered=false.";

export const BOTBUY_MAIL_ENV_NAMES = [
  "BOTBUY_MAIL_PROVIDER",
  "BOTBUY_MAIL_API_KEY",
  "BOTBUY_MAIL_FROM",
  "BOTBUY_MAIL_LIVE",
] as const;

export interface ActDraftPayload {
  kind: string;
  subject: string;
  body: string;
}

export interface ActRegisterStub {
  provider: ConnectorProvider;
  domain: string | null;
  years: 1;
  registered: false;
  result: "stub";
}

export interface ActOnBehalfPrep {
  live: false;
  spend: false;
  sent: false;
  registered: false;
  autoApprove: false;
  failClosed: true;
  action: ActOnBehalfAction | null;
  prepared: boolean;
  keysConfigured: boolean;
  mailKeysConfigured: boolean;
  connectorKeysConfigured: boolean;
  mutationsLiveEnabled: boolean;
  mailLiveClaimAllowed: false;
  dealId: string | null;
  dealStatus: DealStatus | null;
  trail: "needs_you_to_buying" | "missing";
  honestyFlags: string[];
  reason: string;
  draft: ActDraftPayload | null;
  register: ActRegisterStub | null;
}

function truthy(value: string | undefined) {
  return value === "true" || value === "1";
}

function readMailProvider() {
  return process.env.BOTBUY_MAIL_PROVIDER?.trim() ?? "";
}

function readMailApiKey() {
  return process.env.BOTBUY_MAIL_API_KEY?.trim() ?? "";
}

function readMailFrom() {
  return process.env.BOTBUY_MAIL_FROM?.trim() ?? "";
}

export function botbuyMailKeysConfigured() {
  return Boolean(readMailProvider() || readMailApiKey() || readMailFrom());
}

/**
 * Mail live is never claimed from env. BOTBUY_MAIL_LIVE may be set later;
 * this scaffold still returns live: false and sent: false.
 */
export function botbuyMailLiveClaimAllowed() {
  if (truthy(process.env.BOTBUY_MAIL_LIVE)) {
    return false;
  }
  return false;
}

export function actOnBehalfPrepEventId(dealId: string, action: ActOnBehalfAction) {
  return `evt_${dealId}_act_${action}_prep`;
}

function inferRegisterProvider(
  deal: Deal,
  handoffProvider: string | undefined,
): ConnectorProvider {
  if (handoffProvider && isConnectorProvider(handoffProvider)) {
    return handoffProvider;
  }
  const category = deal.category.trim().toLowerCase();
  if (DOMAIN_CATEGORIES.has(category)) return "namecheap";
  if (PHONE_CATEGORIES.has(category)) return "twilio";
  if (SOFTWARE_CATEGORIES.has(category)) return "shopify";
  if (DIGITALOCEAN_CATEGORIES.has(category)) return "digitalocean";
  if (GITHUB_CATEGORIES.has(category)) return "github";
  if (HTTP_JSON_CATEGORIES.has(category)) return "http_json";
  return "http_json";
}

function inferRegisterDomain(deal: Deal, handoffDomain?: string): string | null {
  if (handoffDomain?.trim()) return handoffDomain.trim().toLowerCase();
  return extractDomainCandidate(`${deal.title} ${deal.notes}`);
}

function connectorKeysFromEnv() {
  return CONNECTOR_PROVIDERS.some((provider) => providerEnvPresent(provider));
}

function honestResult(
  partial: Omit<
    ActOnBehalfPrep,
    | "live"
    | "spend"
    | "sent"
    | "registered"
    | "autoApprove"
    | "failClosed"
    | "mailLiveClaimAllowed"
    | "honestyFlags"
  >,
): ActOnBehalfPrep {
  return {
    live: false,
    spend: false,
    sent: false,
    registered: false,
    autoApprove: false,
    failClosed: true,
    mailLiveClaimAllowed: false,
    honestyFlags: actOnBehalfHonestyFlags({
      keysConfigured: partial.keysConfigured,
      prepared: partial.prepared,
      mailKeysConfigured: partial.mailKeysConfigured,
      connectorKeysConfigured: partial.connectorKeysConfigured,
      mutationsLiveEnabled: partial.mutationsLiveEnabled,
    }),
    ...partial,
  };
}

export function actOnBehalfFailClosed(partial: {
  reason: string;
  dealId?: string | null;
  dealStatus?: DealStatus | null;
  trail?: "needs_you_to_buying" | "missing";
  action?: ActOnBehalfAction | null;
}): ActOnBehalfPrep {
  const mailKeysConfigured = botbuyMailKeysConfigured();
  const connectorKeysConfigured = connectorKeysFromEnv();
  const mutationsLiveEnabled = connectorsLiveEnabled();
  return honestResult({
    action: partial.action ?? null,
    prepared: false,
    keysConfigured: mailKeysConfigured || connectorKeysConfigured,
    mailKeysConfigured,
    connectorKeysConfigured,
    mutationsLiveEnabled,
    dealId: partial.dealId ?? null,
    dealStatus: partial.dealStatus ?? null,
    trail: partial.trail ?? "missing",
    reason: partial.reason,
    draft: null,
    register: null,
  });
}

export function actOnBehalfVaultStatus(): Pick<
  ActOnBehalfPrep,
  | "live"
  | "spend"
  | "sent"
  | "registered"
  | "autoApprove"
  | "failClosed"
  | "prepared"
  | "keysConfigured"
  | "mailKeysConfigured"
  | "connectorKeysConfigured"
  | "mutationsLiveEnabled"
  | "mailLiveClaimAllowed"
  | "honestyFlags"
  | "reason"
  | "draft"
  | "register"
> {
  void botbuyMailLiveClaimAllowed();
  const mailKeysConfigured = botbuyMailKeysConfigured();
  const connectorKeysConfigured = connectorKeysFromEnv();
  return {
    live: false,
    spend: false,
    sent: false,
    registered: false,
    autoApprove: false,
    failClosed: true,
    prepared: false,
    keysConfigured: mailKeysConfigured || connectorKeysConfigured,
    mailKeysConfigured,
    connectorKeysConfigured,
    mutationsLiveEnabled: connectorsLiveEnabled(),
    mailLiveClaimAllowed: false,
    honestyFlags: actOnBehalfHonestyFlags({
      keysConfigured: mailKeysConfigured || connectorKeysConfigured,
      prepared: false,
      mailKeysConfigured,
      connectorKeysConfigured,
      mutationsLiveEnabled: connectorsLiveEnabled(),
    }),
    reason: ACT_ON_BEHALF_NOTE,
    draft: null,
    register: null,
  };
}

function registerReason(mutationsLiveEnabled: boolean, keysConfigured: boolean) {
  if (mutationsLiveEnabled) {
    return `${ACT_ON_BEHALF_NO_REGISTER} BOTBUY_CONNECTORS_LIVE is set; this surface still does not call register HTTP. keysConfigured=${String(keysConfigured)} · registered=false.`;
  }
  return `Prepared · not registered. keysConfigured=${String(keysConfigured)} · BOTBUY_CONNECTORS_LIVE=false. ${ACT_ON_BEHALF_NO_REGISTER}`;
}

export function prepareActOnBehalf(input: {
  userId: string;
  dealId: string;
  action: ActOnBehalfAction;
}): ActOnBehalfPrep {
  void botbuyMailLiveClaimAllowed();
  const mailKeysConfigured = botbuyMailKeysConfigured();
  const connectorKeysConfigured = connectorKeysFromEnv();
  const mutationsLiveEnabled = connectorsLiveEnabled();
  const keysConfigured =
    input.action === "register" ? connectorKeysConfigured : mailKeysConfigured;

  const gate = assertActOnBehalfAllowed({
    userId: input.userId,
    dealId: input.dealId,
  });
  const deal = gate.deal;
  const handoff = readSearchActHandoff(listDealEvents(deal.id));

  if (input.action === "register") {
    const provider = inferRegisterProvider(deal, handoff?.provider);
    const domain =
      inferRegisterDomain(
        deal,
        handoff?.candidates.find((row) => row.domain)?.domain,
      );
    const result = honestResult({
      action: "register",
      prepared: true,
      keysConfigured: providerEnvPresent(provider) || connectorKeysConfigured,
      mailKeysConfigured,
      connectorKeysConfigured: providerEnvPresent(provider) || connectorKeysConfigured,
      mutationsLiveEnabled,
      dealId: deal.id,
      dealStatus: deal.status,
      trail: "needs_you_to_buying",
      reason: registerReason(
        mutationsLiveEnabled,
        providerEnvPresent(provider) || connectorKeysConfigured,
      ),
      draft: null,
      register: {
        provider,
        domain,
        years: 1,
        registered: false,
        result: "stub",
      },
    });
    recordActOnBehalfAudit(input.userId, result);
    persistActOnBehalfDealEvent(input.userId, result);
    return result;
  }

  const draft =
    input.action === "reply"
      ? buildReplyDraft(deal, handoff)
      : buildEmailDraft(deal, handoff);
  const result = honestResult({
    action: input.action,
    prepared: Boolean(draft.subject && draft.body),
    keysConfigured,
    mailKeysConfigured,
    connectorKeysConfigured,
    mutationsLiveEnabled,
    dealId: deal.id,
    dealStatus: deal.status,
    trail: "needs_you_to_buying",
    reason:
      input.action === "reply"
        ? `Prepared · not sent. Merchant reply draft only. We did not invent an inbound. keysConfigured=${String(keysConfigured)}. ${ACT_ON_BEHALF_NO_SEND}`
        : `Prepared · not sent. On-behalf chase email draft only. keysConfigured=${String(keysConfigured)}. ${ACT_ON_BEHALF_NO_SEND}`,
    draft: {
      kind: draft.kind,
      subject: draft.subject,
      body: draft.body,
    },
    register: null,
  });
  recordActOnBehalfAudit(input.userId, result);
  persistActOnBehalfDealEvent(input.userId, result);
  return result;
}

function persistActOnBehalfDealEvent(userId: string, result: ActOnBehalfPrep) {
  if (!result.dealId || !result.action) return;
  const deal = getDeal(result.dealId, userId);
  if (!deal) return;
  const id = actOnBehalfPrepEventId(deal.id, result.action);
  if (listDealEvents(deal.id).some((event) => event.id === id)) return;
  const at = new Date().toISOString();
  const title = actOnBehalfTimelineTitle(result.action);
  const detail = [
    "live=false",
    "spend=false",
    `sent=${String(result.sent)}`,
    `registered=${String(result.registered)}`,
    `prepared=${String(result.prepared)}`,
    `action=${result.action}`,
    `keysConfigured=${String(result.keysConfigured)}`,
    `mailKeysConfigured=${String(result.mailKeysConfigured)}`,
    `connectorKeysConfigured=${String(result.connectorKeysConfigured)}`,
    `mutationsLiveEnabled=${String(result.mutationsLiveEnabled)}`,
    `autoApprove=${String(result.autoApprove)}`,
    `trail=${result.trail}`,
    result.draft ? `subject=${result.draft.subject}` : null,
    result.register
      ? `provider=${result.register.provider} · domain=${result.register.domain ?? "null"}`
      : null,
    ...ACT_ON_BEHALF_STRUCTURAL_HONESTY,
    result.reason,
  ]
    .filter(Boolean)
    .join(" · ");
  appendDealEvent({
    id,
    dealId: deal.id,
    type: "note",
    stage: "diligence",
    title,
    detail,
    at,
    status: "done",
    actor: "engine",
    metadata: sanitizeAuditMetadata({
      kind: "act_on_behalf",
      live: false,
      spend: false,
      sent: false,
      registered: false,
      autoApprove: false,
      prepared: result.prepared,
      action: result.action,
      keysConfigured: result.keysConfigured,
      mailKeysConfigured: result.mailKeysConfigured,
      connectorKeysConfigured: result.connectorKeysConfigured,
      mutationsLiveEnabled: result.mutationsLiveEnabled,
      trail: result.trail,
      draftSubject: result.draft?.subject ?? null,
      registerProvider: result.register?.provider ?? null,
      registerDomain: result.register?.domain ?? null,
    }),
  });
  void persistEngineStore().catch((error) => {
    console.error(
      "[act-on-behalf] persist after prep failed",
      error instanceof Error ? error.message : error,
    );
  });
}

function recordActOnBehalfAudit(userId: string, result: ActOnBehalfPrep) {
  recordAuditLog({
    userId,
    action: result.action
      ? `act_on_behalf.${result.action}.prep`
      : "act_on_behalf.prep",
    entityType: "deal",
    entityId: result.dealId ?? "missing",
    metadata: sanitizeAuditMetadata({
      live: false,
      spend: false,
      sent: false,
      registered: false,
      autoApprove: false,
      prepared: result.prepared,
      action: result.action,
      keysConfigured: result.keysConfigured,
      trail: result.trail,
      dealStatus: result.dealStatus,
    }),
  });
}

export type { ConnectorError };
