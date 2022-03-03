-- Revert dyl:fuctionUpdate from pg

BEGIN;

DROP FUNCTION update_card(json);

COMMIT;
