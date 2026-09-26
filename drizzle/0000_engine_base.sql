-- BotBuy engine BASE schema (users + deals + events + usage + intents + related).
-- Documents the CREATE TABLEs so a future BotBuy Neon clone matches lib/db/schema.ts.
-- Idempotent. Safe on a live Neon that already has Clerk users — no DROP, no wipe.
-- Apply on the BotBuy-dedicated Neon only (never Autofleeto / fleetos-production):
--   psql "$DATABASE_URL" -f drizzle/0000_engine_base.sql
-- then 0001–0003 incrementals (also IF NOT EXISTS). Or `npx drizzle-kit push`.
-- spend_limits.auto_approve must stay default false.
-- Soft HOLD: Searching deals stay $0 unverified. Land promote HOLD.

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  clerk_user_id text,
  email text NOT NULL,
  name text NOT NULL,
  company text,
  notification_email text,
  phone text,
  needs_you_alerts boolean NOT NULL DEFAULT true,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_uidx ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_user_id_uidx
  ON users (clerk_user_id)
  WHERE clerk_user_id IS NOT NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_email text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS needs_you_alerts boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS deals (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  title text NOT NULL,
  category text NOT NULL,
  marketplace text NOT NULL,
  status text NOT NULL,
  price_usd numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  opened_at timestamptz NOT NULL,
  closed_at timestamptz,
  parent_deal_id text,
  receipt jsonb,
  escrow jsonb,
  domain_transfer jsonb,
  blockers jsonb DEFAULT '[]'::jsonb,
  notes text,
  source text NOT NULL DEFAULT 'imported',
  agent_executed boolean NOT NULL DEFAULT false,
  price_verified boolean NOT NULL DEFAULT false,
  amount_verified boolean NOT NULL DEFAULT false,
  amount_status text NOT NULL DEFAULT 'imported_unverified',
  evidence_path text,
  verification jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intents (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  summary text NOT NULL,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_price_usd numeric(12, 2) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  template_id text,
  must_include text,
  avoid text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE intents ADD COLUMN IF NOT EXISTS template_id text;
ALTER TABLE intents ADD COLUMN IF NOT EXISTS must_include text;
ALTER TABLE intents ADD COLUMN IF NOT EXISTS avoid text;

CREATE TABLE IF NOT EXISTS spend_limits (
  user_id text PRIMARY KEY REFERENCES users(id),
  hard_gate_usd numeric(12, 2) NOT NULL DEFAULT 1000,
  daily_limit_usd numeric(12, 2) NOT NULL,
  weekly_limit_usd numeric(12, 2) NOT NULL,
  monthly_limit_usd numeric(12, 2) NOT NULL,
  per_deal_limit_usd numeric(12, 2) NOT NULL,
  auto_approve boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE spend_limits
  ALTER COLUMN auto_approve SET DEFAULT false;

CREATE TABLE IF NOT EXISTS vault_refs (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  provider text NOT NULL,
  vault_ref text NOT NULL,
  last4 text NOT NULL,
  brand text NOT NULL,
  expiry_month integer NOT NULL,
  expiry_year integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id text PRIMARY KEY,
  deal_id text REFERENCES deals(id),
  user_id text NOT NULL REFERENCES users(id),
  stage text NOT NULL,
  status text NOT NULL,
  notes text,
  started_at timestamptz NOT NULL,
  ended_at timestamptz
);

CREATE TABLE IF NOT EXISTS agent_events (
  id text PRIMARY KEY,
  deal_id text NOT NULL REFERENCES deals(id),
  stage text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL,
  at timestamptz NOT NULL,
  status text NOT NULL
);

CREATE TABLE IF NOT EXISTS deal_events (
  id text PRIMARY KEY,
  deal_id text NOT NULL REFERENCES deals(id),
  type text NOT NULL,
  stage text,
  title text NOT NULL,
  detail text NOT NULL,
  at timestamptz NOT NULL,
  status text NOT NULL,
  from_status text,
  to_status text,
  actor text NOT NULL DEFAULT 'imported'
);

CREATE TABLE IF NOT EXISTS usage_events (
  id text PRIMARY KEY,
  deal_id text NOT NULL,
  run_id text NOT NULL,
  phase text NOT NULL,
  stage text NOT NULL,
  model_calls integer NOT NULL,
  tool_calls integer NOT NULL,
  tokens_est_input integer,
  tokens_est_output integer,
  tokens_est_total integer,
  provider text NOT NULL DEFAULT 'unknown',
  model text NOT NULL DEFAULT 'unknown',
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  status text NOT NULL,
  cost_kind text NOT NULL DEFAULT 'estimate',
  billed boolean NOT NULL DEFAULT false,
  live boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS connected_accounts (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  clerk_user_id text,
  provider text NOT NULL,
  ciphertext text,
  iv text,
  status text NOT NULL DEFAULT 'disconnected',
  hint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS connected_accounts_user_provider_uidx
  ON connected_accounts (user_id, provider);

CREATE TABLE IF NOT EXISTS proof_snapshots (
  id text PRIMARY KEY,
  verified_at timestamptz,
  closed_volume_usd numeric(12, 2),
  success_rate numeric(8, 4),
  active_buyers integer,
  note text
);
