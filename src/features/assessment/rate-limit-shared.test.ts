import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";
import { createFixedWindowRateLimiter } from "./rate-limit";
import {
  RATE_LIMITS,
  clientIp,
  createSharedRateLimiter,
  hashRateLimitKey,
  resolveRateLimitSalt,
} from "./rate-limit-shared";

const dialect = new PgDialect();

/** Recording driver: stores the SQL/params and answers like Postgres would for the upsert. */
function recorder(respond: (n: number) => { count: number; window_start: Date }) {
  const log: { sql: string; params: unknown[] }[] = [];
  const db = {
    execute: async (q: SQL) => {
      const { sql, params } = dialect.sqlToQuery(q);
      log.push({ sql, params });
      return { rows: [respond(log.length)] };
    },
  };
  return { db, log };
}

describe("hashRateLimitKey / clientIp", () => {
  it("never leaks the raw IP and depends on the salt", () => {
    const a = hashRateLimitKey("203.0.113.9", "salt-a");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("203.0.113.9");
    expect(hashRateLimitKey("203.0.113.9", "salt-b")).not.toBe(a);
    expect(hashRateLimitKey("203.0.113.9", "salt-a")).toBe(a);
  });

  it("uses the first x-forwarded-for hop, then x-real-ip, then a constant bucket", () => {
    const r = (h: Record<string, string>) => new Request("https://x.test/", { headers: h });
    expect(clientIp(r({ "x-forwarded-for": "1.1.1.1, 2.2.2.2", "x-real-ip": "3.3.3.3" }))).toBe("1.1.1.1");
    expect(clientIp(r({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(r({}))).toBe("unknown");
  });

  it("derives the salt from RATE_LIMIT_SALT, else from AUTH_SECRET, else a constant", () => {
    expect(resolveRateLimitSalt({ RATE_LIMIT_SALT: "s1", AUTH_SECRET: "x".repeat(40) })).toBe("s1");
    const derived = resolveRateLimitSalt({ AUTH_SECRET: "x".repeat(40) });
    expect(derived).not.toContain("xxxx");
    expect(derived).toHaveLength(64);
    expect(resolveRateLimitSalt({})).toBe("cuarto-camino-rate-limit");
  });
});

describe("shared (Postgres) rate limiter", () => {
  const WINDOW_START = new Date("2026-01-01T00:00:00Z");

  it("sends ONE atomic upsert with a hashed key and the window as a parameter", async () => {
    const { db, log } = recorder(() => ({ count: 1, window_start: WINDOW_START }));
    const rl = createSharedRateLimiter({ db, limit: 3, windowSeconds: 60, salt: "s", fallback: createFixedWindowRateLimiter({ limit: 1, windowMs: 1000 }) });
    const res = await rl.check("start:203.0.113.9");
    expect(res).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(log).toHaveLength(1);
    const { sql, params } = log[0];
    expect(sql).toMatch(/insert into "rate_limits"/i);
    expect(sql).toMatch(/on conflict \("key"\) do update/i);
    expect(sql).toMatch(/make_interval\(secs => \$\d+\)/i);
    expect(sql).toMatch(/case when "rate_limits"\."window_start" <= now\(\) - make_interval/i);
    expect(sql).toMatch(/returning "count", "window_start"/i);
    const key = String(params[0]);
    expect(key).toBe(`start:${hashRateLimitKey("203.0.113.9", "s")}`);
    expect(JSON.stringify(params)).not.toContain("203.0.113.9");
    expect(params).toContain(60);
  });

  it("blocks above the limit and reports Retry-After from the DB window start", async () => {
    const now = new Date(WINDOW_START.getTime() + 20_000);
    const { db } = recorder((n) => ({ count: n, window_start: WINDOW_START }));
    const rl = createSharedRateLimiter({ db, limit: 2, windowSeconds: 60, salt: "s", now: () => now, fallback: createFixedWindowRateLimiter({ limit: 1, windowMs: 1000 }) });
    expect((await rl.check("general:ip")).allowed).toBe(true);
    expect((await rl.check("general:ip")).allowed).toBe(true);
    expect(await rl.check("general:ip")).toEqual({ allowed: false, retryAfterSeconds: 40 });
  });

  it("never reports less than 1 second of Retry-After", async () => {
    const { db } = recorder(() => ({ count: 99, window_start: new Date(0) }));
    const rl = createSharedRateLimiter({ db, limit: 1, windowSeconds: 60, salt: "s", now: () => new Date(60_000), fallback: createFixedWindowRateLimiter({ limit: 1, windowMs: 1000 }) });
    expect((await rl.check("k:i")).retryAfterSeconds).toBe(1);
  });

  it("fails OPEN to the in-memory limiter on DB error and logs only a generic code", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const db = { execute: async () => { throw new Error("connection to 203.0.113.9 failed: password=secret"); } };
    const rl = createSharedRateLimiter({ db, limit: 5, windowSeconds: 60, salt: "s", fallback: createFixedWindowRateLimiter({ limit: 1, windowMs: 60_000 }) });
    expect((await rl.check("start:203.0.113.9")).allowed).toBe(true);
    // fallback is the per-instance limiter: its own limit (1) still applies
    expect((await rl.check("start:203.0.113.9")).allowed).toBe(false);
    const logged = JSON.stringify(spy.mock.calls);
    expect(logged).toContain("rate_limit_store_unavailable");
    expect(logged).not.toContain("203.0.113.9");
    expect(logged).not.toContain("secret");
    spy.mockRestore();
  });

  it("falls back when the DB returns no row", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const rl = createSharedRateLimiter({ db: { execute: async () => ({ rows: [] }) }, limit: 5, windowSeconds: 60, salt: "s", fallback: createFixedWindowRateLimiter({ limit: 5, windowMs: 1000 }) });
    expect((await rl.check("k:i")).allowed).toBe(true);
    spy.mockRestore();
  });

  it("keeps today's limits as constants", () => {
    expect(RATE_LIMITS).toEqual({ general: { limit: 120, windowSeconds: 60 }, start: { limit: 10, windowSeconds: 60 } });
  });
});
