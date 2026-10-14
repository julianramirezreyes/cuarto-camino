import { afterEach, describe, expect, it, vi } from "vitest";
import { createPurgeHandler, isAuthorizedCron } from "./handler";

vi.mock("next/server", () => ({ connection: async () => {} }));

const SECRET = "test-secret-value-1234567890";
const result = { assessments: 2, guestSessions: 1, rateLimits: 5 };
const call = (h: ReturnType<typeof createPurgeHandler>, auth?: string) =>
  h(new Request("https://app.test/api/cron/purge", { headers: auth ? { authorization: auth } : {} }));

function setup(secret: string | undefined) {
  const run = vi.fn(async () => result);
  return { run, handler: createPurgeHandler({ getSecret: () => secret, run }) };
}

describe("isAuthorizedCron (constant-time)", () => {
  it("accepts only the exact bearer token", () => {
    expect(isAuthorizedCron(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(isAuthorizedCron(`Bearer ${SECRET}x`, SECRET)).toBe(false);
    expect(isAuthorizedCron(SECRET, SECRET)).toBe(false);
    expect(isAuthorizedCron(null, SECRET)).toBe(false);
    expect(isAuthorizedCron("Bearer ", "")).toBe(false);
  });
});

describe("GET /api/cron/purge", () => {
  it("401 without a token and never runs the purge", async () => {
    const { handler, run } = setup(SECRET);
    const res = await call(handler);
    expect(res.status).toBe(401);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(run).not.toHaveBeenCalled();
  });

  it("401 with a wrong token", async () => {
    const { handler, run } = setup(SECRET);
    expect((await call(handler, "Bearer nope")).status).toBe(401);
    expect(run).not.toHaveBeenCalled();
  });

  it("500 with a generic body when CRON_SECRET is not configured (never runs unauthenticated)", async () => {
    const { handler, run } = setup(undefined);
    for (const auth of [undefined, "Bearer ", "Bearer undefined"]) {
      const res = await call(handler, auth);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "cron_not_configured" });
    }
    expect(run).not.toHaveBeenCalled();
  });

  it("200 with counts only and no-store when authorized", async () => {
    const { handler, run } = setup(SECRET);
    const res = await call(handler, `Bearer ${SECRET}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual(result);
    expect(run).toHaveBeenCalledOnce();
  });

  it("500 generic body when the purge throws (no error details leaked)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const handler = createPurgeHandler({ getSecret: () => SECRET, run: async () => { throw new Error("postgres://user:pw@host"); } });
    const res = await call(handler, `Bearer ${SECRET}`);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "purge_failed" });
    expect(JSON.stringify(spy.mock.calls)).not.toContain("pw@host");
    spy.mockRestore();
  });
});

describe("exported GET (route)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is 500 and touches no DB when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const { GET } = await import("./route");
    const res = await GET(new Request("https://app.test/api/cron/purge", { headers: { authorization: "Bearer x" } }));
    expect(res.status).toBe(500);
  });

  it("is 401 with a wrong token when configured", async () => {
    vi.stubEnv("CRON_SECRET", SECRET);
    const { GET } = await import("./route");
    const res = await GET(new Request("https://app.test/api/cron/purge", { headers: { authorization: "Bearer wrong" } }));
    expect(res.status).toBe(401);
  });
});
