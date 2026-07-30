-- Migration: Add passwordless auth fields to users table
-- Run this BEFORE starting the backend after the auth redesign

ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'EMAIL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Set all existing users as having completed onboarding (they registered the old way)
UPDATE users SET onboarding_complete = TRUE WHERE email_verified = TRUE;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('auth_provider', 'onboarding_complete', 'last_login');
