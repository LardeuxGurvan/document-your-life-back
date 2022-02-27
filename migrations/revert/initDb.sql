-- Revert dyl:initDb from pg

BEGIN;

DROP TABLE "goal", "card", "mood", "user" CASCADE;

COMMIT;
