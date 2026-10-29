CREATE TABLE "public"."collection_members" (
  "collection_id" uuid              NOT NULL,
  "user_id"       uuid              NOT NULL,
  "role"          character varying NOT NULL,
  "can_add_pins"  boolean           NOT NULL DEFAULT false,
  "invited_by"    uuid
);

ALTER TABLE "public"."collection_members"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."collection_pins" (
  "collection_id" uuid NOT NULL,
  "pin_id"        uuid NOT NULL,
  "added_by"      uuid
);

ALTER TABLE "public"."collection_pins"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."collections" (
  "id"                  uuid              NOT NULL,
  "owner_id"            uuid              NOT NULL,
  "title"               character varying NOT NULL,
  "description"         text,
  "visibility"          character varying NOT NULL DEFAULT 'private'::character varying,
  "viewer_can_add_pins" boolean           NOT NULL DEFAULT false,
  CONSTRAINT "collections_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."collections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."pins" (
  "id"              uuid                        NOT NULL,
  "creator_id"      uuid                        NOT NULL,
  "title"           character varying           NOT NULL,
  "description"     text,
  "latitude"        double precision,
  "longitude"       double precision,
  "location_name"   character varying,
  "starts_at"       timestamp without time zone,
  "ends_at"         timestamp without time zone,
  "is_all_day"      boolean                     NOT NULL DEFAULT false,
  "recurrence_rule" character varying,
  CONSTRAINT "pins_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."pins"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"       uuid              NOT NULL,
  "username" character varying NOT NULL,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_username_key" UNIQUE (username)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."collection_members"
  ADD CONSTRAINT "collection_members_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES public.collections(id) DEFERRABLE;

ALTER TABLE "public"."collection_pins"
  ADD CONSTRAINT "collection_pins_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES public.collections(id) DEFERRABLE;

ALTER TABLE "public"."collection_pins"
  ADD CONSTRAINT "collection_pins_pin_id_fkey" FOREIGN KEY (pin_id) REFERENCES public.pins(id) DEFERRABLE;

ALTER TABLE "public"."collection_members"
  ADD CONSTRAINT "collection_members_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES public.profiles(id) DEFERRABLE;

ALTER TABLE "public"."collection_members"
  ADD CONSTRAINT "collection_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) DEFERRABLE;

ALTER TABLE "public"."collection_pins"
  ADD CONSTRAINT "collection_pins_added_by_fkey" FOREIGN KEY (added_by) REFERENCES public.profiles(id) DEFERRABLE;

ALTER TABLE "public"."collections"
  ADD CONSTRAINT "collections_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) DEFERRABLE;

ALTER TABLE "public"."pins"
  ADD CONSTRAINT "pins_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public.profiles(id) DEFERRABLE;

COMMENT ON COLUMN "public"."collection_members"."role" IS 'collaborator or viewer';

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_members" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."collection_members" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_members" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_members" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_pins" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."collection_pins" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_pins" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collection_pins" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collections" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."collections" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collections" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."collections" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pins" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."pins" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pins" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pins" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

