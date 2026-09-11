import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Neon-ready schema. POC serves from the imported ledger + in-memory store
 * until DATABASE_URL is connected. Never store card PAN, CVV, or full account
 * numbers — vault references and last4 only.
 */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
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
  amountStatus: text("amount_status").notNull().default("imported_unverified"),
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
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const spendLimits = pgTable("spend_limits", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
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
