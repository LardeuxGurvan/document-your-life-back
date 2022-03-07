-- Deploy dyl:moodSeeding to pg

BEGIN;

INSERT INTO "mood" ("label")
    VALUES  ('neutral'),
            ('happy'),
            ('sad'),
            ('cool');

COMMIT;
