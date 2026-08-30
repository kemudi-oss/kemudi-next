import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_provider_profiles_religion" AS ENUM('islam', 'christianity', 'buddhism', 'hinduism', 'sikhism', 'taoism', 'none');
  CREATE TYPE "public"."enum_provider_profiles_account_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_consent_logs_type" AS ENUM('platform', 'marketing', 'health');
  CREATE TYPE "public"."enum__bookings_v_version_format" AS ENUM('online', 'in-person');
  CREATE TYPE "public"."enum__bookings_v_version_booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum__bookings_v_version_payment_status" AS ENUM('pending', 'paid', 'refunded');
  CREATE TYPE "public"."enum__bookings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__bookings_v_published_locale" AS ENUM('en', 'ms');
  CREATE TABLE "approaches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "centres_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL,
  	"caption" varchar
  );

  CREATE TABLE "centres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" jsonb,
  	"address" varchar NOT NULL,
  	"map_coordinates_lat" numeric,
  	"map_coordinates_lng" numeric,
  	"directions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "centres_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"provider_profiles_id" integer
  );

  CREATE TABLE "licenses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider_id" integer NOT NULL,
  	"type" varchar NOT NULL,
  	"number" varchar NOT NULL,
  	"issuing_body" varchar NOT NULL,
  	"proof_id" integer,
  	"expiry_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "interests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"provider_id" integer NOT NULL,
  	"notified" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "consent_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"type" "enum_consent_logs_type" NOT NULL,
  	"consented" boolean DEFAULT false NOT NULL,
  	"ip_address" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_bookings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_provider_id" integer,
  	"version_service_id" integer,
  	"version_date_time" timestamp(3) with time zone,
  	"version_duration" numeric DEFAULT 50,
  	"version_format" "enum__bookings_v_version_format",
  	"version_booking_status" "enum__bookings_v_version_booking_status" DEFAULT 'pending',
  	"version_client_name" varchar,
  	"version_client_email" varchar,
  	"version_client_phone" varchar,
  	"version_notes" varchar,
  	"version_intake_form_response" jsonb,
  	"version_payment_status" "enum__bookings_v_version_payment_status" DEFAULT 'pending',
  	"version_calendar_invite_sent" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__bookings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__bookings_v_published_locale",
  	"latest" boolean
  );

  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"induction_course_repeat_months" numeric DEFAULT 6,
  	"slot_reservation_minutes" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  -- rename services -> specialties (data-preserving, matches src/collections/Specialties)
  ALTER TABLE "services" RENAME TO "specialties";
  ALTER TYPE "public"."enum_services_category" RENAME TO "enum_specialties_category";
  ALTER TABLE "specialties" RENAME CONSTRAINT "services_icon_id_media_id_fk" TO "specialties_icon_id_media_id_fk";
  ALTER INDEX "services_slug_idx" RENAME TO "specialties_slug_idx";
  ALTER INDEX "services_icon_idx" RENAME TO "specialties_icon_idx";
  ALTER INDEX "services_updated_at_idx" RENAME TO "specialties_updated_at_idx";
  ALTER INDEX "services_created_at_idx" RENAME TO "specialties_created_at_idx";
  ALTER TABLE "pages_rels" RENAME COLUMN "services_id" TO "specialties_id";
  ALTER TABLE "pages_rels" RENAME CONSTRAINT "pages_rels_services_fk" TO "pages_rels_specialties_fk";
  ALTER INDEX "pages_rels_services_id_idx" RENAME TO "pages_rels_specialties_id_idx";
  ALTER TABLE "_pages_v_rels" RENAME COLUMN "services_id" TO "specialties_id";
  ALTER TABLE "_pages_v_rels" RENAME CONSTRAINT "_pages_v_rels_services_fk" TO "_pages_v_rels_specialties_fk";
  ALTER INDEX "_pages_v_rels_services_id_idx" RENAME TO "_pages_v_rels_specialties_id_idx";
  ALTER TABLE "provider_profiles_rels" RENAME COLUMN "services_id" TO "specialties_id";
  ALTER TABLE "provider_profiles_rels" RENAME CONSTRAINT "provider_profiles_rels_services_fk" TO "provider_profiles_rels_specialties_fk";
  ALTER INDEX "provider_profiles_rels_services_id_idx" RENAME TO "provider_profiles_rels_specialties_id_idx";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "services_id" TO "specialties_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_services_fk" TO "payload_locked_documents_rels_specialties_fk";
  ALTER INDEX "payload_locked_documents_rels_services_id_idx" RENAME TO "payload_locked_documents_rels_specialties_id_idx";
  ALTER TABLE "bookings" RENAME CONSTRAINT "bookings_service_id_services_id_fk" TO "bookings_service_id_specialties_id_fk";
  DROP INDEX "provider_profiles_slug_idx";

  -- rename bookings.status -> bookings.booking_status (data-preserving; frees up "status"
  -- for Payload's own draft/published "_status" versioning field added below)
  ALTER TYPE "public"."enum_bookings_status" RENAME TO "enum_bookings_booking_status";
  ALTER TABLE "bookings" RENAME COLUMN "status" TO "booking_status";
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('draft', 'published');

  ALTER TABLE "bookings" ALTER COLUMN "provider_id" DROP NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "service_id" DROP NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "date_time" DROP NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "format" DROP NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "client_email" DROP NOT NULL;
  ALTER TABLE "provider_profiles" ADD COLUMN "location_address" varchar;
  ALTER TABLE "provider_profiles" ADD COLUMN "location_lat" numeric;
  ALTER TABLE "provider_profiles" ADD COLUMN "location_lng" numeric;
  ALTER TABLE "provider_profiles" ADD COLUMN "religion" "enum_provider_profiles_religion";
  ALTER TABLE "provider_profiles" ADD COLUMN "account_status" "enum_provider_profiles_account_status" DEFAULT 'active' NOT NULL;
  ALTER TABLE "bookings" ADD COLUMN "_status" "enum_bookings_status" DEFAULT 'draft';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "approaches_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "centres_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "licenses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consent_logs_id" integer;
  ALTER TABLE "centres_photos" ADD CONSTRAINT "centres_photos_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "centres_photos" ADD CONSTRAINT "centres_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_rels" ADD CONSTRAINT "centres_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_rels" ADD CONSTRAINT "centres_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "licenses" ADD CONSTRAINT "licenses_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses" ADD CONSTRAINT "licenses_proof_id_media_id_fk" FOREIGN KEY ("proof_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interests" ADD CONSTRAINT "interests_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bookings_v" ADD CONSTRAINT "_bookings_v_parent_id_bookings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bookings_v" ADD CONSTRAINT "_bookings_v_version_provider_id_provider_profiles_id_fk" FOREIGN KEY ("version_provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bookings_v" ADD CONSTRAINT "_bookings_v_version_service_id_specialties_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "approaches_name_idx" ON "approaches" USING btree ("name");
  CREATE UNIQUE INDEX "approaches_slug_idx" ON "approaches" USING btree ("slug");
  CREATE INDEX "approaches_updated_at_idx" ON "approaches" USING btree ("updated_at");
  CREATE INDEX "approaches_created_at_idx" ON "approaches" USING btree ("created_at");
  CREATE INDEX "centres_photos_order_idx" ON "centres_photos" USING btree ("_order");
  CREATE INDEX "centres_photos_parent_id_idx" ON "centres_photos" USING btree ("_parent_id");
  CREATE INDEX "centres_photos_photo_idx" ON "centres_photos" USING btree ("photo_id");
  CREATE UNIQUE INDEX "centres_slug_idx" ON "centres" USING btree ("slug");
  CREATE INDEX "centres_updated_at_idx" ON "centres" USING btree ("updated_at");
  CREATE INDEX "centres_created_at_idx" ON "centres" USING btree ("created_at");
  CREATE INDEX "centres_rels_order_idx" ON "centres_rels" USING btree ("order");
  CREATE INDEX "centres_rels_parent_idx" ON "centres_rels" USING btree ("parent_id");
  CREATE INDEX "centres_rels_path_idx" ON "centres_rels" USING btree ("path");
  CREATE INDEX "centres_rels_provider_profiles_id_idx" ON "centres_rels" USING btree ("provider_profiles_id");
  CREATE INDEX "licenses_provider_idx" ON "licenses" USING btree ("provider_id");
  CREATE INDEX "licenses_proof_idx" ON "licenses" USING btree ("proof_id");
  CREATE INDEX "licenses_updated_at_idx" ON "licenses" USING btree ("updated_at");
  CREATE INDEX "licenses_created_at_idx" ON "licenses" USING btree ("created_at");
  CREATE INDEX "interests_provider_idx" ON "interests" USING btree ("provider_id");
  CREATE INDEX "interests_updated_at_idx" ON "interests" USING btree ("updated_at");
  CREATE INDEX "interests_created_at_idx" ON "interests" USING btree ("created_at");
  CREATE INDEX "consent_logs_user_idx" ON "consent_logs" USING btree ("user_id");
  CREATE INDEX "consent_logs_updated_at_idx" ON "consent_logs" USING btree ("updated_at");
  CREATE INDEX "consent_logs_created_at_idx" ON "consent_logs" USING btree ("created_at");
  CREATE INDEX "_bookings_v_parent_idx" ON "_bookings_v" USING btree ("parent_id");
  CREATE INDEX "_bookings_v_version_version_provider_idx" ON "_bookings_v" USING btree ("version_provider_id");
  CREATE INDEX "_bookings_v_version_version_service_idx" ON "_bookings_v" USING btree ("version_service_id");
  CREATE INDEX "_bookings_v_version_version_updated_at_idx" ON "_bookings_v" USING btree ("version_updated_at");
  CREATE INDEX "_bookings_v_version_version_created_at_idx" ON "_bookings_v" USING btree ("version_created_at");
  CREATE INDEX "_bookings_v_version_version__status_idx" ON "_bookings_v" USING btree ("version__status");
  CREATE INDEX "_bookings_v_created_at_idx" ON "_bookings_v" USING btree ("created_at");
  CREATE INDEX "_bookings_v_updated_at_idx" ON "_bookings_v" USING btree ("updated_at");
  CREATE INDEX "_bookings_v_snapshot_idx" ON "_bookings_v" USING btree ("snapshot");
  CREATE INDEX "_bookings_v_published_locale_idx" ON "_bookings_v" USING btree ("published_locale");
  CREATE INDEX "_bookings_v_latest_idx" ON "_bookings_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_approaches_fk" FOREIGN KEY ("approaches_id") REFERENCES "public"."approaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_centres_fk" FOREIGN KEY ("centres_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_licenses_fk" FOREIGN KEY ("licenses_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interests_fk" FOREIGN KEY ("interests_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_logs_fk" FOREIGN KEY ("consent_logs_id") REFERENCES "public"."consent_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bookings__status_idx" ON "bookings" USING btree ("_status");
  CREATE INDEX "payload_locked_documents_rels_approaches_id_idx" ON "payload_locked_documents_rels" USING btree ("approaches_id");
  CREATE INDEX "payload_locked_documents_rels_centres_id_idx" ON "payload_locked_documents_rels" USING btree ("centres_id");
  CREATE INDEX "payload_locked_documents_rels_licenses_id_idx" ON "payload_locked_documents_rels" USING btree ("licenses_id");
  CREATE INDEX "payload_locked_documents_rels_interests_id_idx" ON "payload_locked_documents_rels" USING btree ("interests_id");
  CREATE INDEX "payload_locked_documents_rels_consent_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_logs_id");
  ALTER TABLE "provider_profiles" DROP COLUMN "slug";
  ALTER TABLE "provider_profiles" DROP COLUMN "status";
  DROP TYPE "public"."enum_provider_profiles_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_provider_profiles_status" AS ENUM('active', 'inactive');
  ALTER TABLE "specialties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "approaches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "centres_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "centres" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "centres_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "licenses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consent_logs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_bookings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "approaches" CASCADE;
  DROP TABLE "centres_photos" CASCADE;
  DROP TABLE "centres" CASCADE;
  DROP TABLE "centres_rels" CASCADE;
  DROP TABLE "licenses" CASCADE;
  DROP TABLE "interests" CASCADE;
  DROP TABLE "consent_logs" CASCADE;
  DROP TABLE "_bookings_v" CASCADE;
  DROP TABLE "site_settings" CASCADE;

  -- reverse: bookings.booking_status -> bookings.status
  ALTER TABLE "bookings" DROP COLUMN "_status";
  DROP TYPE "public"."enum_bookings_status";
  ALTER TABLE "bookings" RENAME COLUMN "booking_status" TO "status";
  ALTER TYPE "public"."enum_bookings_booking_status" RENAME TO "enum_bookings_status";

  -- reverse: specialties -> services
  ALTER TABLE "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_specialties_fk" TO "payload_locked_documents_rels_services_fk";
  ALTER INDEX "payload_locked_documents_rels_specialties_id_idx" RENAME TO "payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "specialties_id" TO "services_id";
  ALTER TABLE "provider_profiles_rels" RENAME CONSTRAINT "provider_profiles_rels_specialties_fk" TO "provider_profiles_rels_services_fk";
  ALTER INDEX "provider_profiles_rels_specialties_id_idx" RENAME TO "provider_profiles_rels_services_id_idx";
  ALTER TABLE "provider_profiles_rels" RENAME COLUMN "specialties_id" TO "services_id";
  ALTER TABLE "_pages_v_rels" RENAME CONSTRAINT "_pages_v_rels_specialties_fk" TO "_pages_v_rels_services_fk";
  ALTER INDEX "_pages_v_rels_specialties_id_idx" RENAME TO "_pages_v_rels_services_id_idx";
  ALTER TABLE "_pages_v_rels" RENAME COLUMN "specialties_id" TO "services_id";
  ALTER TABLE "pages_rels" RENAME CONSTRAINT "pages_rels_specialties_fk" TO "pages_rels_services_fk";
  ALTER INDEX "pages_rels_specialties_id_idx" RENAME TO "pages_rels_services_id_idx";
  ALTER TABLE "pages_rels" RENAME COLUMN "specialties_id" TO "services_id";
  ALTER TABLE "bookings" RENAME CONSTRAINT "bookings_service_id_specialties_id_fk" TO "bookings_service_id_services_id_fk";
  ALTER INDEX "specialties_slug_idx" RENAME TO "services_slug_idx";
  ALTER INDEX "specialties_icon_idx" RENAME TO "services_icon_idx";
  ALTER INDEX "specialties_updated_at_idx" RENAME TO "services_updated_at_idx";
  ALTER INDEX "specialties_created_at_idx" RENAME TO "services_created_at_idx";
  ALTER TABLE "specialties" RENAME CONSTRAINT "specialties_icon_id_media_id_fk" TO "services_icon_id_media_id_fk";
  ALTER TYPE "public"."enum_specialties_category" RENAME TO "enum_services_category";
  ALTER TABLE "specialties" RENAME TO "services";

  ALTER TABLE "bookings" ALTER COLUMN "provider_id" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "service_id" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "date_time" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "format" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "client_email" SET NOT NULL;
  ALTER TABLE "provider_profiles" ADD COLUMN "slug" varchar;
  ALTER TABLE "provider_profiles" ADD COLUMN "status" "enum_provider_profiles_status" DEFAULT 'active' NOT NULL;
  CREATE UNIQUE INDEX "provider_profiles_slug_idx" ON "provider_profiles" USING btree ("slug");
  ALTER TABLE "provider_profiles" DROP COLUMN "location_address";
  ALTER TABLE "provider_profiles" DROP COLUMN "location_lat";
  ALTER TABLE "provider_profiles" DROP COLUMN "location_lng";
  ALTER TABLE "provider_profiles" DROP COLUMN "religion";
  ALTER TABLE "provider_profiles" DROP COLUMN "account_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "approaches_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "centres_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "licenses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "interests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consent_logs_id";
  DROP TYPE "public"."enum_provider_profiles_religion";
  DROP TYPE "public"."enum_provider_profiles_account_status";
  DROP TYPE "public"."enum_consent_logs_type";
  DROP TYPE "public"."enum__bookings_v_version_format";
  DROP TYPE "public"."enum__bookings_v_version_booking_status";
  DROP TYPE "public"."enum__bookings_v_version_payment_status";
  DROP TYPE "public"."enum__bookings_v_version_status";
  DROP TYPE "public"."enum__bookings_v_published_locale";`)
}
