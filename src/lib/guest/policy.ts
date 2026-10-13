const DAY_MS = 24 * 60 * 60 * 1000;

/** A guest session expires after this many days WITHOUT activity (sliding window). */
export const GUEST_IDLE_TTL_DAYS = 30;
export const GUEST_IDLE_TTL_MS = GUEST_IDLE_TTL_DAYS * DAY_MS;
export const GUEST_IDLE_TTL_SECONDS = GUEST_IDLE_TTL_DAYS * 24 * 60 * 60;

/** Avoid a DB write on every request: only extend the window if last touch is older. */
export const GUEST_TOUCH_INTERVAL_MS = 60 * 60 * 1000;

export const guestExpiresAt = (from: Date): Date =>
  new Date(from.getTime() + GUEST_IDLE_TTL_MS);

export const isGuestExpired = (
  session: { expiresAt: Date },
  now: Date,
): boolean => session.expiresAt.getTime() <= now.getTime();

export const shouldTouchGuest = (
  session: { lastSeenAt: Date },
  now: Date,
): boolean =>
  now.getTime() - session.lastSeenAt.getTime() >= GUEST_TOUCH_INTERVAL_MS;
