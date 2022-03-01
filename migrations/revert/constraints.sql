-- Revert dyl:constraints from pg

BEGIN;

-- Drop constraint that validate email format
ALTER TABLE "user"
    DROP CONSTRAINT email_check;

COMMIT;
