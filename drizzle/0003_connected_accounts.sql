-- Encrypted MCP connector vault. Apply with drizzle-kit push (preferred)
-- or run on the direct (non-pooler) DATABASE_URL.
-- BOTBUY_VAULT_KEY encrypts ciphertext. Never store plaintext tokens.
-- spend_limits.auto_approve must stay default false.

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
