import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "@/content/questions";
import { AssessmentError } from "./errors";
import type { Principal } from "./service";
import { makeHarness, otherOption, respondent } from "./test-helpers";
import { ENGINE_VERSION } from "./versions";

const consent = { granted: true as const, policyVersion: "2026-01" };
const user = (userId: string): Principal => ({ kind: "user", userId });

async function rejectsWith(p: Promise<unknown>, code: string) {
  const err = await p.then(
    () => null,
    (e: unknown) => e,
  );
  expect(err).toBeInstanceOf(AssessmentError);
  expect((err as AssessmentError).code).toBe(code);
}

/** Answers every question until done; returns the number of answers given. */
async function runToEnd(h: ReturnType<typeof makeHarness>, p: Principal, id: string, first: { id: string } | null) {
  const pick = respondent(5, 1);
  let q = first;
  let n = 0;
  let lastDone = false;
  while (q) {
    const full = QUESTION_BANK.find((x) => x.id === q!.id)!;
    const r = await h.service.submitAnswer(p, id, q.id, pick(full));
    n++;
    lastDone = r.done;
    q = r.question;
  }
  return { n, lastDone };
}

describe("startOrResume", () => {
  it("creates an in_progress assessment with the first question and no scoring data", async () => {
    const h = makeHarness();
    const r = await h.service.startOrResume(user("u1"), consent);
    expect(r.resumed).toBe(false);
    expect(r.assessment.status).toBe("in_progress");
    expect(r.question).not.toBeNull();
    expect(r.progress).toMatchObject({ answered: 0, module: "type", moduleIndex: 0, moduleMin: 18, moduleMax: 28 });
    const json = JSON.stringify(r);
    for (const leaked of ["scores", "weight", "discrimination", "rationale", "references", "relatedTypes"]) {
      expect(json).not.toContain(leaked);
    }
    expect(h.repo.consents).toEqual([{ userId: "u1", guestSessionId: null, policyVersion: "2026-01" }]);
  });

  it("requires consent", async () => {
    const h = makeHarness();
    await rejectsWith(h.service.startOrResume(user("u1"), { granted: false as unknown as true, policyVersion: "x" }), "consent_required");
  });

  it("resumes the open assessment instead of creating another (also when paused)", async () => {
    const h = makeHarness();
    const a = await h.service.startOrResume(user("u1"), consent);
    await h.service.pause(user("u1"), a.assessment.id);
    const b = await h.service.startOrResume(user("u1"), consent);
    expect(b.resumed).toBe(true);
    expect(b.assessment).toEqual({ id: a.assessment.id, status: "in_progress" });
    expect(b.question?.id).toBe(a.question?.id);
    expect(h.repo.assessments.size).toBe(1);
  });
});

describe("full flow with the real bank", () => {
  it("start -> answers -> done -> result", async () => {
    const h = makeHarness();
    const p = user("u1");
    const start = await h.service.startOrResume(p, consent);
    const id = start.assessment.id;
    await rejectsWith(h.service.getResult(p, id), "not_complete");

    const { n, lastDone } = await runToEnd(h, p, id, start.question);
    expect(lastDone).toBe(true);
    expect(n).toBeGreaterThanOrEqual(30);
    expect(n).toBeLessThanOrEqual(56);

    const res = await h.service.getResult(p, id);
    expect(res.report.primaryType).toBe(5);
    expect(res.engineVersion).toBe(ENGINE_VERSION);
    expect(res.bankVersion).toBe("1.1.0-draft");
    expect(res.completedAt).toBeInstanceOf(Date);
    expect(h.repo.assessments.get(id)?.status).toBe("completed");
    await rejectsWith(h.service.getCurrent(p), "not_found");
  });

  it("a completed assessment cannot be modified and its result is never recomputed", async () => {
    const h = makeHarness();
    const p = user("u1");
    const start = await h.service.startOrResume(p, consent);
    const id = start.assessment.id;
    await runToEnd(h, p, id, start.question);
    const before = await h.service.getResult(p, id);
    const [first] = await h.repo.listAnswers(id);
    await rejectsWith(h.service.submitAnswer(p, id, first.questionId, otherOption(first.questionId, first.optionId)), "already_completed");
    await rejectsWith(h.service.goBack(p, id), "already_completed");
    const after = await h.service.getResult(p, id);
    expect(after.report).toEqual(before.report);
    expect(h.repo.results.get(id)).toHaveLength(1);
  });

  it("derives the report only from answers on the path", async () => {
    const h = makeHarness();
    const p = user("u1");
    const start = await h.service.startOrResume(p, consent);
    await runToEnd(h, p, start.assessment.id, start.question);
    const res = await h.service.getResult(p, start.assessment.id);
    const stored = await h.repo.listAnswers(start.assessment.id);
    const counted = Object.values(res.report.moduleCounts).reduce((a, b) => a + b, 0);
    expect(counted).toBe(stored.length);
  });
});

