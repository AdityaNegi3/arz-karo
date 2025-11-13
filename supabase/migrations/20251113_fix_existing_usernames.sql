-- Backfill usernames for profiles that have NULL using auth.users email prefix
BEGIN;

UPDATE profiles p
SET username = split_part(u.email, '@', 1),
    updated_at = now()
FROM auth.users u
WHERE p.id = u.id
  AND p.username IS NULL;

COMMIT;