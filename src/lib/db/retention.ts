import { and, inArray, isNotNull, lt, or } from "drizzle-orm";
import { assessments, guestSessions, rateLimit, rateLimits } from "./schema";
import type { TransactionalDb } from "./transactional";

/**
 * Retention policy. PROPOSAL pending legal review (see docs/retencion-y-limites.md).
 *
 * - Guest sessions: 30 days idle (GUEST_IDLE_TTL_DAYS in src/lib/guest/policy.ts).
 *   Their assessments/consent die with them (FK ON DELETE CASCADE).
 * - Soft-deleted assessments: hard-deleted after SOFT_DELETE_GRACE_DAYS.
 * - Signed-in users' assessments (any status): kept until the user deletes them.
 * - Rate limit counters: windows last a minute; rows are junk after RATE_LIMIT_ROW_TTL_HOURS.
 * - assessments.expires_at is NOT used: nothing ever sets it, and guest-owned data already
 *   expires through the guest session. The column is kept (no destructive migration).
 */
export const SOFT_DELETE_GRACE_DAYS = 7;
export const RATE_LIMIT_ROW_TTL_HOURS = 24;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export interface PurgeResult {
  assessments: number;
  guestSessions: number;
  rateLimits: number;
}

export interface RetentionCutoffs {
  /** Assessments with deleted_at before this instant are removed. */
  softDeletedBefore: Date;
  /** rate_limits rows with window_start before this instant are removed. */
  rateLimitsBefore: Date;
  /** Better Auth rate-limit rows with last_request (epoch ms) before this are removed. */
  authRateLimitBeforeMs: number;
}

/** Pure: every retention threshold derived from an injected clock. */
export function retentionCutoffs(now: Date): RetentionCutoffs {
  const rl = now.getTime() - RATE_LIMIT_ROW_TTL_HOURS * HOUR_MS;
  return {
    softDeletedBefore: new Date(now.getTime() - SOFT_DELETE_GRACE_DAYS * DAY_MS),
    rateLimitsBefore: new Date(rl),
    authRateLimitBeforeMs: rl,
  };
}

/**
 * Physically removes, in ONE transaction:
 *  1. assessments soft-deleted longer than the grace window (answers/results cascade),
 *     plus assessments still attached to an expired guest session;
 *  2. expired guest sessions (claimed ones hold no data anymore);
 *  3. stale rate-limit rows (own table and Better Auth's).
 * Account data and signed-in users' assessments are never touched here.
 */
export async function purgeExpired(
  db: TransactionalDb,
  now: Date = new Date(),
): Promise<PurgeResult> {
  const cutoffs = retentionCutoffs(now);
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
          and(isNotNull(assessments.deletedAt), lt(assessments.deletedAt, cutoffs.softDeletedBefore)),
          guestIds.length ? inArray(assessments.guestSessionId, guestIds) : undefined,
        ),
      )
      .returning({ id: assessments.id });

    const removedGuests = guestIds.length
      ? await tx
          .delete(guestSessions)
          .where(inArray(guestSessions.id, guestIds))
          .returning({ id: guestSessions.id })
      : [];

    const removedLimits = await tx
      .delete(rateLimits)
      .where(lt(rateLimits.windowStart, cutoffs.rateLimitsBefore))
      .returning({ key: rateLimits.key });
    const removedAuthLimits = await tx
      .delete(rateLimit)
      .where(lt(rateLimit.lastRequest, cutoffs.authRateLimitBeforeMs))
      .returning({ id: rateLimit.id });

    return {
      assessments: removedAssessments.length,
      guestSessions: removedGuests.length,
      rateLimits: removedLimits.length + removedAuthLimits.length,
    };
  });
}
