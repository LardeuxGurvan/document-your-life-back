-- Revert dyl:fuctionUpdate from pg

BEGIN;

DROP FUNCTION update_card(json);
DROP FUNCTION update_card_without_mood(json);

COMMIT;
