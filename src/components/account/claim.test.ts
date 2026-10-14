import { describe, expect, it, vi } from "vitest";
import { claimGuestAssessment, resolveDestination } from "./claim";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("claimGuestAssessment", () => {
  it("POSTs once to the claim endpoint with same-origin credentials", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ claimed: 2 }));
    const out = await claimGuestAssessment(fetchImpl);
    expect(out).toEqual({ status: "claimed", claimed: 2 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/assessments/claim",
      expect.objectContaining({ method: "POST", credentials: "same-origin" }),
    );
  });

  it("treats claimed 0 as nothing to move (not an error)", async () => {
    const out = await claimGuestAssessment(vi.fn().mockResolvedValue(json({ claimed: 0 })));
    expect(out).toEqual({ status: "nothing" });
  });

  it.each([
    ["server error", () => Promise.resolve(json({ error: "internal_error" }, 500))],
    ["unauthorized", () => Promise.resolve(json({ error: "unauthorized" }, 401))],
    ["rate limited", () => Promise.resolve(json({ error: "rate_limited" }, 429))],
    ["network error", () => Promise.reject(new TypeError("offline"))],
    ["malformed body", () => Promise.resolve(new Response("<html>", { status: 200 }))],
    ["wrong shape", () => Promise.resolve(json({ claimed: "many" }))],
  ])("reports failed on %s", async (_n, impl) => {
    expect(await claimGuestAssessment(vi.fn().mockImplementation(impl))).toEqual({ status: "failed" });
  });
});

describe("resolveDestination", () => {
  const never = vi.fn().mockRejectedValue(new Error("should not be called"));

  it("follows a validated next path first", async () => {
    expect(await resolveDestination({ next: "/biblioteca", intent: "sign-up", outcome: { status: "nothing" }, fetchImpl: never })).toBe("/biblioteca");
  });

  it("sends a brand-new account with nothing claimed to the assessment", async () => {
    expect(await resolveDestination({ next: null, intent: "sign-up", outcome: { status: "nothing" }, fetchImpl: never })).toBe("/evaluacion");
  });

  it("sends a returning user with nothing claimed to the result page", async () => {
    expect(await resolveDestination({ next: null, intent: "sign-in", outcome: { status: "nothing" }, fetchImpl: never })).toBe("/resultado");
  });

  it("after a claim: open (in progress) assessment resumes, otherwise the result", async () => {
    const open = vi.fn().mockResolvedValue(json({ assessment: { id: "x" } }));
    expect(await resolveDestination({ next: null, intent: "sign-up", outcome: { status: "claimed", claimed: 1 }, fetchImpl: open })).toBe("/evaluacion");
    expect(open).toHaveBeenCalledWith("/api/assessments/current", expect.anything());
    const none = vi.fn().mockResolvedValue(json({ error: "not_found" }, 404));
    expect(await resolveDestination({ next: null, intent: "sign-up", outcome: { status: "claimed", claimed: 1 }, fetchImpl: none })).toBe("/resultado");
    const boom = vi.fn().mockRejectedValue(new Error("x"));
    expect(await resolveDestination({ next: null, intent: "sign-up", outcome: { status: "claimed", claimed: 1 }, fetchImpl: boom })).toBe("/resultado");
  });

  it("falls back by intent when the claim failed", async () => {
    expect(await resolveDestination({ next: null, intent: "sign-in", outcome: { status: "failed" }, fetchImpl: never })).toBe("/resultado");
    expect(await resolveDestination({ next: null, intent: "sign-up", outcome: { status: "failed" }, fetchImpl: never })).toBe("/evaluacion");
  });
});
