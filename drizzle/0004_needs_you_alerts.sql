-- Needs-you email opt-out. Default ON for existing rows and new accounts.
-- Does not approve, spend, or send merchant mail.
-- spend_limits.auto_approve must stay default false.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS needs_you_alerts boolean NOT NULL DEFAULT true;
