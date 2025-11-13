-- Add missing profile fields and relax username constraint
BEGIN;

-- Add columns if they do not exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Allow NULL usernames to avoid signup failures when username not provided
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;

-- Touch updated_at for existing rows
UPDATE profiles SET updated_at = now();

COMMIT;