import type { AssessmentReport } from "@/domain/adaptive-engine";

export type AssessmentStatus = "in_progress" | "paused" | "completed" | "abandoned";
export const OPEN_STATUSES = ["in_progress", "paused"] as const satisfies readonly AssessmentStatus[];

/** Owner of an assessment: exactly one of the two (mirrors the DB CHECK). */
export type Owner =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestSessionId: string };

export interface AssessmentRecord {
  id: string;
  userId: string | null;
  guestSessionId: string | null;
  status: AssessmentStatus;
  engineVersion: string;
  bankVersion: string;
  startedAt: Date;
  completedAt: Date | null;
  deletedAt: Date | null;
}

export interface StoredAnswer {
  questionId: string;
  optionId: string;
}

export interface ResultRecord {
  report: AssessmentReport;
  engineVersion: string;
  bankVersion: string;
  createdAt: Date;
}

export interface GuestSessionRecord {
  id: string;
  tokenHash: string;
  lastSeenAt: Date;
  expiresAt: Date;
  claimedByUserId: string | null;
}

export interface CreateAssessmentInput {
  owner: Owner;
  engineVersion: string;
  bankVersion: string;
  policyVersion: string;
  now: Date;
}

export interface CompleteAssessmentInput {
  assessmentId: string;
  report: AssessmentReport;
  engineVersion: string;
  bankVersion: string;
  now: Date;
}

/**
 * Persistence PORT of the assessment feature. The service never touches Next.js or the
 * database; the in-memory adapter backs the tests and the Drizzle adapter production.
 *
 * Authorization is NOT the repository's job: `findById` returns any row (soft-deleted
 * included) and the service decides with canAccessAssessment.
 */
export interface AssessmentRepository {
  findById(id: string): Promise<AssessmentRecord | null>;
  /** Most recent in_progress/paused, non-deleted assessment of the owner. */
  findOpenByOwner(owner: Owner): Promise<AssessmentRecord | null>;
  /** Most recently completed, non-deleted assessment of the owner. */
  findLatestCompletedByOwner(owner: Owner): Promise<AssessmentRecord | null>;
  /** Inserts the assessment AND its consent record atomically. */
  create(input: CreateAssessmentInput): Promise<AssessmentRecord>;
  listAnswers(assessmentId: string): Promise<StoredAnswer[]>;
  /** Insert or replace the answer to a question (unique per assessment+question). */
  upsertAnswer(assessmentId: string, answer: StoredAnswer, now: Date): Promise<void>;
  setStatus(assessmentId: string, status: "in_progress" | "paused", now: Date): Promise<void>;
  /** Stores the report (never overwrites another engine version) and marks completed, atomically. */
  complete(input: CompleteAssessmentInput): Promise<void>;
  findResult(assessmentId: string, engineVersion: string): Promise<ResultRecord | null>;
  /** Soft delete: hides immediately, the purge job removes the rows later. */
  softDelete(assessmentId: string, now: Date): Promise<void>;

  findGuestSessionByTokenHash(tokenHash: string): Promise<GuestSessionRecord | null>;
  createGuestSession(input: { tokenHash: string; now: Date; expiresAt: Date }): Promise<GuestSessionRecord>;
  touchGuestSession(id: string, now: Date, expiresAt: Date): Promise<void>;
  /**
   * Guest -> user claim in ONE transaction (docs/base-de-datos.md). Returns null when
   * the conditional UPDATE ... WHERE claimed_by_user_id IS NULL matched nothing (lost
   * the race / already claimed); otherwise how many assessments moved to the user.
   */
  claimGuestSession(input: { guestSessionId: string; userId: string; now: Date }): Promise<{ assessmentsMoved: number } | null>;
}
