-- Revert dyl:moodSeeding from pg

BEGIN;

DELETE FROM "mood";

COMMIT;
