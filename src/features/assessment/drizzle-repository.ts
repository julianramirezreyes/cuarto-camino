import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { AssessmentReport } from "@/domain/adaptive-engine";
import { assessmentAnswers, assessmentResults, assessments, consentRecords, guestSessions } from "@/lib/db/schema";
import type * as schemaModule from "@/lib/db/schema";
import { OPEN_STATUSES, type AssessmentRecord, type AssessmentRepository, type GuestSessionRecord, type Owner } from "./repository";

/**
 * Any Drizzle pg database over our schema: the neon-http client (single statements) or a
 * transaction handle from the neon-serverless pool. Both extend PgDatabase.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = PgDatabase<any, typeof schemaModule>;

export interface DrizzleRepositoryDeps {
  /** Default client (neon-http: one HTTPS round trip per statement, no transactions). */
  db: Db;
  /**
   * Runs `fn` inside ONE real transaction (commit on resolve, rollback on throw).
   * neon-http cannot do this, so production wires the WebSocket pool
   * (src/lib/db/transactional.ts) here. Used by every multi-statement write.
   */
  transaction: <T>(fn: (tx: Db) => Promise<T>) => Promise<T>;
}

const toAssessment = (r: typeof assessments.$inferSelect): AssessmentRecord => ({
  id: r.id,
  userId: r.userId,
  guestSessionId: r.guestSessionId,
  status: r.status,
  engineVersion: r.engineVersion,
  bankVersion: r.bankVersion,
  startedAt: r.startedAt,
  completedAt: r.completedAt,
  deletedAt: r.deletedAt,
});

const toGuest = (r: typeof guestSessions.$inferSelect): GuestSessionRecord => ({
  id: r.id,
  tokenHash: r.tokenHash,
  lastSeenAt: r.lastSeenAt,
  expiresAt: r.expiresAt,
  claimedByUserId: r.claimedByUserId,
});

const ownerCondition = (owner: Owner) =>
  owner.kind === "user" ? eq(assessments.userId, owner.userId) : eq(assessments.guestSessionId, owner.guestSessionId);

