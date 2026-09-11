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

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
}

export interface Receipt {
  merchant: string;
  order_id: string;
  term?: string;
  account?: string;
  txn_id?: string;
  item?: string;
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

export interface DealEvent {
  id: string;
  dealId: string;
  type: DealEventType;
  stage?: AgentStage;
  title: string;
  detail: string;
  at: string;
  status: AgentEventStatus;
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
  amountStatus: AmountStatus;
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
}

export interface SpendLimits {
  userId: string;
  dailyLimitUsd: number;
  weeklyLimitUsd: number;
  monthlyLimitUsd: number;
  perDealLimitUsd: number;
  autoApprove: boolean;
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
    domainsInfraUsd: number;
    customerGmvUsd: number;
    seedCashOutUsd: number;
    burnMonthlyUsd: number | null;
    runwayMonths: number | null;
    note: string;
  };
}
