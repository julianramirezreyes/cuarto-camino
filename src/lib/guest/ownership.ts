import { tokenMatchesHash } from "./token";
import { isGuestExpired } from "./policy";

/** Who is making the request. Resolved server-side from the auth session / guest cookie. */
export type Principal =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestSessionId: string }
  | { kind: "anonymous" };

export interface OwnedAssessment {
  userId: string | null;
  guestSessionId: string | null;
  deletedAt?: Date | null;
}

/**
 * Read/write access to an assessment. Deny by default:
 *  - soft-deleted assessments are inaccessible to everyone;
 *  - a malformed owner (both or neither set) is inaccessible (the DB CHECK forbids it);
 *  - a user never reaches guest-owned data, nor a guest user-owned data. Guest data
 *    only becomes a user's through the explicit claim flow below.
 */
export function canAccessAssessment(
  assessment: OwnedAssessment,
  principal: Principal,
): boolean {
  if (assessment.deletedAt) return false;
  const { userId, guestSessionId } = assessment;
  if ((userId === null) === (guestSessionId === null)) return false;
  switch (principal.kind) {
    case "user":
      return userId !== null && userId === principal.userId;
    case "guest":
      return (
        guestSessionId !== null && guestSessionId === principal.guestSessionId
      );
    default:
      return false;
  }
}

export interface ClaimableGuestSession {
  id: string;
  tokenHash: string;
  expiresAt: Date;
  claimedByUserId: string | null;
}

export type ClaimDecision =
  | { ok: true; guestSessionId: string }
  | { ok: false; reason: "token_mismatch" | "expired" | "already_claimed" };

/**
 * Decides whether `userId` may absorb a guest session's assessments. Only the holder of
 * the CURRENT guest cookie (token hashes to the stored hash) may claim, and only once.
 * The caller must then run the claim as ONE transaction guarded by
 * `WHERE claimed_by_user_id IS NULL` so concurrent claims cannot both win.
 */
export function authorizeGuestClaim(input: {
  session: ClaimableGuestSession;
  presentedToken: string | undefined;
  now: Date;
}): ClaimDecision {
  const { session, presentedToken, now } = input;
  if (!presentedToken || !tokenMatchesHash(presentedToken, session.tokenHash)) {
    return { ok: false, reason: "token_mismatch" };
  }
  if (session.claimedByUserId !== null)
    return { ok: false, reason: "already_claimed" };
  if (isGuestExpired(session, now)) return { ok: false, reason: "expired" };
  return { ok: true, guestSessionId: session.id };
}
