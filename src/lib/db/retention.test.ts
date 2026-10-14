import { drizzle } from "drizzle-orm/neon-serverless";
import { describe, expect, it, vi } from "vitest";
import { purgeExpired, retentionCutoffs, SOFT_DELETE_GRACE_DAYS, RATE_LIMIT_ROW_TTL_HOURS } from "./retention";
import * as schema from "./schema";
import type { TransactionalDb } from "./transactional";

/**
 * Offline: records the SQL that would be sent, using a fake transaction built from a
 * mocked drizzle instance. Proves statement shape/order, NOT behaviour on Postgres.
 */
describe("purgeExpired (SQL shape only)", () => {
  it("selects expired guests, then deletes assessments before guest sessions", async () => {
    const mock = drizzle.mock({ schema });
    const sqls: string[] = [];
    const guestRows = [{ id: "g1" }];
    const fakeTx = {
      select: (...a: Parameters<typeof mock.select>) => ({
        from: (t: never) => {
          const b = mock.select(...a).from(t);
          return {
            where: (w: never) => {
              sqls.push(b.where(w).toSQL().sql);
              return Promise.resolve(guestRows);
            },
          };
        },
      }),
      delete: (t: Parameters<typeof mock.delete>[0]) => {
        const b = mock.delete(t);
        return {
          where: (w: never) => ({
            returning: () => {
              sqls.push(b.where(w).toSQL().sql);
              return Promise.resolve(sqls.length > 3 ? [{ key: "a" }, { key: "b" }] : [{ id: "x" }]);
            },
          }),
        };
      },
    };
    const db = {
      transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn(fakeTx)),
    } as unknown as TransactionalDb;

    const result = await purgeExpired(db, new Date("2026-06-01T00:00:00Z"));

    expect(result).toEqual({ assessments: 1, guestSessions: 1, rateLimits: 4 });
    expect(sqls[0]).toMatch(
      /from "guest_sessions" where "guest_sessions"\."expires_at" </,
    );
    expect(sqls[1]).toMatch(/^delete from "assessments"/);
    expect(sqls[1]).toMatch(/"assessments"\."guest_session_id" in/);
    expect(sqls[2]).toMatch(/^delete from "guest_sessions"/);
    expect(sqls[3]).toMatch(/^delete from "rate_limits" where "rate_limits"\."window_start" </);
    expect(sqls[4]).toMatch(/^delete from "auth_rate_limit" where "auth_rate_limit"\."last_request" </);
    // assessments.expires_at is intentionally NOT used (never set); see docs/retencion-y-limites.md
    expect(sqls[1]).not.toMatch(/expires_at/);
    expect(SOFT_DELETE_GRACE_DAYS).toBeGreaterThan(0);
  });
});

describe("retentionCutoffs (pure, injected clock)", () => {
  const now = new Date("2026-06-15T12:00:00Z");

  it("soft-deleted assessments are purged after exactly 7 days", () => {
    expect(SOFT_DELETE_GRACE_DAYS).toBe(7);
    expect(retentionCutoffs(now).softDeletedBefore.toISOString()).toBe("2026-06-08T12:00:00.000Z");
  });

  it("rate limit rows are purged after the row TTL (both stores)", () => {
    const c = retentionCutoffs(now);
    const cutoff = now.getTime() - RATE_LIMIT_ROW_TTL_HOURS * 3_600_000;
    expect(c.rateLimitsBefore.getTime()).toBe(cutoff);
    expect(c.authRateLimitBeforeMs).toBe(cutoff);
  });
});
