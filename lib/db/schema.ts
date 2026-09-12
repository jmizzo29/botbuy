import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Neon-ready schema. POC serves from the imported ledger + in-memory store
 * until DATABASE_URL is connected. Never store card PAN, CVV, or full account
 * numbers — vault references and last4 only.
 */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  notificationEmail: text("notification_email"),
  phone: text("phone"),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const deals = pgTable("deals", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  category: text("category").notNull(),
  marketplace: text("marketplace").notNull(),
  status: text("status").notNull(),
  priceUsd: numeric("price_usd", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  openedAt: timestamp("opened_at", { withTimezone: true }).notNull(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  parentDealId: text("parent_deal_id"),
  receipt: jsonb("receipt"),
  escrow: jsonb("escrow"),
  domainTransfer: jsonb("domain_transfer"),
  blockers: jsonb("blockers").$type<string[]>().default([]),
  notes: text("notes"),
  source: text("source").notNull().default("imported"),
  agentExecuted: boolean("agent_executed").notNull().default(false),
  priceVerified: boolean("price_verified").notNull().default(false),
  amountVerified: boolean("amount_verified").notNull().default(false),
  amountStatus: text("amount_status").notNull().default("imported_unverified"),
  evidencePath: text("evidence_path"),
  verification: jsonb("verification").$type<{
    passed: boolean;
    skipped_reason?: "imported_ledger" | null;
    artifacts: string[];
    receipt_refs: Record<string, string>;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const intents = pgTable("intents", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  summary: text("summary").notNull(),
  categories: jsonb("categories").$type<string[]>().notNull().default([]),
  maxPriceUsd: numeric("max_price_usd", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"),
  templateId: text("template_id"),
  mustInclude: text("must_include"),
  avoid: text("avoid"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const spendLimits = pgTable("spend_limits", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  hardGateUsd: numeric("hard_gate_usd", { precision: 12, scale: 2 })
    .notNull()
    .default("1000"),
  dailyLimitUsd: numeric("daily_limit_usd", { precision: 12, scale: 2 }).notNull(),
  weeklyLimitUsd: numeric("weekly_limit_usd", { precision: 12, scale: 2 }).notNull(),
  monthlyLimitUsd: numeric("monthly_limit_usd", {
    precision: 12,
    scale: 2,
  }).notNull(),
  perDealLimitUsd: numeric("per_deal_limit_usd", {
    precision: 12,
    scale: 2,
  }).notNull(),
  autoApprove: boolean("auto_approve").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const vaultRefs = pgTable("vault_refs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  provider: text("provider").notNull(),
  vaultRef: text("vault_ref").notNull(),
  last4: text("last4").notNull(),
  brand: text("brand").notNull(),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const agentRuns = pgTable("agent_runs", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").references(() => deals.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  stage: text("stage").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export const agentEvents = pgTable("agent_events", {
  id: text("id").primaryKey(),
  dealId: text("deal_id")
    .notNull()
    .references(() => deals.id),
  stage: text("stage").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  at: timestamp("at", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
});

/** Append-only. Never update or delete rows. */
export const dealEvents = pgTable("deal_events", {
  id: text("id").primaryKey(),
  dealId: text("deal_id")
    .notNull()
    .references(() => deals.id),
  type: text("type").notNull(),
  stage: text("stage"),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  at: timestamp("at", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status"),
  actor: text("actor").notNull().default("imported"),
});

/** Coarse usage meter v0. Estimate until CHO promote. Never store Actual $. */
export const usageEvents = pgTable("usage_events", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  runId: text("run_id").notNull(),
  phase: text("phase").notNull(),
  stage: text("stage").notNull(),
  modelCalls: integer("model_calls").notNull(),
  toolCalls: integer("tool_calls").notNull(),
  tokensEstInput: integer("tokens_est_input"),
  tokensEstOutput: integer("tokens_est_output"),
  tokensEstTotal: integer("tokens_est_total"),
  provider: text("provider").notNull().default("unknown"),
  model: text("model").notNull().default("unknown"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  status: text("status").notNull(),
  costKind: text("cost_kind").notNull().default("estimate"),
  billed: boolean("billed").notNull().default(false),
  live: boolean("live").notNull().default(false),
});

/**
 * Encrypted connector token vault. Server-only.
 * ciphertext + iv are AES-256-GCM. Never log them. Revoke nulls both.
 */
export const connectedAccounts = pgTable(
  "connected_accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    clerkUserId: text("clerk_user_id"),
    provider: text("provider").notNull(),
    ciphertext: text("ciphertext"),
    iv: text("iv"),
    status: text("status").notNull().default("disconnected"),
    hint: text("hint"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("connected_accounts_user_provider_uidx").on(
      table.userId,
      table.provider,
    ),
  ],
);

export const proofSnapshots = pgTable("proof_snapshots", {
  id: text("id").primaryKey(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  closedVolumeUsd: numeric("closed_volume_usd", { precision: 12, scale: 2 }),
  successRate: numeric("success_rate", { precision: 8, scale: 4 }),
  activeBuyers: integer("active_buyers"),
  note: text("note"),
});
