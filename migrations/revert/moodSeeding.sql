-- Revert dyl:moodSeeding from pg

BEGIN;

DELETE FROM "card";
DELETE FROM "mood";

COMMIT;
