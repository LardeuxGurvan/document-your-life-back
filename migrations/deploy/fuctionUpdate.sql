-- Deploy dyl:fuctionUpdate to pg

BEGIN;

CREATE FUNCTION update_card(json) RETURNS card AS $$

    UPDATE "card" SET
        "text" = $1->>'text',
        "video" = $1->>'video',
        "audio" = $1->>'audio',
        "image" = $1->>'image',
        "mood_id" = ($1->>'mood_id')::int
    WHERE "id" = ($1->>'id')::int
    RETURNING *;

$$ LANGUAGE sql;

COMMIT;
