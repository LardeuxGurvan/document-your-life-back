-- Revert dyl:constraints from pg

BEGIN;

-- Drop constraint that validate hexadecimal color code
ALTER TABLE "mood" 
    DROP CONSTRAINT color_check;

-- Drop constraint that validate email format
ALTER TABLE "user"
    DROP CONSTRAINT email_check;

COMMIT;
