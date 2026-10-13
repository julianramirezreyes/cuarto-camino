import { describe, expect, it } from "vitest";
import type { Answer, EngineConfig, Question } from "@/domain/assessment/types";
import { MINI_BANK, makeQuestion } from "@/tests/fixtures/mini-bank";
import { DEFAULT_ENGINE_CONFIG } from "./config";
import { runAssessment } from "./session";
import { shouldStop } from "./stop";
import { syntheticRespondent } from "@/tests/fixtures/mini-bank";

const mk = (id: string, types: Record<number, number>, weight = 1): Question =>
  makeQuestion({ id, module: "type", weight, options: [{ id: `${id}-o`, text: "", scores: { types } }] });
const ans = (...ids: string[]): Answer[] => ids.map((id) => ({ questionId: id, optionId: `${id}-o` }));
const cfg = (type: { min: number; max: number }, over: Partial<EngineConfig> = {}): EngineConfig => ({
  ...DEFAULT_ENGINE_CONFIG,
  limits: { ...DEFAULT_ENGINE_CONFIG.limits, type },
  ...over,
});

describe("shouldStop (type module)", () => {
  it("min not reached => continue, even when one answer is decisive", () => {
    const bank = [mk("a", { 1: 100 }), mk("b", { 1: 1 }), mk("c", { 1: 1 }), mk("d", { 1: 1 })];
    expect(shouldStop(bank, ans("a"), cfg({ min: 3, max: 4 }))).toEqual({ stop: false, reason: "min-not-reached" });
  });

  it("does not stop after a single decisive answer even if min is 1 (needs evidence per candidate)", () => {
    const bank = [mk("a", { 1: 100 }), mk("b", { 2: 1 }), mk("c", { 3: 1 })];
    const d = shouldStop(bank, ans("a"), cfg({ min: 1, max: 3 }, { minEvidencePerCandidate: 3 }));
    expect(d.stop).toBe(false);
    expect(d.reason).toBe("continue");
  });

  it("does not stop when the lead depends on one single answer (leave-one-out)", () => {
    const bank = [mk("big", { 1: 3 }, 100), mk("b", { 2: 3 }), mk("c", { 3: 3 }), mk("d", { 4: 3 }), mk("e", { 5: 3 })];
    const d = shouldStop(bank, ans("big", "b", "c", "d"), cfg({ min: 3, max: 5 }, { minEvidencePerCandidate: 1, candidateCount: 2 }));
    expect(d).toEqual({ stop: false, reason: "continue" });
  });

  it("stops as stable with a robust lead and enough evidence", () => {
    const bank = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => mk(`q${i}`, { 1: 3, [(i % 3) + 2]: 1 }));
    bank.push(mk("x", { 5: 1 }));
    const d = shouldStop(bank, ans("q1", "q2", "q3", "q4", "q5", "q6"), cfg({ min: 4, max: 8 }, { minEvidencePerCandidate: 2 }));
    expect(d).toEqual({ stop: true, reason: "stable" });
  });

  it("stops at max", () => {
    const bank = [mk("a", { 1: 1 }), mk("b", { 2: 1 }), mk("c", { 3: 1 })];
    expect(shouldStop(bank, ans("a", "b"), cfg({ min: 1, max: 2 }))).toEqual({ stop: true, reason: "max-reached" });
  });

  it("stops when the bank is exhausted, even below min", () => {
    const bank = [mk("a", { 1: 1 })];
    expect(shouldStop(bank, ans("a"), cfg({ min: 5, max: 9 }))).toEqual({ stop: true, reason: "bank-exhausted" });
    expect(shouldStop([], [], cfg({ min: 5, max: 9 }))).toEqual({ stop: true, reason: "bank-exhausted" });
  });

  it("equivalence-group siblings do not count as available questions", () => {
    const a = { ...mk("a", { 1: 1 }), equivalenceGroup: "g" };
    const b = { ...mk("b", { 1: 1 }), equivalenceGroup: "g" };
    expect(shouldStop([a, b], ans("a"), cfg({ min: 2, max: 4 })).reason).toBe("bank-exhausted");
  });

  it("a full session on the mini bank never ends before the type minimum", () => {
    const { answers } = runAssessment(MINI_BANK, syntheticRespondent({ type: 5, seed: 2 }), DEFAULT_ENGINE_CONFIG);
    const typeAnswers = answers.filter((a) => MINI_BANK.find((q) => q.id === a.questionId)!.module === "type");
    expect(typeAnswers.length).toBeGreaterThanOrEqual(DEFAULT_ENGINE_CONFIG.limits.type.min);
  });
});
