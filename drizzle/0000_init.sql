CREATE TYPE "public"."assessment_status" AS ENUM('in_progress', 'paused', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."consent_purpose" AS ENUM('assessment_processing', 'result_retention');--> statement-breakpoint
CREATE TYPE "public"."enneagram_connection_kind" AS ENUM('integration', 'stress');--> statement-breakpoint
CREATE TYPE "public"."instinct" AS ENUM('sp', 'so', 'sx');--> statement-breakpoint
CREATE TYPE "public"."content_source_kind" AS ENUM('book', 'article', 'web');--> statement-breakpoint
CREATE TYPE "public"."enneagram_triad_kind" AS ENUM('center', 'hornevian', 'harmonic');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text,
	"locale" text DEFAULT 'es' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "guest_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"claimed_by_user_id" uuid,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guest_sessions_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "guest_sessions_token_hash_sha256_hex" CHECK ("guest_sessions"."token_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "guest_sessions_claim_consistent" CHECK ("guest_sessions"."claimed_by_user_id" is null or "guest_sessions"."claimed_at" is not null)
);
--> statement-breakpoint
CREATE TABLE "assessment_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"option_id" text NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assessment_answers_assessment_question_uq" UNIQUE("assessment_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "assessment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"engine_version" text NOT NULL,
	"bank_version" text NOT NULL,
	"report" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_session_id" uuid,
	"status" "assessment_status" DEFAULT 'in_progress' NOT NULL,
	"engine_version" text NOT NULL,
	"bank_version" text NOT NULL,
	"consent_granted" boolean NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assessments_single_owner" CHECK (num_nonnulls(user_id, guest_session_id) = 1),
	CONSTRAINT "assessments_consent_required" CHECK ("assessments"."consent_granted" = true),
	CONSTRAINT "assessments_completed_at_matches_status" CHECK (("assessments"."status" = 'completed') = ("assessments"."completed_at" is not null)),
	CONSTRAINT "assessments_version_positive" CHECK ("assessments"."version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_session_id" uuid,
	"purpose" "consent_purpose" NOT NULL,
	"granted" boolean NOT NULL,
	"policy_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consent_records_single_subject" CHECK (num_nonnulls(user_id, guest_session_id) = 1)
);
--> statement-breakpoint
CREATE TABLE "content_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"author" text NOT NULL,
	"title" text NOT NULL,
	"year" integer,
	"kind" "content_source_kind" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_sources_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "development_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"type_id" uuid NOT NULL,
	"level" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "development_levels_key_unique" UNIQUE("key"),
	CONSTRAINT "development_levels_type_level_uq" UNIQUE("type_id","level"),
	CONSTRAINT "development_levels_level_range" CHECK ("development_levels"."level" between 1 and 9)
);
--> statement-breakpoint
CREATE TABLE "enneagram_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_type_id" uuid NOT NULL,
	"to_type_id" uuid NOT NULL,
	"kind" "enneagram_connection_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enneagram_connections_from_kind_uq" UNIQUE("from_type_id","kind"),
	CONSTRAINT "enneagram_connections_not_self" CHECK ("enneagram_connections"."from_type_id" <> "enneagram_connections"."to_type_id")
);
--> statement-breakpoint
CREATE TABLE "enneagram_triad_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_id" uuid NOT NULL,
	"kind" "enneagram_triad_kind" NOT NULL,
	"group_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enneagram_triad_memberships_type_kind_uq" UNIQUE("type_id","kind")
);
--> statement-breakpoint
CREATE TABLE "enneagram_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enneagram_types_number_unique" UNIQUE("number"),
	CONSTRAINT "enneagram_types_number_range" CHECK ("enneagram_types"."number" between 1 and 9)
);
--> statement-breakpoint
CREATE TABLE "enneagram_wings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_id" uuid NOT NULL,
	"wing_type_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enneagram_wings_type_wing_uq" UNIQUE("type_id","wing_type_id"),
	CONSTRAINT "enneagram_wings_not_self" CHECK ("enneagram_wings"."type_id" <> "enneagram_wings"."wing_type_id")
);
--> statement-breakpoint
CREATE TABLE "instinctual_subtypes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"type_id" uuid NOT NULL,
	"instinct" "instinct" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "instinctual_subtypes_key_unique" UNIQUE("key"),
	CONSTRAINT "instinctual_subtypes_type_instinct_uq" UNIQUE("type_id","instinct")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_sessions" ADD CONSTRAINT "guest_sessions_claimed_by_user_id_user_id_fk" FOREIGN KEY ("claimed_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_answers" ADD CONSTRAINT "assessment_answers_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_guest_session_id_guest_sessions_id_fk" FOREIGN KEY ("guest_session_id") REFERENCES "public"."guest_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_guest_session_id_guest_sessions_id_fk" FOREIGN KEY ("guest_session_id") REFERENCES "public"."guest_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_levels" ADD CONSTRAINT "development_levels_type_id_enneagram_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enneagram_connections" ADD CONSTRAINT "enneagram_connections_from_type_id_enneagram_types_id_fk" FOREIGN KEY ("from_type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enneagram_connections" ADD CONSTRAINT "enneagram_connections_to_type_id_enneagram_types_id_fk" FOREIGN KEY ("to_type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enneagram_triad_memberships" ADD CONSTRAINT "enneagram_triad_memberships_type_id_enneagram_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enneagram_wings" ADD CONSTRAINT "enneagram_wings_type_id_enneagram_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enneagram_wings" ADD CONSTRAINT "enneagram_wings_wing_type_id_enneagram_types_id_fk" FOREIGN KEY ("wing_type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instinctual_subtypes" ADD CONSTRAINT "instinctual_subtypes_type_id_enneagram_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."enneagram_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "guest_sessions_expires_at_idx" ON "guest_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "guest_sessions_claimed_by_user_idx" ON "guest_sessions" USING btree ("claimed_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_results_assessment_engine_uq" ON "assessment_results" USING btree ("assessment_id","engine_version");--> statement-breakpoint
CREATE INDEX "assessments_user_status_idx" ON "assessments" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "assessments_guest_session_idx" ON "assessments" USING btree ("guest_session_id");--> statement-breakpoint
CREATE INDEX "assessments_expires_at_idx" ON "assessments" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "assessments_deleted_at_idx" ON "assessments" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "consent_records_user_idx" ON "consent_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "consent_records_guest_session_idx" ON "consent_records" USING btree ("guest_session_id");--> statement-breakpoint
CREATE INDEX "enneagram_connections_to_type_idx" ON "enneagram_connections" USING btree ("to_type_id");--> statement-breakpoint
CREATE INDEX "enneagram_triad_memberships_group_idx" ON "enneagram_triad_memberships" USING btree ("kind","group_key");--> statement-breakpoint
CREATE INDEX "enneagram_wings_wing_type_idx" ON "enneagram_wings" USING btree ("wing_type_id");