describe("pause and resume", () => {
  it("pause -> getCurrent still returns it -> answering resumes it", async () => {
    const h = makeHarness();
    const p = user("u1");
    const start = await h.service.startOrResume(p, consent);
    const id = start.assessment.id;
    const q1 = start.question!;
    const a1 = await h.service.submitAnswer(p, id, q1.id, q1.options[0].id);
    expect(await h.service.pause(p, id)).toEqual({ status: "paused" });
    const cur = await h.service.getCurrent(p);
    expect(cur.assessment.status).toBe("paused");
    expect(cur.question?.id).toBe(a1.question?.id);
    expect(cur.progress.answered).toBe(1);
    const a2 = await h.service.submitAnswer(p, id, cur.question!.id, cur.question!.options[0].id);
    expect(a2.done).toBe(false);
    expect(h.repo.assessments.get(id)?.status).toBe("in_progress");
  });
});

describe("answer validation", () => {
  it("rejects unknown question or option (invalid_answer)", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    await rejectsWith(h.service.submitAnswer(p, s.assessment.id, "q-nope", "opt-a"), "invalid_answer");
    await rejectsWith(h.service.submitAnswer(p, s.assessment.id, s.question!.id, "opt-nope"), "invalid_answer");
  });

  it("only the offered question or an already answered one may be answered", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    const offered = s.question!.id;
    const other = QUESTION_BANK.find((q) => q.id !== offered && q.module === "type")!;
    await rejectsWith(h.service.submitAnswer(p, s.assessment.id, other.id, other.options[0].id), "question_not_available");
    expect(await h.repo.listAnswers(s.assessment.id)).toEqual([]);
  });

  it("replaces a previous answer to the same question (no duplicates)", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    const id = s.assessment.id;
    const q = s.question!;
    await h.service.submitAnswer(p, id, q.id, q.options[0].id);
    await h.service.submitAnswer(p, id, q.id, q.options[1].id);
    expect(await h.repo.listAnswers(id)).toEqual([{ questionId: q.id, optionId: q.options[1].id }]);
  });

  it("refuses answers when the assessment was made with another bank or engine version", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    h.repo.assessments.get(s.assessment.id)!.bankVersion = "0.9.0";
    await rejectsWith(h.service.submitAnswer(p, s.assessment.id, s.question!.id, s.question!.options[0].id), "version_mismatch");
  });
});

describe("assessments left open by an older bank version", () => {
  it("do not break the entry screen: there is simply no current evaluation, and a fresh one can start", async () => {
    const h = makeHarness();
    const p = user("u1");
    const old = await h.service.startOrResume(p, consent);
    const stale = h.repo.assessments.get(old.assessment.id)!;
    stale.bankVersion = "0.9.0";
    stale.startedAt = new Date("2020-01-01T00:00:00Z"); // it was started long before the bank changed
    await rejectsWith(h.service.getCurrent(p), "not_found");
    const fresh = await h.service.startOrResume(p, consent);
    expect(fresh.assessment.id).not.toBe(old.assessment.id);
    expect(fresh.resumed).toBe(false);
    // and the new one is what the user now continues
    expect((await h.service.getCurrent(p)).assessment.id).toBe(fresh.assessment.id);
  });

  it("still refuses to answer or go back inside the old assessment (answers are never reinterpreted)", async () => {
    const h = makeHarness();
    const p = user("u1");
    const old = await h.service.startOrResume(p, consent);
    h.repo.assessments.get(old.assessment.id)!.engineVersion = "0.0.1";
    await rejectsWith(h.service.submitAnswer(p, old.assessment.id, old.question!.id, old.question!.options[0].id), "version_mismatch");
  });
});

