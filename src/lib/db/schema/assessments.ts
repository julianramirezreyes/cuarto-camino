import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { exactlyOneNotNull, timestamps, uuidPk } from "./_shared";
import { user } from "./auth";
import { guestSessions } from "./guest";

export const ASSESSMENT_STATUSES = [
  "in_progress",
  "paused",
  "completed",
  "abandoned",
] as const;
export const assessmentStatus = pgEnum(
  "assessment_status",
  ASSESSMENT_STATUSES,
);

/**
 * One run of the adaptive assessment. Owned by EITHER a user OR a guest session
 * (CHECK enforces exactly one). Claiming a guest assessment is a single UPDATE that
 * sets user_id and clears guest_session_id, so the CHECK holds at every instant.
 *
 * engine_version / bank_version pin how the answers must be interpreted: the question
 * bank lives in versioned typed files, not in the database (see docs/base-de-datos.md).
 */
export const assessments = pgTable(
  "assessments",
  {
    id: uuidPk(),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    guestSessionId: uuid("guest_session_id").references(
      () => guestSessions.id,
      {
        onDelete: "cascade",
      },
    ),
    status: assessmentStatus("status").notNull().default("in_progress"),
    engineVersion: text("engine_version").notNull(),
    bankVersion: text("bank_version").notNull(),
    /** Explicit consent captured when the assessment was started. */
    consentGranted: boolean("consent_granted").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    /** Hard retention deadline; scripts/purge-expired.ts deletes rows past it. */
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    /** Soft delete: hides the assessment immediately; purge removes it physically. */
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    /** Optimistic concurrency token, incremented on every write. */
    version: integer("version").notNull().default(1),
    ...timestamps(),
  },
  (t) => [
    check(
      "assessments_single_owner",
      exactlyOneNotNull("user_id", "guest_session_id"),
    ),
    check("assessments_consent_required", sql`${t.consentGranted} = true`),
    check(
      "assessments_completed_at_matches_status",
      sql`(${t.status} = 'completed') = (${t.completedAt} is not null)`,
    ),
    check("assessments_version_positive", sql`${t.version} >= 1`),
    index("assessments_user_status_idx").on(t.userId, t.status),
    index("assessments_guest_session_idx").on(t.guestSessionId),
    index("assessments_expires_at_idx").on(t.expiresAt),
    index("assessments_deleted_at_idx").on(t.deletedAt),
  ],
);
export type Assessment = typeof assessments.$inferSelect;

/**
 * One chosen option per question per assessment. question_id / option_id are stable
 * ids from the typed question bank (bank_version lives on the assessment). No FK is
 * possible by design; the application validates ids against the bank.
 */
export const assessmentAnswers = pgTable(
  "assessment_answers",
  {
    id: uuidPk(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    optionId: text("option_id").notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("assessment_answers_assessment_question_uq").on(
      t.assessmentId,
      t.questionId,
    ),
  ],
);
export type AssessmentAnswer = typeof assessmentAnswers.$inferSelect;

/**
 * Computed report snapshot. One per assessment per engine version, so re-scoring with a
 * newer engine adds a row instead of overwriting history.
 */
export const assessmentResults = pgTable(
  "assessment_results",
  {
    id: uuidPk(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    engineVersion: text("engine_version").notNull(),
    bankVersion: text("bank_version").notNull(),
    report: jsonb("report").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("assessment_results_assessment_engine_uq").on(
      t.assessmentId,
      t.engineVersion,
    ),
  ],
);
export type AssessmentResult = typeof assessmentResults.$inferSelect;
