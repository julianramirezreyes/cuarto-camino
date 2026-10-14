import { describe, expect, it, vi } from "vitest";
import { QUESTION_BANK } from "@/content/questions";
import { AssessmentError } from "@/features/assessment/errors";
import type { Principal } from "@/features/assessment/service";
import { makeHarness, respondent } from "@/features/assessment/test-helpers";
import { loadLatestResult, type LoaderDeps } from "./load-result";

const guest = (id: string): Principal => ({ kind: "guest", guestSessionId: id });

async function completeFor(h: ReturnType<typeof makeHarness>, p: Principal) {
  const view = await h.service.startOrResume(p, { granted: true, policyVersion: "t" });
  const pick = respondent(5, 1);
  let q = view.question;
  while (q) {
    const full = QUESTION_BANK.find((x) => x.id === q!.id)!;
    q = (await h.service.submitAnswer(p, view.assessment.id, q.id, pick(full))).question;
  }
  return view.assessment.id;
}

describe("loadLatestResult", () => {
  it("is empty without a principal and never queries anything else", async () => {
    const deps: LoaderDeps = {
      resolvePrincipal: async () => null,
      findLatestCompletedId: vi.fn(),
      getResult: vi.fn(),
    };
    expect(await loadLatestResult(deps)).toEqual({ status: "empty" });
    expect(deps.findLatestCompletedId).not.toHaveBeenCalled();
    expect(deps.getResult).not.toHaveBeenCalled();
  });

  it("is empty when there is no completed assessment", async () => {
    const deps: LoaderDeps = {
      resolvePrincipal: async () => guest("g1"),
      findLatestCompletedId: async () => null,
      getResult: vi.fn(),
    };
    expect(await loadLatestResult(deps)).toEqual({ status: "empty" });
  });

  it.each(["not_found", "not_complete"] as const)("is empty when the service says %s", async (code) => {
    const deps: LoaderDeps = {
      resolvePrincipal: async () => guest("g1"),
      findLatestCompletedId: async () => "id",
      getResult: async () => {
        throw new AssessmentError(code);
      },
    };
    expect(await loadLatestResult(deps)).toEqual({ status: "empty" });
  });

  it("propagates unexpected errors (error boundary), not a friendly state", async () => {
    const deps: LoaderDeps = {
      resolvePrincipal: async () => guest("g1"),
      findLatestCompletedId: async () => "id",
      getResult: async () => {
        throw new Error("db down");
      },
    };
    await expect(loadLatestResult(deps)).rejects.toThrow("db down");
  });

  it("returns the stored report for the owner through the real service, serializable", async () => {
    const h = makeHarness();
    const owner = guest("g-owner");
    const id = await completeFor(h, owner);
    const out = await loadLatestResult({
      resolvePrincipal: async () => owner,
      findLatestCompletedId: async () => id,
      getResult: (p, i) => h.service.getResult(p, i),
    });
    expect(out.status).toBe("ready");
    if (out.status !== "ready") return;
    expect(out.assessmentId).toBe(id);
    expect(out.report.primaryType).not.toBeNull();
    expect(typeof out.meta.completedAt).toBe("string");
    expect(JSON.parse(JSON.stringify(out))).toEqual(out);
  });

  it("a foreign principal cannot read someone else's result even if an id leaks", async () => {
    const h = makeHarness();
    const id = await completeFor(h, guest("g-owner"));
    const out = await loadLatestResult({
      resolvePrincipal: async () => guest("g-other"),
      findLatestCompletedId: async () => id,
      getResult: (p, i) => h.service.getResult(p, i),
    });
    expect(out).toEqual({ status: "empty" });
  });

  it("is empty when the report has no primary type (not enough evidence)", async () => {
    const h = makeHarness();
    const owner = guest("g-owner");
    const id = await completeFor(h, owner);
    const out = await loadLatestResult({
      resolvePrincipal: async () => owner,
      findLatestCompletedId: async () => id,
      getResult: async (p, i) => {
        const r = await h.service.getResult(p, i);
        return { ...r, report: { ...r.report, primaryType: null } };
      },
    });
    expect(out).toEqual({ status: "insufficient" });
  });
});
