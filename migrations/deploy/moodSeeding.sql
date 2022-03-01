-- Deploy dyl:moodSeeding to pg

BEGIN;

INSERT INTO "mood" ("label")
    VALUES  ('nutral'),
            ('happy'),
            ('sad'),
            ('cool');

COMMIT;
