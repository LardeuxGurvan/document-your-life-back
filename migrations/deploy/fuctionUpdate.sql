-- Deploy dyl:fuctionUpdate to pg

BEGIN;

CREATE FUNCTION update_card(json) RETURNS card AS $$

    -- UPDATE "card" SET
    --     "text" = $1->>'text',
    --     "video" = $1->>'video',
    --     "audio" = $1->>'audio',
    --     "image" = $1->>'image',
    --     "mood_id" = ($1->>'mood_id')::int
    -- WHERE "id" = ($1->>'id')::int
    -- RETURNING *;

    UPDATE "card" SET
        "text" = $1->>'text',
        "video" = $1->>'video',
        "audio" = $1->>'audio',
        "image" = $1->>'image',
        "mood_id" = (SELECT "mood"."id" FROM "mood" WHERE "mood"."label" = $1->>'moodLabel')
    WHERE "card"."id" = ($1->>'id')::int
    RETURNING *;

$$ LANGUAGE sql;

CREATE FUNCTION update_card_without_mood(json) RETURNS card AS $$

    UPDATE "card" SET
        "text" = $1->>'text',
        "video" = $1->>'video',
        "audio" = $1->>'audio',
        "image" = $1->>'image'
    WHERE "id" = ($1->>'id')::int
    RETURNING *;

$$ LANGUAGE sql;

COMMIT;

