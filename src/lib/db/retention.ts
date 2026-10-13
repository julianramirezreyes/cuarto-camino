import { and, inArray, isNotNull, lt, or } from "drizzle-orm";
import { assessments, guestSessions } from "./schema";
import type { TransactionalDb } from "./transactional";

/** Soft-deleted assessments are kept this long before physical removal (accident window). */
export const SOFT_DELETE_GRACE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface PurgeResult {
  assessments: number;
  guestSessions: number;
}

/**
 * Physically removes, in ONE transaction:
 *  1. assessments past their expiresAt, or soft-deleted longer than the grace window
 *     (answers/results cascade);
 *  2. expired guest sessions that are unclaimed, together with any assessments and
 *     consent records still attached to them (cascade).
 * Claimed guest sessions hold no data anymore (moved to the user) and are removed too
 * once expired. Account data is never touched here.
 */
export async function purgeExpired(
  db: TransactionalDb,
  now: Date = new Date(),
): Promise<PurgeResult> {
  const graceCutoff = new Date(now.getTime() - SOFT_DELETE_GRACE_DAYS * DAY_MS);
  return db.transaction(async (tx) => {
    const expiredGuests = await tx
      .select({ id: guestSessions.id })
      .from(guestSessions)
      .where(lt(guestSessions.expiresAt, now));
    const guestIds = expiredGuests.map((g) => g.id);

    const removedAssessments = await tx
      .delete(assessments)
      .where(
        or(
          and(isNotNull(assessments.expiresAt), lt(assessments.expiresAt, now)),
          and(
            isNotNull(assessments.deletedAt),
            lt(assessments.deletedAt, graceCutoff),
          ),
          guestIds.length
            ? inArray(assessments.guestSessionId, guestIds)
            : undefined,
        ),
      )
      .returning({ id: assessments.id });

    const removedGuests = guestIds.length
      ? await tx
          .delete(guestSessions)
          .where(inArray(guestSessions.id, guestIds))
          .returning({ id: guestSessions.id })
      : [];

    return {
      assessments: removedAssessments.length,
      guestSessions: removedGuests.length,
    };
  });
}
