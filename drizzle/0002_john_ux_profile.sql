-- John UX profile + intent helpers.
-- spend_limits.auto_approve must stay default false. Do not flip it.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS notification_email text;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE intents
  ADD COLUMN IF NOT EXISTS template_id text;

ALTER TABLE intents
  ADD COLUMN IF NOT EXISTS must_include text;

ALTER TABLE intents
  ADD COLUMN IF NOT EXISTS avoid text;
