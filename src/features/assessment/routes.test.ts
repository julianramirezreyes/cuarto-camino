import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAssessmentHandlers } from "./http";
import { makeHarness } from "./test-helpers";
import { createFixedWindowRateLimiter } from "./rate-limit";

// Route files only wire exports; the container is mocked so no env/DB is needed.
const state = vi.hoisted(() => ({ handlers: null as unknown }));
vi.mock("@/features/assessment/container", () => ({
  get assessmentHandlers() {
    return state.handlers;
  },
}));

const ORIGIN = "http://localhost:3000";

beforeEach(() => {
  const h = makeHarness();
  state.handlers = createAssessmentHandlers(() => ({
    service: h.service,
    guests: h.guests,
    getUserId: async () => null,
    limiters: {
      general: createFixedWindowRateLimiter({ limit: 100, windowMs: 1000 }),
      start: createFixedWindowRateLimiter({ limit: 100, windowMs: 1000 }),
    },
    secureCookies: false,
  }));
});

describe("route modules", () => {
  it("export exactly the contract's methods", async () => {
    const mods = await Promise.all([
      import("@/app/api/assessments/route"),
      import("@/app/api/assessments/current/route"),
      import("@/app/api/assessments/claim/route"),
      import("@/app/api/assessments/[id]/route"),
      import("@/app/api/assessments/[id]/answers/route"),
      import("@/app/api/assessments/[id]/back/route"),
      import("@/app/api/assessments/[id]/pause/route"),
      import("@/app/api/assessments/[id]/result/route"),
    ]);
    expect(mods.map((m) => Object.keys(m).sort())).toEqual([
      ["POST"],
      ["GET"],
      ["POST"],
      ["DELETE"],
      ["POST"],
      ["POST"],
      ["POST"],
      ["GET"],
    ]);
  });

  it("POST /api/assessments wires through the container and Next-style params are awaited", async () => {
    const { POST } = await import("@/app/api/assessments/route");
    const res = await POST(
      new Request(`${ORIGIN}/api/assessments`, {
        method: "POST",
        headers: { origin: ORIGIN, "content-type": "application/json" },
        body: JSON.stringify({ consent: true, policyVersion: "1" }),
      }),
    );
    expect(res.status).toBe(201);
    const cookie = res.headers.get("set-cookie")!.split(";")[0];
    const { id } = (await res.json()).assessment;

    const { POST: pause } = await import("@/app/api/assessments/[id]/pause/route");
    const paused = await pause(
      new Request(`${ORIGIN}/api/assessments/${id}/pause`, { method: "POST", headers: { origin: ORIGIN, cookie } }),
      { params: Promise.resolve({ id }) },
    );
    expect(await paused.json()).toEqual({ status: "paused" });
  });
});
