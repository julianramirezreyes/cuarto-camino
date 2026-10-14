import { drizzle } from "drizzle-orm/pg-proxy";
import { describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { createDrizzleAssessmentRepository, type Db } from "./drizzle-repository";

/**
 * No database available: a pg-proxy driver records the SQL Drizzle generates and feeds
 * canned rows back. This verifies statement shape, order and transaction scope, NOT
 * constraint behaviour (that needs real Postgres, see docs/api.md).
 */
function fake(respond: (sql: string) => unknown[][] = () => []) {
  const log: { sql: string; params: unknown[] }[] = [];
  const events: string[] = [];
  const db = drizzle(
    async (sql, params) => {
      log.push({ sql, params });
      events.push(sql);
      return { rows: respond(sql) };
    },
    { schema },
  ) as unknown as Db;
  const transaction = async <T>(fn: (tx: Db) => Promise<T>) => {
    events.push("BEGIN");
    try {
      const out = await fn(db);
      events.push("COMMIT");
      return out;
    } catch (e) {
      events.push("ROLLBACK");
      throw e;
    }
  };
  return { repo: createDrizzleAssessmentRepository({ db, transaction }), log, events };
}

const NOW = new Date("2026-01-01T00:00:00Z");

describe("claimGuestSession (docs/base-de-datos.md)", () => {
  it("guards with claimed_by_user_id IS NULL and returns null without touching other rows when it loses", async () => {
    const { repo, log, events } = fake(() => []); // UPDATE ... RETURNING matched 0 rows
    const r = await repo.claimGuestSession({ guestSessionId: "g", userId: "u", now: NOW });
    expect(r).toBeNull();
    expect(log).toHaveLength(1);
    expect(log[0].sql).toMatch(/update "guest_sessions"/i);
    expect(log[0].sql).toMatch(/"claimed_by_user_id" is null/i);
    expect(log[0].sql).toMatch(/returning/i);
    expect(events).toEqual(["BEGIN", log[0].sql, "COMMIT"]);
  });

  it("when it wins: one transaction, moves assessments (owner swapped in one UPDATE) and consent", async () => {
    const { repo, log, events } = fake((sql) => (sql.includes('"guest_sessions"') ? [["g"]] : sql.includes('"assessments"') ? [["a1"], ["a2"]] : []));
    const r = await repo.claimGuestSession({ guestSessionId: "g", userId: "u", now: NOW });
    expect(r).toEqual({ assessmentsMoved: 2 });
    expect(log).toHaveLength(3);
    const [guard, moveAssessments, moveConsent] = log.map((l) => l.sql);
    expect(guard).toMatch(/update "guest_sessions" set "claimed_by_user_id" = \$1, "claimed_at"/i);
    expect(guard).toMatch(/"claimed_by_user_id" is null/i);
    expect(moveAssessments).toMatch(/update "assessments" set "user_id" = \$1, "guest_session_id" = \$2/i);
    expect(log[1].params[1]).toBeNull();
    expect(moveAssessments).toMatch(/"deleted_at" is null/i);
    expect(moveConsent).toMatch(/update "consent_records" set "user_id" = \$1, "guest_session_id" = \$2/i);
    expect(events[0]).toBe("BEGIN");
    expect(events.at(-1)).toBe("COMMIT");
  });

  it("rolls back when a later statement fails", async () => {
    const { repo, events } = fake((sql) => {
      if (sql.includes('"guest_sessions"')) return [["g"]];
      throw new Error("boom");
    });
    await expect(repo.claimGuestSession({ guestSessionId: "g", userId: "u", now: NOW })).rejects.toThrow();
    expect(events.at(-1)).toBe("ROLLBACK");
    expect(events).not.toContain("COMMIT");
  });
});

describe("multi-statement writes use the transaction; single ones do not", () => {
  it("create = assessment + consent in one transaction", async () => {
    const { repo, events } = fake((sql) =>
      sql.includes('insert into "assessments"')
        ? [["id1", "u", null, "in_progress", "1.0.0", "b", NOW.toISOString(), null, null, true, null, 1, NOW.toISOString(), NOW.toISOString()]]
        : [],
    );
    await repo.create({ owner: { kind: "user", userId: "u" }, engineVersion: "1.0.0", bankVersion: "b", policyVersion: "p", now: NOW }).catch(() => undefined);
    expect(events[0]).toBe("BEGIN");
    expect(events.some((e) => /insert into "assessments"/i.test(e))).toBe(true);
  });

  it("complete = result insert (ON CONFLICT DO NOTHING) + status update, atomically", async () => {
    const { repo, events } = fake();
    await repo.complete({ assessmentId: "a", report: {} as never, engineVersion: "1.0.0", bankVersion: "b", now: NOW });
    expect(events[0]).toBe("BEGIN");
    expect(events[1]).toMatch(/insert into "assessment_results".*on conflict \("assessment_id","engine_version"\) do nothing/i);
    expect(events[2]).toMatch(/update "assessments" set "status" = \$1/i);
    expect(events[3]).toBe("COMMIT");
  });

  it("upsertAnswer is a single ON CONFLICT statement, no transaction", async () => {
    const { repo, events } = fake();
    await repo.upsertAnswer("a", { questionId: "q", optionId: "o" }, NOW);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatch(/on conflict \("assessment_id","question_id"\) do update/i);
  });

  it("softDelete only touches rows that are not already deleted", async () => {
    const { repo, log } = fake();
    await repo.softDelete("a", NOW);
    expect(log[0].sql).toMatch(/update "assessments" set "deleted_at"/i);
    expect(log[0].sql).toMatch(/"deleted_at" is null/i);
  });
});
