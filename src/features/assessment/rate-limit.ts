export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets (always >= 1 when blocked). */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  /** Sync for the in-memory limiter, async for shared stores. Always `await` it. */
  check(key: string): RateLimitResult | Promise<RateLimitResult>;
}

export interface FixedWindowOptions {
  limit: number;
  windowMs: number;
  /** Injectable clock (tests). */
  now?: () => number;
  /** Upper bound of tracked keys; expired windows are pruned first. */
  maxKeys?: number;
}

/**
 * Fixed-window counter held in process memory.
 *
 * NOTE: on serverless every instance has its own memory and instances are recycled, so
 * this is only a best-effort brake for ONE instance, NOT a global limit. Production uses
 * the Postgres-backed limiter (rate-limit-shared.ts); this one is its fail-open fallback
 * and the limiter used in tests.
 */
export function createFixedWindowRateLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 10_000,
}: FixedWindowOptions): RateLimiter {
  const windows = new Map<string, { start: number; count: number }>();

  function prune(at: number) {
    for (const [key, w] of windows) if (at - w.start >= windowMs) windows.delete(key);
    // Still too many live keys (attack with many distinct keys): drop the oldest.
    for (const key of windows.keys()) {
      if (windows.size < maxKeys) break;
      windows.delete(key);
    }
  }

  return {
    check(key) {
      const at = now();
      let w = windows.get(key);
      if (!w || at - w.start >= windowMs) {
        if (!w && windows.size >= maxKeys) prune(at);
        w = { start: at, count: 0 };
        windows.set(key, w);
      }
      w.count += 1;
      if (w.count <= limit) return { allowed: true, retryAfterSeconds: 0 };
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((w.start + windowMs - at) / 1000)) };
    },
  };
}
