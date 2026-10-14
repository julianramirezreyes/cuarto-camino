import { afterEach, describe, expect, it, vi } from "vitest";
import { QUESTION_BANK } from "@/content/questions";
import { createAssessmentHandlers, isSameOrigin, type AssessmentApiDeps } from "./http";
import { createFixedWindowRateLimiter } from "./rate-limit";
import { makeHarness, respondent } from "./test-helpers";

const ORIGIN = "https://app.test";

function setup(opts: { secure?: boolean; startLimit?: number; generalLimit?: number } = {}) {
  const h = makeHarness();
  let userId: string | null = null;
  const deps: AssessmentApiDeps = {
    service: h.service,
    guests: h.guests,
    getUserId: async () => userId,
    limiters: {
      general: createFixedWindowRateLimiter({ limit: opts.generalLimit ?? 1000, windowMs: 60_000 }),
      start: createFixedWindowRateLimiter({ limit: opts.startLimit ?? 1000, windowMs: 60_000 }),
    },
    secureCookies: opts.secure ?? false,
  };
  const api = createAssessmentHandlers(() => deps);
  return { h, api, setUser: (id: string | null) => void (userId = id) };
}

function req(method: string, path: string, init: { body?: unknown; cookie?: string; origin?: string | null; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = { ...init.headers };
  if (init.origin !== null && method !== "GET") headers.origin = init.origin ?? ORIGIN;
  if (init.cookie) headers.cookie = init.cookie;
  if (init.body !== undefined) headers["content-type"] = "application/json";
  return new Request(`${ORIGIN}${path}`, {
    method,
    headers,
    body: init.body === undefined ? undefined : typeof init.body === "string" ? init.body : JSON.stringify(init.body),
  });
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const START = { consent: true, policyVersion: "2026-01" };
const cookieOf = (res: Response) => res.headers.get("set-cookie")!;
const cookiePair = (res: Response) => cookieOf(res).split(";")[0];

afterEach(() => vi.restoreAllMocks());

describe("POST /api/assessments", () => {
  it("creates a guest session (httpOnly cookie, only the hash stored) and returns 201", async () => {
    const { api, h } = setup();
    const res = await api.start(req("POST", "/api/assessments", { body: START }));
    expect(res.status).toBe(201);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json();
    expect(body.assessment.status).toBe("in_progress");
    expect(body.resumed).toBe(false);
    expect(Object.keys(body.question).sort()).toEqual(["id", "kind", "module", "options", "text"]);
    expect(Object.keys(body.question.options[0]).sort()).toEqual(["id", "text"]);
    expect(body.progress).toEqual({ answered: 0, module: "type", moduleIndex: 0, moduleMin: 18, moduleMax: 28 });
    const c = cookieOf(res);
    expect(c).toMatch(/^cc_guest=[A-Za-z0-9_-]{43};/);
    expect(c).toContain("HttpOnly");
    expect(c).toContain("SameSite=Lax");
    expect(c).not.toContain("Secure");
    const token = c.split("=")[1].split(";")[0];
    expect(JSON.stringify([...h.repo.guests.values()])).not.toContain(token);
  });

  it("uses the __Host- cookie with Secure in production", async () => {
    const { api } = setup({ secure: true });
    const res = await api.start(req("POST", "/api/assessments", { body: START }));
    expect(cookieOf(res)).toMatch(/^__Host-cc_guest=/);
    expect(cookieOf(res)).toContain("Secure");
  });

  it("resumes with the same cookie (resumed: true, no new session)", async () => {
    const { api, h } = setup();
    const first = await api.start(req("POST", "/api/assessments", { body: START }));
    const second = await api.start(req("POST", "/api/assessments", { body: START, cookie: cookiePair(first) }));
    const body = await second.json();
    expect(second.status).toBe(201);
    expect(body.resumed).toBe(true);
    expect(second.headers.get("set-cookie")).toBeNull();
    expect(h.repo.guests.size).toBe(1);
  });

  it("an authenticated user gets no guest cookie", async () => {
    const { api, setUser, h } = setup();
    setUser("u1");
    const res = await api.start(req("POST", "/api/assessments", { body: START }));
    expect(res.status).toBe(201);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect([...h.repo.assessments.values()][0].userId).toBe("u1");
  });

  it.each([
    ["no consent", { consent: false, policyVersion: "x" }],
    ["unknown key", { ...START, extra: 1 }],
    ["missing policy", { consent: true }],
    ["empty object", {}],
    ["string consent", { consent: "true", policyVersion: "x" }],
  ])("400 on invalid body: %s", async (_n, body) => {
    const { api, h } = setup();
    const res = await api.start(req("POST", "/api/assessments", { body }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_request" });
    expect(h.repo.assessments.size).toBe(0);
  });

  it("400 on malformed JSON, empty body and oversized body", async () => {
    const { api } = setup();
    for (const body of ["{nope", "", "x".repeat(5000)]) {
      const res = await api.start(req("POST", "/api/assessments", { body: body === "" ? undefined : body }));
      expect(res.status).toBe(400);
    }
  });
});

describe("security gates", () => {
  it("403 when the Origin is foreign or missing (CSRF), without side effects", async () => {
    const { api, h } = setup();
    const foreign = await api.start(req("POST", "/api/assessments", { body: START, origin: "https://evil.test" }));
    expect(foreign.status).toBe(403);
    expect(await foreign.json()).toEqual({ error: "forbidden_origin" });
    const missing = await api.start(req("POST", "/api/assessments", { body: START, origin: null }));
    expect(missing.status).toBe(403);
    expect(h.repo.assessments.size + h.repo.guests.size).toBe(0);
  });

  it("accepts a request without Origin only when Sec-Fetch-Site says same-origin", () => {
    const r = req("POST", "/x", { origin: null, headers: { "sec-fetch-site": "same-origin" } });
    expect(isSameOrigin(r)).toBe(true);
    expect(isSameOrigin(req("POST", "/x", { origin: null, headers: { "sec-fetch-site": "cross-site" } }))).toBe(false);
    expect(isSameOrigin(req("POST", "/x", { origin: "https://proxy.test" }), ["https://proxy.test"])).toBe(true);
    expect(isSameOrigin(req("POST", "/x", { origin: "null" }))).toBe(false);
  });

  it("429 with Retry-After once the limit is hit", async () => {
    const { api } = setup({ startLimit: 2 });
    const mk = () => api.start(req("POST", "/api/assessments", { body: START, headers: { "x-forwarded-for": "9.9.9.9, 1.1.1.1" } }));
    expect((await mk()).status).toBe(201);
    expect((await mk()).status).toBe(201);
    const blocked = await mk();
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: "rate_limited" });
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThanOrEqual(1);
    // another client is unaffected
    const other = await api.start(req("POST", "/api/assessments", { body: START, headers: { "x-forwarded-for": "8.8.8.8" } }));
    expect(other.status).toBe(201);
  });

  it("500 never leaks internals nor echoes the answer in logs", async () => {
    const { api, h } = setup();
    const start = await api.start(req("POST", "/api/assessments", { body: START }));
    const { assessment, question } = await start.json();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(h.repo, "upsertAnswer").mockRejectedValue(new Error(`insert ... params: SECRET-ANSWER-MARKER ${question.options[0].id}`));
    const res = await api.answer(
      req("POST", `/api/assessments/${assessment.id}/answers`, { body: { questionId: question.id, optionId: question.options[0].id }, cookie: cookiePair(start) }),
      ctx(assessment.id),
    );
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal_error" });
    expect(JSON.stringify(spy.mock.calls)).not.toContain("SECRET-ANSWER-MARKER");
    expect(JSON.stringify(spy.mock.calls)).toContain("unexpected error");
  });
});

describe("assessment flow over HTTP", () => {
  async function started() {
    const s = setup();
    const res = await s.api.start(req("POST", "/api/assessments", { body: START }));
    const body = await res.json();
    return { ...s, cookie: cookiePair(res), id: body.assessment.id as string, first: body.question };
  }

  it("current, answers, back, pause, result 409, delete 204", async () => {
    const { api, cookie, id, first } = await started();

    const cur = await api.current(req("GET", "/api/assessments/current", { cookie }));
    expect(cur.status).toBe(200);
    expect((await cur.json()).question.id).toBe(first.id);

    const a1 = await api.answer(
      req("POST", `/api/assessments/${id}/answers`, { body: { questionId: first.id, optionId: first.options[1].id }, cookie }),
      ctx(id),
    );
    expect(a1.status).toBe(200);
    const a1b = await a1.json();
    expect(a1b.done).toBe(false);
    expect(a1b.progress.answered).toBe(1);

    const back = await api.back(req("POST", `/api/assessments/${id}/back`, { cookie }), ctx(id));
    expect(back.status).toBe(200);
    const backBody = await back.json();
    expect(backBody.question.id).toBe(first.id);
    expect(backBody.question.selectedOptionId).toBe(first.options[1].id);

    const none = await api.back(req("POST", `/api/assessments/${id}/back`, { cookie, body: { questionId: first.id } }), ctx(id));
    expect(none.status).toBe(409);
    expect(await none.json()).toEqual({ error: "no_previous" });

    const pause = await api.pause(req("POST", `/api/assessments/${id}/pause`, { cookie }), ctx(id));
    expect(await pause.json()).toEqual({ status: "paused" });

    const res = await api.result(req("GET", `/api/assessments/${id}/result`, { cookie }), ctx(id));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "not_complete" });

    const del = await api.remove(req("DELETE", `/api/assessments/${id}`, { cookie }), ctx(id));
    expect(del.status).toBe(204);
    expect(await del.text()).toBe("");
    const gone = await api.current(req("GET", "/api/assessments/current", { cookie }));
    expect(gone.status).toBe(404);
    expect(await gone.json()).toEqual({ error: "not_found" });
  });

  it("completes through the API and serves the stored report", async () => {
    const { api, cookie, id, first } = await started();
    const pick = respondent(5, 1);
    let q = first;
    let done = false;
    for (let i = 0; i < 100 && q; i++) {
      const full = QUESTION_BANK.find((x) => x.id === q.id)!;
      const r = await api.answer(
        req("POST", `/api/assessments/${id}/answers`, { body: { questionId: q.id, optionId: pick(full) }, cookie }),
        ctx(id),
      );
      const b = await r.json();
      done = b.done;
      q = b.question;
    }
    expect(done).toBe(true);
    const res = await api.result(req("GET", `/api/assessments/${id}/result`, { cookie }), ctx(id));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.report.primaryType).toBe(5);
    expect(body.engineVersion).toBe("1.0.0");
    expect(body.bankVersion).toBe("1.0.0-draft");
    expect(new Date(body.completedAt).toString()).not.toBe("Invalid Date");
  });

  it("400 on invalid answer bodies; 400 for unknown question ids", async () => {
    const { api, cookie, id, first } = await started();
    for (const body of [{}, { questionId: first.id }, { questionId: "../x", optionId: "a" }, { questionId: first.id, optionId: first.options[0].id, x: 1 }]) {
      const res = await api.answer(req("POST", `/api/assessments/${id}/answers`, { body, cookie }), ctx(id));
      expect(res.status).toBe(400);
    }
    const res = await api.answer(req("POST", `/api/assessments/${id}/answers`, { body: { questionId: "q-nope", optionId: "opt-a" }, cookie }), ctx(id));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_answer" });
  });

  it("409 when answering a question that is not available", async () => {
    const { api, cookie, id, first } = await started();
    const other = QUESTION_BANK.find((q) => q.module === "type" && q.id !== first.id)!;
    const res = await api.answer(
      req("POST", `/api/assessments/${id}/answers`, { body: { questionId: other.id, optionId: other.options[0].id }, cookie }),
      ctx(id),
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "question_not_available" });
  });

  it("404 (never 403) for foreign guests, no cookie, malformed and unknown ids", async () => {
    const { api, id, first, cookie } = await started();
    const other = await api.start(req("POST", "/api/assessments", { body: START }));
    const intruder = cookiePair(other);
    const unknown = "00000000-0000-4000-8000-000000000000";
    const attempts: Promise<Response>[] = [];
    for (const c of [intruder, undefined]) {
      attempts.push(
        api.answer(req("POST", `/api/assessments/${id}/answers`, { body: { questionId: first.id, optionId: first.options[0].id }, cookie: c }), ctx(id)),
        api.back(req("POST", `/api/assessments/${id}/back`, { cookie: c }), ctx(id)),
        api.pause(req("POST", `/api/assessments/${id}/pause`, { cookie: c }), ctx(id)),
        api.result(req("GET", `/api/assessments/${id}/result`, { cookie: c }), ctx(id)),
        api.remove(req("DELETE", `/api/assessments/${id}`, { cookie: c }), ctx(id)),
      );
    }
    attempts.push(api.pause(req("POST", `/api/assessments/${unknown}/pause`, { cookie }), ctx(unknown)));
    attempts.push(api.pause(req("POST", `/api/assessments/not-a-uuid/pause`, { cookie }), ctx("not-a-uuid")));
    for (const r of await Promise.all(attempts)) {
      expect(r.status).toBe(404);
      expect(await r.json()).toEqual({ error: "not_found" });
    }
    // the owner is untouched
    const cur = await api.current(req("GET", "/api/assessments/current", { cookie }));
    expect(cur.status).toBe(200);
  });
});

