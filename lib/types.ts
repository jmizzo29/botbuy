/** FROZEN exact chips. Do not rename. */
export const DEAL_STATUSES = [
  "Searching",
  "Found",
  "Buying",
  "Needs you",
  "Closing",
  "Closed",
  "Failed",
  "Paused",
] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

export type UserRole = "customer" | "admin";

export type AmountStatus = "verified" | "pending_verify" | "imported_unverified";

export type AgentStage = "search" | "diligence" | "purchase" | "gate" | "close";

export type AgentEventStatus = "done" | "active" | "blocked" | "pending";

export type MetricSource = "stub" | "imported_ledger" | "derived_seed" | "live";

export const USAGE_PHASES = ["search", "buy", "close", "operate"] as const;
export type UsagePhase = (typeof USAGE_PHASES)[number];

export const USAGE_STATUSES = ["ok", "error", "aborted"] as const;
export type UsageStatus = (typeof USAGE_STATUSES)[number];

export const USAGE_COST_KIND = "estimate" as const;
export type UsageCostKind = typeof USAGE_COST_KIND;

export interface UsageTokensEst {
  input: number | null;
  output: number | null;
  total: number | null;
}

/** Coarse token/usage meter v0. Rows stay Estimate until CHO promote. */
export interface UsageEvent {
  id: string;
  dealId: string;
  runId: string;
  phase: UsagePhase;
  stage: UsagePhase;
  modelCalls: number;
  toolCalls: number;
  tokensEst: UsageTokensEst;
  provider: string;
  model: string;
  startedAt: string;
  endedAt: string;
  status: UsageStatus;
  costKind: UsageCostKind;
  billed: false;
  live: false;
}

export interface UsageDayRollup {
  day: string;
  runs: number;
  modelCalls: number;
  toolCalls: number;
  tokensEst: UsageTokensEst;
  costKind: UsageCostKind;
}

export interface UsageUserRollup {
  userId: string;
  name: string;
  runs: number;
  modelCalls: number;
  toolCalls: number;
  tokensEst: UsageTokensEst;
  costKind: UsageCostKind;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  clerkUserId?: string | null;
  notificationEmail?: string | null;
  phone?: string | null;
}

export interface Receipt {
  merchant: string;
  order_id: string;
  term?: string;
  account?: string;
  txn_id?: string;
  item?: string;
  payment_method?: string;
}

export interface Escrow {
  provider: string;
  transaction_id: string;
  flippa_listing?: string;
  stage?: string;
}

export interface DomainTransfer {
  registrar: string;
  order_id: string;
  amount_usd: number;
  status: string;
  paid_at?: string;
}

export interface AgentEvent {
  id: string;
  stage: AgentStage;
  title: string;
  detail: string;
  at: string;
  status: AgentEventStatus;
}

export type DealEventType =
  | "import"
  | "status"
  | "search"
  | "diligence"
  | "purchase"
  | "gate"
  | "close"
  | "note";

export type DealEventActor = "imported" | "reconstructed" | "engine" | "agent";

export interface DealEvent {
  id: string;
  dealId: string;
  type: DealEventType;
  stage?: AgentStage;
  title: string;
  detail: string;
  at: string;
  status: AgentEventStatus;
  actor: DealEventActor;
  fromStatus?: DealStatus | null;
  toStatus?: DealStatus | null;
}

export interface DealVerification {
  passed: boolean;
  skipped_reason?: "imported_ledger" | null;
  artifacts: string[];
  receipt_refs: Record<string, string>;
}

export interface Deal {
  id: string;
  userId: string;
  title: string;
  category: string;
  marketplace: string;
  status: DealStatus;
  priceUsd: number;
  currency: string;
  openedAt: string;
  closedAt: string | null;
  parentDealId: string | null;
  receipt: Receipt | null;
  escrow: Escrow | null;
  domainTransfer: DomainTransfer | null;
  blockers: string[];
  notes: string;
  source: string;
  agentExecuted: boolean;
  priceVerified: boolean;
  amountVerified: boolean;
  amountStatus: AmountStatus;
  evidencePath: string | null;
  verification: DealVerification;
  timeline: AgentEvent[];
}

export interface ProofStats {
  verified_at: string | null;
  closedVolumeUsd: number | null;
  successRate: number | null;
  activeBuyers: number | null;
  message: string | null;
}

export interface Intent {
  id: string;
  userId: string;
  summary: string;
  categories: string[];
  maxPriceUsd: number;
  status: "active" | "paused" | "fulfilled";
  createdAt: string;
  templateId?: string | null;
  mustInclude?: string | null;
  avoid?: string | null;
}

export interface SpendLimits {
  userId: string;
  hardGateUsd: number;
  dailyLimitUsd: number;
  weeklyLimitUsd: number;
  monthlyLimitUsd: number;
  perDealLimitUsd: number;
  autoApprove: false;
  updatedAt: string;
}

export interface VaultRef {
  id: string;
  userId: string;
  provider: string;
  vaultRef: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  status: "active" | "inactive";
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AdminMetrics {
  live: boolean;
  badge: string;
  generatedAt: string;
  traffic: {
    source: MetricSource;
    plausible: { connected: boolean; domain: string | null };
    vercelAnalytics: { connected: boolean };
    visits: number | null;
    uniqueVisitors: number | null;
    topPages: { path: string; views: number }[];
    referrers: { source: string; views: number }[];
  };
  users: {
    source: MetricSource;
    signups: number | null;
    activeUsers: number | null;
    seededCustomers: number;
    funnel: { step: string; count: number | null }[];
  };
  revenue: {
    source: MetricSource;
    stripeConnected: boolean;
    mrr: number | null;
    arr: number | null;
    arpu: number | null;
    churn: number | null;
    paid: number | null;
    trial: number | null;
  };
  dealsOps: {
    source: MetricSource;
    byStatus: Record<DealStatus, number>;
    underManagementUsd: number;
    closedUsd: number;
    successRate: number | null;
    dealCount: number;
    note: string;
  };
  systemHealth: {
    source: MetricSource;
    agentRunsExecuted: number;
    reconstructedEvents: number;
    humanGateDeals: number;
    humanGateItems: number;
    spendMonthUsd: number;
    monthlyLimitUsd: number;
    note: string;
  };
  finance: {
    source: MetricSource;
    live: boolean;
    startupCostsUsd: number;
    startupCostsPendingUsd: number;
    domainsInfraUsd: number;
    domainsInfraPendingUsd: number;
    customerGmvUsd: number;
    customerGmvPendingUsd: number;
    seedCashOutUsd: number;
    burnMonthlyUsd: number | null;
    runwayMonths: number | null;
    note: string;
  };
  usage: {
    live: false;
    badge: string;
    source: MetricSource;
    costKind: UsageCostKind;
    billed: false;
    days: UsageDayRollup[];
    byUser: UsageUserRollup[];
    totals: {
      runs: number;
      modelCalls: number;
      toolCalls: number;
      tokensEst: UsageTokensEst;
    };
    note: string;
  };
}
