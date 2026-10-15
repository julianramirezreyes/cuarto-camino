/**
 * Integration of the adaptive engine with the real draft question bank.
 * Synthetic respondents verify wiring and convergence ONLY. They are not
 * evidence of psychological validity or accuracy.
 */
import { describe, expect, it } from "vitest";
import type { Question } from "@/domain/assessment/types";
import { QUESTION_BANK } from "@/content/questions";
import { DEFAULT_ENGINE_CONFIG, runAssessment } from "@/domain/adaptive-engine";
import { ENNEAGRAM_TYPES, wingsOf } from "@/domain/enneagram/structure";
import { syntheticRespondent } from "./fixtures/mini-bank";

const SEEDS = [1, 2, 3];

/** The real bank scores all three instincts in every option, so pick the argmax. */
function respondent(opts: Parameters<typeof syntheticRespondent>[0]) {
  const base = syntheticRespondent(opts);
  return (q: Question) => {
    if (q.module !== "instinct") return base(q);
    const want = opts.instinct ?? "sp";
    return [...q.options].sort((a, b) => (b.scores.instincts?.[want] ?? 0) - (a.scores.instincts?.[want] ?? 0))[0].id;
  };
}

describe("engine + real bank (synthetic)", () => {
  for (const type of ENNEAGRAM_TYPES) {
    it(`converges for a respondent biased toward type ${type}`, () => {
      for (const seed of SEEDS) {
        const { answers, report } = runAssessment(
          QUESTION_BANK,
          respondent({ type, noise: 0.1, seed, instinct: "so", wingTowardUpper: true }),
          DEFAULT_ENGINE_CONFIG,
        );
        expect(report.primaryType, `type ${type} seed ${seed}`).toBe(type);
        expect(answers.length).toBeGreaterThanOrEqual(18);
        expect(answers.length).toBeLessThanOrEqual(DEFAULT_ENGINE_CONFIG.limits.type.max + 6 + 10 + 12);
        expect(report.instinct.dominant).toBe("so");
      }
    });
  }

  it("recovers the leaning wing in nearly every noisy run and almost never the opposite one", () => {
    const WING_SEEDS = Array.from({ length: 10 }, (_, i) => i + 1);
    let runs = 0;
    let recovered = 0;
    let opposite = 0;
    for (const type of ENNEAGRAM_TYPES) {
      for (const seed of WING_SEEDS) {
        const { report } = runAssessment(
          QUESTION_BANK,
          respondent({ type, noise: 0.1, seed, instinct: "so", wingTowardUpper: true }),
          DEFAULT_ENGINE_CONFIG,
        );
        runs += 1;
        const wing = report.wing.likelyWing;
        if (wing === wingsOf(type)[1]) recovered += 1;
        else if (wing !== null) opposite += 1;
      }
    }
    // A tie leaves the wing undecided (null); that is honest, so it is tolerated at a low rate.
    expect(recovered / runs).toBeGreaterThanOrEqual(0.95);
    expect(opposite / runs).toBeLessThanOrEqual(0.02);
  });

  it("never repeats an equivalence group within a session", () => {
    const { answers } = runAssessment(QUESTION_BANK, syntheticRespondent({ type: 4, seed: 7 }), DEFAULT_ENGINE_CONFIG);
    const groups = answers
      .map((a) => QUESTION_BANK.find((q) => q.id === a.questionId)?.equivalenceGroup)
      .filter(Boolean);
    expect(new Set(groups).size).toBe(groups.length);
  });

  it("is deterministic", () => {
    const run = () => runAssessment(QUESTION_BANK, syntheticRespondent({ type: 6, seed: 5 }), DEFAULT_ENGINE_CONFIG);
    expect(run().answers).toEqual(run().answers);
  });
});
