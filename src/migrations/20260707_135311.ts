import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ms');
  CREATE TYPE "public"."enum_pages_hero_background_blob" AS ENUM('mistSage', 'warmSand', 'none');
  CREATE TYPE "public"."enum__pages_v_version_hero_background_blob" AS ENUM('mistSage', 'warmSand', 'none');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'ms');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'ms');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'provider', 'client');
  CREATE TYPE "public"."enum_provider_profiles_approaches_name" AS ENUM('CBT', 'DBT', 'EMDR', 'Psychodynamic', 'Humanistic', 'Solution-Focused', 'ACT', 'Narrative', 'Family Systems');
  CREATE TYPE "public"."enum_provider_profiles_session_formats_format" AS ENUM('online', 'in-person', 'both');
  CREATE TYPE "public"."enum_provider_profiles_approval_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_provider_profiles_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_services_category" AS ENUM('individual', 'couples', 'family', 'group', 'psychiatric', 'child-adolescent', 'art', 'emdr', 'cbt', 'crisis');
  CREATE TYPE "public"."enum_reviews_author_age" AS ENUM('18-24', '25-34', '35-44', '45-54', '55+');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_bookings_format" AS ENUM('online', 'in-person');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum_bookings_payment_status" AS ENUM('pending', 'paid', 'refunded');
  CREATE TYPE "public"."enum_header_mobile_menu_items_link_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'searchHero';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'searchHero';
  CREATE TABLE "pages_hero_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_service_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'How can we help?',
  	"subheading" varchar DEFAULT 'Browse our services to find the right support for you.',
  	"view_all_link_label" varchar DEFAULT 'View all services',
  	"view_all_link_url" varchar DEFAULT '/providers',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"context" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What people are saying',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Frequently asked questions',
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest articles',
  	"view_all_link_label" varchar DEFAULT 'View all articles',
  	"view_all_link_url" varchar DEFAULT '/posts',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_hero_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'How can we help?',
  	"subheading" varchar DEFAULT 'Browse our services to find the right support for you.',
  	"view_all_link_label" varchar DEFAULT 'View all services',
  	"view_all_link_url" varchar DEFAULT '/providers',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"context" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What people are saying',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Frequently asked questions',
  	"subheading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest articles',
  	"view_all_link_label" varchar DEFAULT 'View all articles',
  	"view_all_link_url" varchar DEFAULT '/posts',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "provider_profiles_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"institution" varchar,
  	"year" numeric
  );
  
  CREATE TABLE "provider_profiles_approaches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" "enum_provider_profiles_approaches_name"
  );
  
  CREATE TABLE "provider_profiles_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "provider_profiles_session_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" "enum_provider_profiles_session_formats_format" NOT NULL,
  	"location" varchar
  );
  
  CREATE TABLE "provider_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"slug" varchar,
  	"title" varchar NOT NULL,
  	"cover_image_id" integer,
  	"about" jsonb,
  	"philosophy" jsonb,
  	"session_fee" numeric NOT NULL,
  	"currency" varchar DEFAULT 'MYR',
  	"accepts_insurance" boolean DEFAULT false,
  	"offers_sliding_scale" boolean DEFAULT false,
  	"intake_form_id" integer,
  	"intake_form_required" boolean DEFAULT false,
  	"approval_status" "enum_provider_profiles_approval_status" DEFAULT 'pending' NOT NULL,
  	"approval_notes" varchar,
  	"requested_at" timestamp(3) with time zone,
  	"approved_at" timestamp(3) with time zone,
  	"approved_by_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"status" "enum_provider_profiles_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "provider_profiles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"languages_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"category" "enum_services_category",
  	"icon_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider_id" integer NOT NULL,
  	"rating" numeric NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"author_name" varchar,
  	"author_age" "enum_reviews_author_age",
  	"verified" boolean DEFAULT false,
  	"status" "enum_reviews_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "languages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider_id" integer NOT NULL,
  	"service_id" integer NOT NULL,
  	"date_time" timestamp(3) with time zone NOT NULL,
  	"duration" numeric DEFAULT 50,
  	"format" "enum_bookings_format" NOT NULL,
  	"status" "enum_bookings_status" DEFAULT 'pending' NOT NULL,
  	"client_name" varchar,
  	"client_email" varchar NOT NULL,
  	"client_phone" varchar,
  	"notes" varchar,
  	"intake_form_response" jsonb,
  	"payment_status" "enum_bookings_payment_status" DEFAULT 'pending',
  	"calendar_invite_sent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "match_responses_responses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "match_responses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"recommended_provider_id" integer,
  	"session_id" varchar,
  	"timestamp" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "match_responses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"provider_profiles_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_mobile_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_mobile_menu_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_search_placeholder" varchar DEFAULT 'What are you looking for?';
  ALTER TABLE "pages" ADD COLUMN "hero_background_blob" "enum_pages_hero_background_blob" DEFAULT 'mistSage';
  ALTER TABLE "pages_rels" ADD COLUMN "provider_profiles_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_search_placeholder" varchar DEFAULT 'What are you looking for?';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_background_blob" "enum__pages_v_version_hero_background_blob" DEFAULT 'mistSage';
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_pages_v_rels" ADD COLUMN "provider_profiles_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "categories_breadcrumbs" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'client' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "provider_profiles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "languages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "match_responses_id" integer;
  ALTER TABLE "header" ADD COLUMN "audience_toggle_help_seeker_label" varchar DEFAULT 'For Help Seekers';
  ALTER TABLE "header" ADD COLUMN "audience_toggle_help_seeker_url" varchar DEFAULT '/';
  ALTER TABLE "header" ADD COLUMN "audience_toggle_therapist_label" varchar DEFAULT 'For Therapists';
  ALTER TABLE "header" ADD COLUMN "audience_toggle_therapist_url" varchar DEFAULT '/for-therapists';
  ALTER TABLE "header" ADD COLUMN "cta_button_label" varchar DEFAULT 'List Your Services';
  ALTER TABLE "header" ADD COLUMN "cta_button_url" varchar DEFAULT '/for-therapists/list';
  ALTER TABLE "header_rels" ADD COLUMN "provider_profiles_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "provider_profiles_id" integer;
  ALTER TABLE "pages_hero_suggestions" ADD CONSTRAINT "pages_hero_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_carousel" ADD CONSTRAINT "pages_blocks_service_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_posts" ADD CONSTRAINT "pages_blocks_featured_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_suggestions" ADD CONSTRAINT "_pages_v_version_hero_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_carousel" ADD CONSTRAINT "_pages_v_blocks_service_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_posts" ADD CONSTRAINT "_pages_v_blocks_featured_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_credentials" ADD CONSTRAINT "provider_profiles_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_approaches" ADD CONSTRAINT "provider_profiles_approaches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_faq" ADD CONSTRAINT "provider_profiles_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_session_formats" ADD CONSTRAINT "provider_profiles_session_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_intake_form_id_forms_id_fk" FOREIGN KEY ("intake_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "provider_profiles_rels" ADD CONSTRAINT "provider_profiles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_rels" ADD CONSTRAINT "provider_profiles_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "provider_profiles_rels" ADD CONSTRAINT "provider_profiles_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "match_responses_responses" ADD CONSTRAINT "match_responses_responses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."match_responses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "match_responses" ADD CONSTRAINT "match_responses_recommended_provider_id_provider_profiles_id_fk" FOREIGN KEY ("recommended_provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "match_responses_rels" ADD CONSTRAINT "match_responses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."match_responses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "match_responses_rels" ADD CONSTRAINT "match_responses_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_mobile_menu_items" ADD CONSTRAINT "header_mobile_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_suggestions_order_idx" ON "pages_hero_suggestions" USING btree ("_order");
  CREATE INDEX "pages_hero_suggestions_parent_id_idx" ON "pages_hero_suggestions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_carousel_order_idx" ON "pages_blocks_service_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_carousel_parent_id_idx" ON "pages_blocks_service_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_carousel_path_idx" ON "pages_blocks_service_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_posts_order_idx" ON "pages_blocks_featured_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_posts_parent_id_idx" ON "pages_blocks_featured_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_posts_path_idx" ON "pages_blocks_featured_posts" USING btree ("_path");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_hero_suggestions_order_idx" ON "_pages_v_version_hero_suggestions" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_suggestions_parent_id_idx" ON "_pages_v_version_hero_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_carousel_order_idx" ON "_pages_v_blocks_service_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_carousel_parent_id_idx" ON "_pages_v_blocks_service_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_carousel_path_idx" ON "_pages_v_blocks_service_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_avatar_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_posts_order_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_posts_parent_id_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_posts_path_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "provider_profiles_credentials_order_idx" ON "provider_profiles_credentials" USING btree ("_order");
  CREATE INDEX "provider_profiles_credentials_parent_id_idx" ON "provider_profiles_credentials" USING btree ("_parent_id");
  CREATE INDEX "provider_profiles_approaches_order_idx" ON "provider_profiles_approaches" USING btree ("_order");
  CREATE INDEX "provider_profiles_approaches_parent_id_idx" ON "provider_profiles_approaches" USING btree ("_parent_id");
  CREATE INDEX "provider_profiles_faq_order_idx" ON "provider_profiles_faq" USING btree ("_order");
  CREATE INDEX "provider_profiles_faq_parent_id_idx" ON "provider_profiles_faq" USING btree ("_parent_id");
  CREATE INDEX "provider_profiles_session_formats_order_idx" ON "provider_profiles_session_formats" USING btree ("_order");
  CREATE INDEX "provider_profiles_session_formats_parent_id_idx" ON "provider_profiles_session_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "provider_profiles_user_idx" ON "provider_profiles" USING btree ("user_id");
  CREATE UNIQUE INDEX "provider_profiles_slug_idx" ON "provider_profiles" USING btree ("slug");
  CREATE INDEX "provider_profiles_cover_image_idx" ON "provider_profiles" USING btree ("cover_image_id");
  CREATE INDEX "provider_profiles_intake_form_idx" ON "provider_profiles" USING btree ("intake_form_id");
  CREATE INDEX "provider_profiles_approved_by_idx" ON "provider_profiles" USING btree ("approved_by_id");
  CREATE INDEX "provider_profiles_meta_meta_image_idx" ON "provider_profiles" USING btree ("meta_image_id");
  CREATE INDEX "provider_profiles_updated_at_idx" ON "provider_profiles" USING btree ("updated_at");
  CREATE INDEX "provider_profiles_created_at_idx" ON "provider_profiles" USING btree ("created_at");
  CREATE INDEX "provider_profiles_rels_order_idx" ON "provider_profiles_rels" USING btree ("order");
  CREATE INDEX "provider_profiles_rels_parent_idx" ON "provider_profiles_rels" USING btree ("parent_id");
  CREATE INDEX "provider_profiles_rels_path_idx" ON "provider_profiles_rels" USING btree ("path");
  CREATE INDEX "provider_profiles_rels_languages_id_idx" ON "provider_profiles_rels" USING btree ("languages_id");
  CREATE INDEX "provider_profiles_rels_services_id_idx" ON "provider_profiles_rels" USING btree ("services_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_icon_idx" ON "services" USING btree ("icon_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "reviews_provider_idx" ON "reviews" USING btree ("provider_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "languages_code_idx" ON "languages" USING btree ("code");
  CREATE INDEX "languages_updated_at_idx" ON "languages" USING btree ("updated_at");
  CREATE INDEX "languages_created_at_idx" ON "languages" USING btree ("created_at");
  CREATE INDEX "bookings_provider_idx" ON "bookings" USING btree ("provider_id");
  CREATE INDEX "bookings_service_idx" ON "bookings" USING btree ("service_id");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "match_responses_responses_order_idx" ON "match_responses_responses" USING btree ("_order");
  CREATE INDEX "match_responses_responses_parent_id_idx" ON "match_responses_responses" USING btree ("_parent_id");
  CREATE INDEX "match_responses_recommended_provider_idx" ON "match_responses" USING btree ("recommended_provider_id");
  CREATE INDEX "match_responses_updated_at_idx" ON "match_responses" USING btree ("updated_at");
  CREATE INDEX "match_responses_created_at_idx" ON "match_responses" USING btree ("created_at");
  CREATE INDEX "match_responses_rels_order_idx" ON "match_responses_rels" USING btree ("order");
  CREATE INDEX "match_responses_rels_parent_idx" ON "match_responses_rels" USING btree ("parent_id");
  CREATE INDEX "match_responses_rels_path_idx" ON "match_responses_rels" USING btree ("path");
  CREATE INDEX "match_responses_rels_provider_profiles_id_idx" ON "match_responses_rels" USING btree ("provider_profiles_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_mobile_menu_items_order_idx" ON "header_mobile_menu_items" USING btree ("_order");
  CREATE INDEX "header_mobile_menu_items_parent_id_idx" ON "header_mobile_menu_items" USING btree ("_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_match_responses_fk" FOREIGN KEY ("match_responses_id") REFERENCES "public"."match_responses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_provider_profiles_fk" FOREIGN KEY ("provider_profiles_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_provider_profiles_id_idx" ON "pages_rels" USING btree ("provider_profiles_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_rels_provider_profiles_id_idx" ON "_pages_v_rels" USING btree ("provider_profiles_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "payload_locked_documents_rels_provider_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("provider_profiles_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_languages_id_idx" ON "payload_locked_documents_rels" USING btree ("languages_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_match_responses_id_idx" ON "payload_locked_documents_rels" USING btree ("match_responses_id");
  CREATE INDEX "header_rels_provider_profiles_id_idx" ON "header_rels" USING btree ("provider_profiles_id");
  CREATE INDEX "footer_rels_provider_profiles_id_idx" ON "footer_rels" USING btree ("provider_profiles_id");
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "posts" DROP COLUMN "meta_title";
  ALTER TABLE "posts" DROP COLUMN "meta_image_id";
  ALTER TABLE "posts" DROP COLUMN "meta_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_country" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_message" DROP COLUMN "message";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_state" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value";
  ALTER TABLE "forms_emails" DROP COLUMN "subject";
  ALTER TABLE "forms_emails" DROP COLUMN "message";
  ALTER TABLE "forms" DROP COLUMN "submit_button_label";
  ALTER TABLE "forms" DROP COLUMN "confirmation_message";
  ALTER TABLE "search" DROP COLUMN "title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_suggestions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_suggestions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles_credentials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles_approaches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles_session_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "provider_profiles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "match_responses_responses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "match_responses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "match_responses_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_mobile_menu_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_suggestions" CASCADE;
  DROP TABLE "pages_blocks_service_carousel" CASCADE;
  DROP TABLE "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_featured_posts" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_hero_suggestions" CASCADE;
  DROP TABLE "_pages_v_blocks_service_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_posts" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "provider_profiles_credentials" CASCADE;
  DROP TABLE "provider_profiles_approaches" CASCADE;
  DROP TABLE "provider_profiles_faq" CASCADE;
  DROP TABLE "provider_profiles_session_formats" CASCADE;
  DROP TABLE "provider_profiles" CASCADE;
  DROP TABLE "provider_profiles_rels" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "languages" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "match_responses_responses" CASCADE;
  DROP TABLE "match_responses" CASCADE;
  DROP TABLE "match_responses_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "header_mobile_menu_items" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_provider_profiles_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_services_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_provider_profiles_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_services_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_provider_profiles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_languages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_match_responses_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_provider_profiles_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_provider_profiles_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_rels_provider_profiles_id_idx";
  DROP INDEX "pages_rels_services_id_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "_pages_v_rels_provider_profiles_id_idx";
  DROP INDEX "_pages_v_rels_services_id_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "categories_breadcrumbs_locale_idx";
  DROP INDEX "users_avatar_idx";
  DROP INDEX "payload_locked_documents_rels_provider_profiles_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_languages_id_idx";
  DROP INDEX "payload_locked_documents_rels_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_match_responses_id_idx";
  DROP INDEX "header_rels_provider_profiles_id_idx";
  DROP INDEX "footer_rels_provider_profiles_id_idx";
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_message" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_emails" ADD COLUMN "subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL;
  ALTER TABLE "forms_emails" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms" ADD COLUMN "submit_button_label" varchar;
  ALTER TABLE "forms" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "search" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  ALTER TABLE "pages" DROP COLUMN "hero_search_placeholder";
  ALTER TABLE "pages" DROP COLUMN "hero_background_blob";
  ALTER TABLE "pages_rels" DROP COLUMN "provider_profiles_id";
  ALTER TABLE "pages_rels" DROP COLUMN "services_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_search_placeholder";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_background_blob";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "provider_profiles_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "categories_breadcrumbs" DROP COLUMN "_locale";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "provider_profiles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "languages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "match_responses_id";
  ALTER TABLE "header" DROP COLUMN "audience_toggle_help_seeker_label";
  ALTER TABLE "header" DROP COLUMN "audience_toggle_help_seeker_url";
  ALTER TABLE "header" DROP COLUMN "audience_toggle_therapist_label";
  ALTER TABLE "header" DROP COLUMN "audience_toggle_therapist_url";
  ALTER TABLE "header" DROP COLUMN "cta_button_label";
  ALTER TABLE "header" DROP COLUMN "cta_button_url";
  ALTER TABLE "header_rels" DROP COLUMN "provider_profiles_id";
  ALTER TABLE "footer_rels" DROP COLUMN "provider_profiles_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_background_blob";
  DROP TYPE "public"."enum__pages_v_version_hero_background_blob";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_provider_profiles_approaches_name";
  DROP TYPE "public"."enum_provider_profiles_session_formats_format";
  DROP TYPE "public"."enum_provider_profiles_approval_status";
  DROP TYPE "public"."enum_provider_profiles_status";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_reviews_author_age";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_bookings_format";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_bookings_payment_status";
  DROP TYPE "public"."enum_header_mobile_menu_items_link_type";`)
}
