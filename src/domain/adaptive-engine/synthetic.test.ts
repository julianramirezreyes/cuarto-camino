/**
 * SYNTHETIC STABILITY TESTS.
 * These simulate respondents that mechanically prefer the options of one type
 * on a synthetic bank. They check that the ENGINE ARITHMETIC converges and is
 * stable. They are NOT psychological validation and say nothing about the
 * validity or reliability of the real question bank or of the model itself.
 */
import { describe, expect, it } from "vitest";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import { MINI_BANK, syntheticRespondent } from "@/tests/fixtures/mini-bank";
import { DEFAULT_ENGINE_CONFIG } from "./config";
import { runAssessment } from "./session";

describe("synthetic stability (NOT psychological validation)", () => {
  for (const type of ENNEAGRAM_TYPES) {
    it(`synthetic respondent biased to type ${type} converges to ${type} (3 seeds, 10% noise)`, () => {
      for (const seed of [1, 2, 3]) {
        const { report } = runAssessment(MINI_BANK, syntheticRespondent({ type: type as EnneagramType, seed, noise: 0.1 }), DEFAULT_ENGINE_CONFIG);
        expect(report.primaryType).toBe(type);
        expect(report.ambiguous).toBe(false);
      }
    });
  }

  it("is reproducible: same respondent seed => identical answers and report", () => {
    const run = () => runAssessment(MINI_BANK, syntheticRespondent({ type: 7, seed: 42 }), DEFAULT_ENGINE_CONFIG);
    expect(run()).toEqual(run());
  });

  it("a fully random respondent does not crash and stays within limits", () => {
    const { answers, report } = runAssessment(MINI_BANK, syntheticRespondent({ type: 1, noise: 1, seed: 9 }), DEFAULT_ENGINE_CONFIG);
    expect(answers.length).toBeLessThanOrEqual(28 + 6 + 10 + 12);
    expect(report.ranking).toHaveLength(9);
  });
});
