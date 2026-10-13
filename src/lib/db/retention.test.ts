import { drizzle } from "drizzle-orm/neon-serverless";
import { describe, expect, it, vi } from "vitest";
import { purgeExpired, SOFT_DELETE_GRACE_DAYS } from "./retention";
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
              return Promise.resolve([{ id: "x" }]);
            },
          }),
        };
      },
    };
    const db = {
      transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn(fakeTx)),
    } as unknown as TransactionalDb;

    const result = await purgeExpired(db, new Date("2026-06-01T00:00:00Z"));

    expect(result).toEqual({ assessments: 1, guestSessions: 1 });
    expect(sqls[0]).toMatch(
      /from "guest_sessions" where "guest_sessions"\."expires_at" </,
    );
    expect(sqls[1]).toMatch(/^delete from "assessments"/);
    expect(sqls[1]).toMatch(/"assessments"\."guest_session_id" in/);
    expect(sqls[2]).toMatch(/^delete from "guest_sessions"/);
    expect(SOFT_DELETE_GRACE_DAYS).toBeGreaterThan(0);
  });
});
