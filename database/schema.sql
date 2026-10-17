CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL
);

CREATE TABLE "pins" (
  "id" uuid PRIMARY KEY,
  "creator_id" uuid NOT NULL,
  "title" varchar NOT NULL,
  "description" text,
  "latitude" double,
  "longitude" double,
  "location_name" varchar,
  "starts_at" timestamp,
  "ends_at" timestamp,
  "is_all_day" boolean NOT NULL DEFAULT false,
  "recurrence_rule" varchar
);

CREATE TABLE "collections" (
  "id" uuid PRIMARY KEY,
  "owner_id" uuid NOT NULL,
  "title" varchar NOT NULL,
  "description" text,
  "visibility" varchar NOT NULL DEFAULT 'private',
  "viewer_can_add_pins" boolean NOT NULL DEFAULT false
);

CREATE TABLE "collection_pins" (
  "collection_id" uuid NOT NULL,
  "pin_id" uuid NOT NULL,
  "added_by" uuid
);

CREATE TABLE "collection_members" (
  "collection_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" varchar NOT NULL,
  "can_add_pins" boolean NOT NULL DEFAULT false,
  "invited_by" uuid
);

COMMENT ON COLUMN "collection_members"."role" IS 'collaborator or viewer';

ALTER TABLE "pins" ADD FOREIGN KEY ("creator_id") REFERENCES "profiles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collections" ADD FOREIGN KEY ("owner_id") REFERENCES "profiles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_pins" ADD FOREIGN KEY ("collection_id") REFERENCES "collections" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_pins" ADD FOREIGN KEY ("pin_id") REFERENCES "pins" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_pins" ADD FOREIGN KEY ("added_by") REFERENCES "profiles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_members" ADD FOREIGN KEY ("collection_id") REFERENCES "collections" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_members" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "collection_members" ADD FOREIGN KEY ("invited_by") REFERENCES "profiles" ("id") DEFERRABLE INITIALLY IMMEDIATE;
