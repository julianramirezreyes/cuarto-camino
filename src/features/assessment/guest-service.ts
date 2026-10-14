import {
  authorizeGuestClaim,
  generateGuestToken,
  guestExpiresAt,
  hashToken,
  isGuestExpired,
  shouldTouchGuest,
} from "@/lib/guest";
import type { AssessmentRepository } from "./repository";

export interface GuestServiceDeps {
  repo: AssessmentRepository;
  now?: () => Date;
}

export type ClaimOutcome =
  | "claimed"
  | "no_token"
  | "unknown_session"
  | "expired"
  | "already_claimed"
  | "conflict";

export interface ClaimResult {
  claimed: number;
  outcome: ClaimOutcome;
}

/**
 * Guest sessions: only the SHA-256 hash of the cookie token is ever stored.
 * Issuing, resolving (sliding expiry) and claiming into a user account.
 */
export function createGuestService({ repo, now = () => new Date() }: GuestServiceDeps) {
  return {
    /** Creates a session; the raw token is returned ONCE, for the Set-Cookie header. */
    async issue(): Promise<{ guestSessionId: string; token: string }> {
      const token = generateGuestToken();
      const at = now();
      const session = await repo.createGuestSession({ tokenHash: hashToken(token), now: at, expiresAt: guestExpiresAt(at) });
      return { guestSessionId: session.id, token };
    },

    /**
     * Cookie token -> guest session id, or null when unknown, expired or already claimed
     * (a claimed token grants nothing). `refreshed` tells the caller to re-send the cookie
     * because the sliding window was extended.
     */
    async resolve(token: string | undefined): Promise<{ guestSessionId: string; refreshed: boolean } | null> {
      if (!token) return null;
      const session = await repo.findGuestSessionByTokenHash(hashToken(token));
      const at = now();
      if (!session || session.claimedByUserId !== null || isGuestExpired(session, at)) return null;
      let refreshed = false;
      if (shouldTouchGuest(session, at)) {
        await repo.touchGuestSession(session.id, at, guestExpiresAt(at));
        refreshed = true;
      }
      return { guestSessionId: session.id, refreshed };
    },

    /**
     * Moves the data of the guest session held by `token` to `userId`, once. The caller
     * never names a guest id: the cookie token IS the proof, so nobody can claim
     * somebody else's session. The decision is `authorizeGuestClaim`; the write is one
     * transaction guarded by `claimed_by_user_id IS NULL` inside the repository.
     */
    async claim(userId: string, token: string | undefined): Promise<ClaimResult> {
      if (!token) return { claimed: 0, outcome: "no_token" };
      const session = await repo.findGuestSessionByTokenHash(hashToken(token));
      if (!session) return { claimed: 0, outcome: "unknown_session" };
      const at = now();
      const decision = authorizeGuestClaim({ session, presentedToken: token, now: at });
      if (!decision.ok) {
        return { claimed: 0, outcome: decision.reason === "token_mismatch" ? "unknown_session" : decision.reason };
      }
      const moved = await repo.claimGuestSession({ guestSessionId: decision.guestSessionId, userId, now: at });
      if (!moved) return { claimed: 0, outcome: "conflict" };
      return { claimed: moved.assessmentsMoved, outcome: "claimed" };
    },
  };
}

export type GuestService = ReturnType<typeof createGuestService>;