export function createDrizzleAssessmentRepository({ db, transaction }: DrizzleRepositoryDeps): AssessmentRepository {
  return {
    async findById(id) {
      const [row] = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
      return row ? toAssessment(row) : null;
    },

    async findOpenByOwner(owner) {
      const [row] = await db
        .select()
        .from(assessments)
        .where(and(ownerCondition(owner), inArray(assessments.status, [...OPEN_STATUSES]), isNull(assessments.deletedAt)))
        .orderBy(desc(assessments.startedAt))
        .limit(1);
      return row ? toAssessment(row) : null;
    },

    async findLatestCompletedByOwner(owner) {
      const [row] = await db
        .select()
        .from(assessments)
        .where(and(ownerCondition(owner), eq(assessments.status, "completed"), isNull(assessments.deletedAt)))
        .orderBy(desc(assessments.completedAt))
        .limit(1);
      return row ? toAssessment(row) : null;
    },

    async create({ owner, engineVersion, bankVersion, policyVersion, now }) {
      const userId = owner.kind === "user" ? owner.userId : null;
      const guestSessionId = owner.kind === "guest" ? owner.guestSessionId : null;
      return transaction(async (tx) => {
        const [row] = await tx
          .insert(assessments)
          .values({ userId, guestSessionId, engineVersion, bankVersion, consentGranted: true, startedAt: now })
          .returning();
        await tx.insert(consentRecords).values({
          userId,
          guestSessionId,
          purpose: "assessment_processing",
          granted: true,
          policyVersion,
          createdAt: now,
        });
        return toAssessment(row);
      });
    },

    async listAnswers(assessmentId) {
      return db
        .select({ questionId: assessmentAnswers.questionId, optionId: assessmentAnswers.optionId })
        .from(assessmentAnswers)
        .where(eq(assessmentAnswers.assessmentId, assessmentId));
    },

    async upsertAnswer(assessmentId, { questionId, optionId }, now) {
      // One statement; UNIQUE (assessment_id, question_id) makes replacing atomic.
      await db
        .insert(assessmentAnswers)
        .values({ assessmentId, questionId, optionId, answeredAt: now })
        .onConflictDoUpdate({
          target: [assessmentAnswers.assessmentId, assessmentAnswers.questionId],
          set: { optionId, answeredAt: now },
        });
    },

    async setStatus(assessmentId, status, now) {
      await db
        .update(assessments)
        .set({ status, updatedAt: now, version: sql`${assessments.version} + 1` })
        .where(and(eq(assessments.id, assessmentId), inArray(assessments.status, [...OPEN_STATUSES])));
    },

    async complete({ assessmentId, report, engineVersion, bankVersion, now }) {
      await transaction(async (tx) => {
        // A given engine version has at most one snapshot (UNIQUE): never overwritten.
        await tx
          .insert(assessmentResults)
          .values({ assessmentId, engineVersion, bankVersion, report, createdAt: now })
          .onConflictDoNothing({ target: [assessmentResults.assessmentId, assessmentResults.engineVersion] });
        await tx
          .update(assessments)
          .set({ status: "completed", completedAt: now, updatedAt: now, version: sql`${assessments.version} + 1` })
          .where(and(eq(assessments.id, assessmentId), inArray(assessments.status, [...OPEN_STATUSES])));
      });
    },

    async findResult(assessmentId, engineVersion) {
      const [row] = await db
        .select()
        .from(assessmentResults)
        .where(and(eq(assessmentResults.assessmentId, assessmentId), eq(assessmentResults.engineVersion, engineVersion)))
        .limit(1);
      return row
        ? { report: row.report as AssessmentReport, engineVersion: row.engineVersion, bankVersion: row.bankVersion, createdAt: row.createdAt }
        : null;
    },

    async softDelete(assessmentId, now) {
      await db
        .update(assessments)
        .set({ deletedAt: now, updatedAt: now, version: sql`${assessments.version} + 1` })
        .where(and(eq(assessments.id, assessmentId), isNull(assessments.deletedAt)));
    },

    async findGuestSessionByTokenHash(tokenHash) {
      const [row] = await db.select().from(guestSessions).where(eq(guestSessions.tokenHash, tokenHash)).limit(1);
      return row ? toGuest(row) : null;
    },

    async createGuestSession({ tokenHash, now, expiresAt }) {
      const [row] = await db.insert(guestSessions).values({ tokenHash, lastSeenAt: now, expiresAt }).returning();
      return toGuest(row);
    },

    async touchGuestSession(id, now, expiresAt) {
      await db.update(guestSessions).set({ lastSeenAt: now, expiresAt, updatedAt: now }).where(eq(guestSessions.id, id));
    },

    async claimGuestSession({ guestSessionId, userId, now }) {
      return transaction(async (tx) => {
        // 1. The guard: only one concurrent claimer can flip claimed_by_user_id from NULL.
        const won = await tx
          .update(guestSessions)
          .set({ claimedByUserId: userId, claimedAt: now, updatedAt: now })
          .where(and(eq(guestSessions.id, guestSessionId), isNull(guestSessions.claimedByUserId)))
          .returning({ id: guestSessions.id });
        if (won.length === 0) return null; // lost the race / already claimed: nothing else is touched

        // 2. Move rows. user_id is set and guest_session_id cleared in the SAME UPDATE, so
        //    the single-owner CHECK holds at every instant. Soft-deleted rows stay behind
        //    (they are purged with the guest session).
        const moved = await tx
          .update(assessments)
          .set({ userId, guestSessionId: null, updatedAt: now, version: sql`${assessments.version} + 1` })
          .where(and(eq(assessments.guestSessionId, guestSessionId), isNull(assessments.deletedAt)))
          .returning({ id: assessments.id });
        await tx
          .update(consentRecords)
          .set({ userId, guestSessionId: null })
          .where(eq(consentRecords.guestSessionId, guestSessionId));
        return { assessmentsMoved: moved.length };
      });
    },
  };
}
