import { createHash } from "node:crypto";
import { sql, type SQL } from "drizzle-orm";
import type { RateLimiter, RateLimitResult } from "./rate-limit";

/** Production limits (per IP bucket). Kept as constants so docs/tests have one source. */
export const RATE_LIMITS = {
  general: { limit: 120, windowSeconds: 60 },
  start: { limit: 10, windowSeconds: 60 },
} as const;

/** Minimal slice of a Drizzle database (neon-http) that the limiter needs. */
export interface SqlExecutor {
  execute(query: SQL): Promise<{ rows: unknown[] }>;
}

const DEFAULT_SALT = "cuarto-camino-rate-limit";

/** RATE_LIMIT_SALT wins; otherwise a one-way derivation of AUTH_SECRET (never the secret itself). */
export function resolveRateLimitSalt(env: Record<string, string | undefined> = process.env): string {
  const explicit = env.RATE_LIMIT_SALT?.trim();
  if (explicit) return explicit;
  const secret = env.AUTH_SECRET?.trim();
  if (secret) return createHash("sha256").update(`rate-limit:${secret}`).digest("hex");
  return DEFAULT_SALT;
}

export function hashRateLimitKey(identity: string, salt: string): string {
  return createHash("sha256").update(`${salt}\u0000${identity}`).digest("hex");
}

/** First `x-forwarded-for` hop, then `x-real-ip`, else one constant bucket. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export interface SharedRateLimiterOptions {
  db: SqlExecutor;
  limit: number;
  windowSeconds: number;
  salt: string;
  /** Used (per instance) when the store is unreachable: fail OPEN, never lock users out. */
  fallback: RateLimiter;
  now?: () => Date;
}

/**
 * Fixed-window counter in Postgres. `check` receives `<bucket>:<identity>`; the identity
 * is hashed before it reaches the database. One single-statement atomic upsert per call
 * (no transaction needed, works over neon-http).
 */
export function createSharedRateLimiter({
  db,
  limit,
  windowSeconds,
  salt,
  fallback,
  now = () => new Date(),
}: SharedRateLimiterOptions): RateLimiter {
  return {
    async check(rawKey): Promise<RateLimitResult> {
      const i = rawKey.indexOf(":");
      const bucket = i < 0 ? "default" : rawKey.slice(0, i);
      const key = `${bucket}:${hashRateLimitKey(i < 0 ? rawKey : rawKey.slice(i + 1), salt)}`;
      try {
        const expired = sql`"rate_limits"."window_start" <= now() - make_interval(secs => ${windowSeconds})`;
        const result = await db.execute(sql`
          insert into "rate_limits" ("key", "window_start", "count", "updated_at")
          values (${key}, now(), 1, now())
          on conflict ("key") do update set
            "count" = case when ${expired} then 1 else "rate_limits"."count" + 1 end,
            "window_start" = case when ${expired} then now() else "rate_limits"."window_start" end,
            "updated_at" = now()
          returning "count", "window_start"`);
        const row = result.rows[0] as { count?: unknown; window_start?: unknown } | undefined;
        const count = Number(row?.count);
        const start = row?.window_start ? new Date(row.window_start as string | Date) : null;
        if (!row || !Number.isFinite(count) || !start || Number.isNaN(start.getTime())) {
          throw new Error("unexpected_rate_limit_row");
        }
        if (count <= limit) return { allowed: true, retryAfterSeconds: 0 };
        const remainingMs = start.getTime() + windowSeconds * 1000 - now().getTime();
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(remainingMs / 1000)) };
      } catch {
        // Generic code only: driver messages can carry hosts, params or IPs.
        console.error("[rate-limit] rate_limit_store_unavailable");
        return fallback.check(rawKey);
      }
    },
  };
}
