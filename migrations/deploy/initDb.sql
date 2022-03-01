-- Deploy dyl:initDb to pg
BEGIN;


CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "image" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "mood" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "label" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "text" TEXT,
  "video" TEXT,
  "audio" TEXT,
  "image" TEXT,
  "user_id" INT NOT NULL REFERENCES "user"("id"),
  "mood_id" INT NOT NULL REFERENCES "mood"("id"),
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "goal" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "label" TEXT NOT NULL,
  "user_id" INT NOT NULL REFERENCES "user"("id"),
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "step" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "label" TEXT NOT NULL,
  "result" BOOLEAN NOT NULL DEFAULT false,
  "comment" TEXT,
  "goal_id" INT NOT NULL REFERENCES "goal"("id"),
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

COMMIT;