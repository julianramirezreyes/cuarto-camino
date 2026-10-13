import { describe, expect, it } from "vitest";
import type { Answer, AssessmentModule, EngineConfig, Question } from "@/domain/assessment/types";
import { MINI_BANK, makeQuestion, syntheticRespondent } from "@/tests/fixtures/mini-bank";
import { DEFAULT_ENGINE_CONFIG } from "./config";
import { runAssessment } from "./session";
import { selectNextQuestion } from "./selector";

const ORDER: AssessmentModule[] = ["type", "wing", "instinct", "functioning"];
const cfg = (over: Partial<EngineConfig> = {}): EngineConfig => ({ ...DEFAULT_ENGINE_CONFIG, ...over });

function fullRun(type = 4, seed = 7) {
  return runAssessment(MINI_BANK, syntheticRespondent({ type: type as 4, seed }), DEFAULT_ENGINE_CONFIG);
}

describe("selectNextQuestion", () => {
  it("starts with an active type question", () => {
    const q = selectNextQuestion(MINI_BANK, [], DEFAULT_ENGINE_CONFIG)!;
    expect(q.module).toBe("type");
    expect(q.active).toBe(true);
  });

  it("is deterministic", () => {
    expect(selectNextQuestion(MINI_BANK, [], DEFAULT_ENGINE_CONFIG)).toEqual(
      selectNextQuestion(MINI_BANK, [], DEFAULT_ENGINE_CONFIG),
    );
  });

  it("coverage phase prefers questions that raise evidence for unevidenced types", () => {
    const first = selectNextQuestion(MINI_BANK, [], DEFAULT_ENGINE_CONFIG)!;
    const answers: Answer[] = [{ questionId: first.id, optionId: first.options[0].id }];
    const second = selectNextQuestion(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG)!;
    const firstTypes = new Set(first.options.flatMap((o) => Object.keys(o.scores.types ?? {})));
    const newTypes = second.options.flatMap((o) => Object.keys(o.scores.types ?? {})).filter((t) => !firstTypes.has(t));
    expect(newTypes.length).toBeGreaterThan(0);
  });

  it("discrimination phase picks the question that separates the top candidates", () => {
    const mk = (id: string, scores: Record<string, Record<number, number>>, discrimination = 0.8) =>
      makeQuestion({
        id,
        module: "type",
        discrimination,
        options: Object.entries(scores).map(([oid, types]) => ({ id: `${id}-${oid}`, text: "", scores: { types } })),
      });
    const bank = [
      mk("seed", { a: { 1: 3 }, b: { 2: 2 } }),
      mk("irrelevant", { a: { 7: 3 }, b: { 8: 3 } }),
      mk("separates", { a: { 1: 3 }, b: { 2: 3 } }),
    ];
    const config = cfg({ coverageQuestions: 1, candidateCount: 2, limits: { ...DEFAULT_ENGINE_CONFIG.limits, type: { min: 1, max: 5 } } });
    const q = selectNextQuestion(bank, [{ questionId: "seed", optionId: "seed-a" }], config)!;
    expect(q.id).toBe("separates");
  });

  it("never asks two questions of the same equivalence group nor repeats a question", () => {
    const { answers } = fullRun();
    const ids = answers.map((a) => a.questionId);
    expect(new Set(ids).size).toBe(ids.length);
    const groups = ids.map((id) => MINI_BANK.find((q) => q.id === id)!.equivalenceGroup).filter(Boolean);
    expect(new Set(groups).size).toBe(groups.length);
  });

  it("follows module order type -> wing -> instinct -> functioning", () => {
    const { answers } = fullRun();
    const idx = answers.map((a) => ORDER.indexOf(MINI_BANK.find((q) => q.id === a.questionId)!.module));
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
    expect(new Set(idx).size).toBe(4);
  });

  it("respects per-module max limits", () => {
    const { answers } = fullRun();
    for (const m of ORDER) {
      const n = answers.filter((a) => MINI_BANK.find((q) => q.id === a.questionId)!.module === m).length;
      expect(n).toBeLessThanOrEqual(DEFAULT_ENGINE_CONFIG.limits[m].max);
      expect(n).toBeGreaterThan(0);
    }
  });

  it("skips inactive questions", () => {
    const bank = MINI_BANK.map((q) => (q.module === "type" ? { ...q, active: false } : q));
    const q = selectNextQuestion(bank, [], DEFAULT_ENGINE_CONFIG)!;
    expect(q.module).not.toBe("type");
  });

  it("returns null when the bank is empty or exhausted", () => {
    expect(selectNextQuestion([], [], DEFAULT_ENGINE_CONFIG)).toBeNull();
    const bank: Question[] = [
      makeQuestion({ id: "only", module: "type", options: [{ id: "o", text: "", scores: { types: { 1: 1 } } }] }),
    ];
    expect(selectNextQuestion(bank, [{ questionId: "only", optionId: "o" }], DEFAULT_ENGINE_CONFIG)).toBeNull();
  });

  it("resume: replaying stored answers reproduces the same next question", () => {
    const { answers } = fullRun(6, 3);
    for (let k = 0; k < answers.length; k++) {
      const replay = selectNextQuestion(MINI_BANK, answers.slice(0, k), DEFAULT_ENGINE_CONFIG);
      expect(replay?.id).toBe(answers[k].questionId);
    }
    expect(selectNextQuestion(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG)).toBeNull();
  });

  it("resume does not depend on the storage order of answers", () => {
    const { answers } = fullRun(2, 11);
    const part = answers.slice(0, 12);
    expect(selectNextQuestion(MINI_BANK, [...part].reverse(), DEFAULT_ENGINE_CONFIG)?.id).toBe(answers[12].questionId);
  });

  it("a changed answer replaces the previous one when choosing the next question", () => {
    const first = selectNextQuestion(MINI_BANK, [], DEFAULT_ENGINE_CONFIG)!;
    const a: Answer[] = [
      { questionId: first.id, optionId: first.options[0].id },
      { questionId: first.id, optionId: first.options[1].id },
    ];
    const b: Answer[] = [{ questionId: first.id, optionId: first.options[1].id }];
    expect(selectNextQuestion(MINI_BANK, a, DEFAULT_ENGINE_CONFIG)).toEqual(selectNextQuestion(MINI_BANK, b, DEFAULT_ENGINE_CONFIG));
  });
});
