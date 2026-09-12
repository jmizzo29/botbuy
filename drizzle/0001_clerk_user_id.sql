-- Clerk identity on existing Neon `users`.
-- Apply with `npx drizzle-kit push` (preferred) or run this SQL on the
-- direct (non-pooler) DATABASE_URL.
--
-- spend_limits.auto_approve must stay default false. Do not flip it.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS clerk_user_id text;

CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_user_id_uidx
  ON users (clerk_user_id)
  WHERE clerk_user_id IS NOT NULL;

-- Fail-closed spend lock (idempotent).
ALTER TABLE spend_limits
  ALTER COLUMN auto_approve SET DEFAULT false;
