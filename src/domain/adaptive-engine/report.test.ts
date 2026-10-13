import { describe, expect, it } from "vitest";
import type { Answer, EngineConfig } from "@/domain/assessment/types";
import { MINI_BANK, makeQuestion, optionGiving, syntheticRespondent } from "@/tests/fixtures/mini-bank";
import { DEFAULT_ENGINE_CONFIG } from "./config";
import { buildReport } from "./report";
import { runAssessment } from "./session";

describe("DEFAULT_ENGINE_CONFIG", () => {
  it("has the documented parameters", () => {
    expect(DEFAULT_ENGINE_CONFIG.engineVersion).toBe("1.0.0");
    expect(DEFAULT_ENGINE_CONFIG.limits).toEqual({
      type: { min: 18, max: 28 },
      wing: { min: 4, max: 6 },
      instinct: { min: 6, max: 10 },
      functioning: { min: 8, max: 12 },
    });
    expect(DEFAULT_ENGINE_CONFIG.coverageQuestions).toBe(8);
    expect(DEFAULT_ENGINE_CONFIG.candidateCount).toBe(3);
  });
});

describe("buildReport", () => {
  const run = () => runAssessment(MINI_BANK, syntheticRespondent({ type: 3, wingTowardUpper: true, instinct: "sx", band: "intermediate", seed: 5 }), DEFAULT_ENGINE_CONFIG);

  it("is deterministic and carries the engine version", () => {
    const { answers } = run();
    const a = buildReport(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG);
    const b = buildReport(MINI_BANK, [...answers], DEFAULT_ENGINE_CONFIG);
    expect(a).toEqual(b);
    expect(a.engineVersion).toBe("1.0.0");
    const v2 = buildReport(MINI_BANK, answers, { ...DEFAULT_ENGINE_CONFIG, engineVersion: "9.9.9" });
    expect(v2.engineVersion).toBe("9.9.9");
  });

  it("ranks the nine types, exposes top-3 alternatives and module counts", () => {
    const { answers } = run();
    const r = buildReport(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG);
    expect(r.ranking).toHaveLength(9);
    expect(r.alternatives).toHaveLength(3);
    expect(r.alternatives.map((c) => c.type)).toEqual(r.ranking.slice(0, 3).map((c) => c.type));
    expect(r.primaryType).toBe(r.ranking[0].type);
    expect(r.moduleCounts.type + r.moduleCounts.wing + r.moduleCounts.instinct + r.moduleCounts.functioning).toBe(answers.length);
  });

  it("reports wing, only the dominant instinct and a band with uncertainty", () => {
    const { answers } = run();
    const r = buildReport(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG);
    expect(r.primaryType).toBe(3);
    expect(r.wing.likelyWing).toBe(4);
    expect(r.instinct.dominant).toBe("sx");
    expect(r.instinct.stackConfidence).toBe("dominant-only");
    expect(r.functioning.band).toBe("intermediate");
    expect(r.functioning.uncertainty).toBeGreaterThanOrEqual(0);
    expect(r.functioning.uncertainty).toBeLessThanOrEqual(1);
    expect(r).not.toHaveProperty("instinctStack");
  });

  it("empty answers: ambiguous, no primary type, no wing, no instinct", () => {
    const r = buildReport(MINI_BANK, [], DEFAULT_ENGINE_CONFIG);
    expect(r.ambiguous).toBe(true);
    expect(r.primaryType).toBeNull();
    expect(r.wing.likelyWing).toBeNull();
    expect(r.instinct.dominant).toBeNull();
    expect(r.functioning.band).toBeNull();
    expect(r.alternatives).toHaveLength(3);
    expect(r.explanation.length).toBeGreaterThan(0);
  });

  it("flags ambiguity using ambiguityMargin", () => {
    const bank = [
      makeQuestion({ id: "a", module: "type", options: [{ id: "a1", text: "", scores: { types: { 1: 3 } } }] }),
      makeQuestion({ id: "b", module: "type", options: [{ id: "b1", text: "", scores: { types: { 2: 3 } } }] }),
    ];
    const answers: Answer[] = [{ questionId: "a", optionId: "a1" }, { questionId: "b", optionId: "b1" }];
    expect(buildReport(bank, answers, DEFAULT_ENGINE_CONFIG).ambiguous).toBe(true);
    const clear = buildReport(bank, [answers[0]], { ...DEFAULT_ENGINE_CONFIG, ambiguityMargin: 0.01 });
    expect(clear.ambiguous).toBe(false);
  });

  it("surfaces inconsistencies", () => {
    const a = MINI_BANK.find((q) => q.id === "q-type-004")!;
    const b = MINI_BANK.find((q) => q.id === "q-type-013")!;
    const r = buildReport(
      MINI_BANK,
      [
        { questionId: a.id, optionId: a.options.find((o) => o.scores.types?.[6] === 3)!.id },
        { questionId: b.id, optionId: b.options.find((o) => o.scores.types?.[1] === 3)!.id },
      ],
      DEFAULT_ENGINE_CONFIG,
    );
    expect(r.inconsistencies).toHaveLength(1);
    expect(r.explanation.join(" ")).toMatch(/inconsistencia/i);
    expect(optionGiving(a, 6)).toBeDefined();
  });

  it("explanation is Spanish and states that shares are relative, not probabilities", () => {
    const { answers } = run();
    const text = buildReport(MINI_BANK, answers, DEFAULT_ENGINE_CONFIG).explanation.join("\n");
    expect(text).toMatch(/relativa/i);
    expect(text).toMatch(/no (es|son) (una )?probabilidad/i);
    expect(text).toMatch(/instinto/i);
  });

  it("handles an incomplete session and an exhausted bank", () => {
    const small = MINI_BANK.filter((q) => q.module === "type").slice(0, 5);
    const { answers, report } = runAssessment(small, syntheticRespondent({ type: 2, seed: 1 }), DEFAULT_ENGINE_CONFIG);
    expect(answers.length).toBeLessThanOrEqual(5);
    expect(report.moduleCounts.wing).toBe(0);
    expect(report.stop.reason).toBe("bank-exhausted");
    const partial = buildReport(MINI_BANK, answers.slice(0, 2), DEFAULT_ENGINE_CONFIG);
    expect(partial.stop.stop).toBe(false);
  });

  it("config limits can be overridden", () => {
    const config: EngineConfig = { ...DEFAULT_ENGINE_CONFIG, limits: { ...DEFAULT_ENGINE_CONFIG.limits, type: { min: 3, max: 4 } } };
    const { answers } = runAssessment(MINI_BANK, syntheticRespondent({ type: 1, seed: 1 }), config);
    expect(answers.filter((a) => a.questionId.startsWith("q-type")).length).toBe(4);
  });
});
