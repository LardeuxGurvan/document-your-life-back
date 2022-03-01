-- Deploy dyl:moodSeeding to pg

BEGIN;

INSERT INTO "mood" ("label")
    VALUES  ('happy'),
            ('sad'),
            ('cool'),
            ('nutral');

COMMIT;