describe("goBack", () => {
  it("returns the previous question with its selected option and deletes nothing", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    const id = s.assessment.id;
    const q1 = s.question!;
    const r1 = await h.service.submitAnswer(p, id, q1.id, q1.options[2].id);
    const r2 = await h.service.submitAnswer(p, id, r1.question!.id, r1.question!.options[1].id);
    const back = await h.service.goBack(p, id);
    expect(back.question.id).toBe(r1.question!.id);
    expect(back.question.selectedOptionId).toBe(r1.question!.options[1].id);
    expect(back.progress.answered).toBe(2);
    expect(await h.repo.listAnswers(id)).toHaveLength(2);
    // walk back one more step from the question being shown
    const back2 = await h.service.goBack(p, id, back.question.id);
    expect(back2.question.id).toBe(q1.id);
    expect(back2.question.selectedOptionId).toBe(q1.options[2].id);
    expect(back2.progress.moduleIndex).toBe(0);
    await rejectsWith(h.service.goBack(p, id, q1.id), "no_previous");
    // current question is unchanged by going back
    expect((await h.service.getCurrent(p)).question?.id).toBe(r2.question!.id);
  });

  it("no_previous at the very start; unknown fromQuestionId is not available", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    await rejectsWith(h.service.goBack(p, s.assessment.id), "no_previous");
    await rejectsWith(h.service.goBack(p, s.assessment.id, "q-nope"), "question_not_available");
  });

  it("changing an earlier answer re-derives the path; restoring it brings the old answers back", async () => {
    const h = makeHarness();
    const p = user("u1");
    const pick = respondent(5, 1);
    const s = await h.service.startOrResume(p, consent);
    const id = s.assessment.id;
    let q = s.question;
    for (let i = 0; i < 12 && q; i++) {
      const full = QUESTION_BANK.find((x) => x.id === q!.id)!;
      q = (await h.service.submitAnswer(p, id, q.id, pick(full))).question;
    }
    const before = await h.service.getCurrent(p);
    const storedBefore = await h.repo.listAnswers(id);
    expect(storedBefore).toHaveLength(12);

    // Flip an early decisive answer to something else: path may change, nothing is deleted.
    const early = storedBefore[1];
    const flipped = otherOption(early.questionId, early.optionId);
    await h.service.submitAnswer(p, id, early.questionId, flipped);
    expect(await h.repo.listAnswers(id)).toHaveLength(12);
    const mid = await h.service.getCurrent(p);
    expect(mid.progress.answered).toBeLessThanOrEqual(12);

    // Restore: the original path (and its 12 answers) is back, same current question.
    await h.service.submitAnswer(p, id, early.questionId, early.optionId);
    const restored = await h.service.getCurrent(p);
    expect(restored.question?.id).toBe(before.question?.id);
    expect(restored.progress.answered).toBe(before.progress.answered);
  });

  it("orphan answers (stored but off the path) are not answerable and not scored", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    const id = s.assessment.id;
    const orphan = QUESTION_BANK.find((q) => q.module === "functioning")!;
    await h.repo.upsertAnswer(id, { questionId: orphan.id, optionId: orphan.options[0].id });
    const cur = await h.service.getCurrent(p);
    expect(cur.question?.id).toBe(s.question!.id);
    expect(cur.progress.answered).toBe(0);
    await rejectsWith(h.service.submitAnswer(p, id, orphan.id, orphan.options[1].id), "question_not_available");
    await rejectsWith(h.service.goBack(p, id, orphan.id), "question_not_available");
  });
});

describe("authorization (foreign ids are not found)", () => {
  it("another user, a guest and an anonymous-looking id all get not_found everywhere", async () => {
    const h = makeHarness();
    const owner = user("u1");
    const s = await h.service.startOrResume(owner, consent);
    const id = s.assessment.id;
    const q = s.question!;
    const guest: Principal = { kind: "guest", guestSessionId: "g-1" };
    for (const intruder of [user("u2"), guest]) {
      await rejectsWith(h.service.submitAnswer(intruder, id, q.id, q.options[0].id), "not_found");
      await rejectsWith(h.service.goBack(intruder, id), "not_found");
      await rejectsWith(h.service.pause(intruder, id), "not_found");
      await rejectsWith(h.service.getResult(intruder, id), "not_found");
      await rejectsWith(h.service.deleteAssessment(intruder, id), "not_found");
      await rejectsWith(h.service.getCurrent(intruder), "not_found");
    }
    await rejectsWith(h.service.pause(owner, "00000000-0000-4000-8000-000000000000"), "not_found");
    expect(await h.repo.listAnswers(id)).toEqual([]);
    expect(h.repo.assessments.get(id)?.status).toBe("in_progress");
  });

  it("a guest only reaches its own guest-owned assessment", async () => {
    const h = makeHarness();
    const g1: Principal = { kind: "guest", guestSessionId: "g-1" };
    const g2: Principal = { kind: "guest", guestSessionId: "g-2" };
    const s = await h.service.startOrResume(g1, consent);
    expect((await h.service.getCurrent(g1)).assessment.id).toBe(s.assessment.id);
    await rejectsWith(h.service.getCurrent(g2), "not_found");
    await rejectsWith(h.service.pause(g2, s.assessment.id), "not_found");
  });
});

describe("deleteAssessment", () => {
  it("soft deletes: nothing is reachable afterwards, the row is kept for the purge job", async () => {
    const h = makeHarness();
    const p = user("u1");
    const s = await h.service.startOrResume(p, consent);
    const id = s.assessment.id;
    await h.service.deleteAssessment(p, id);
    expect(h.repo.assessments.get(id)?.deletedAt).toBeInstanceOf(Date);
    await rejectsWith(h.service.getCurrent(p), "not_found");
    await rejectsWith(h.service.pause(p, id), "not_found");
    await rejectsWith(h.service.getResult(p, id), "not_found");
    await rejectsWith(h.service.deleteAssessment(p, id), "not_found");
    const fresh = await h.service.startOrResume(p, consent);
    expect(fresh.resumed).toBe(false);
    expect(fresh.assessment.id).not.toBe(id);
  });
});