describe("POST /api/assessments/claim", () => {
  it("401 without a user; claims once with user + cookie and clears the cookie", async () => {
    const { api, setUser } = setup();
    const start = await api.start(req("POST", "/api/assessments", { body: START }));
    const cookie = cookiePair(start);

    const anon = await api.claim(req("POST", "/api/assessments/claim", { cookie }));
    expect(anon.status).toBe(401);

    setUser("u1");
    const ok = await api.claim(req("POST", "/api/assessments/claim", { cookie }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ claimed: 1 });
    expect(cookieOf(ok)).toMatch(/^cc_guest=; Path=\/; Max-Age=0/);

    const again = await api.claim(req("POST", "/api/assessments/claim", { cookie }));
    expect(await again.json()).toEqual({ claimed: 0 });

    const mine = await api.current(req("GET", "/api/assessments/current"));
    expect(mine.status).toBe(200);
  });

  it("claimed: 0 with no cookie; blocked cross-origin", async () => {
    const { api, setUser } = setup();
    setUser("u1");
    expect(await (await api.claim(req("POST", "/api/assessments/claim"))).json()).toEqual({ claimed: 0 });
    expect((await api.claim(req("POST", "/api/assessments/claim", { origin: "https://evil.test" }))).status).toBe(403);
  });
});
