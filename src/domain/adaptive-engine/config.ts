import type { EngineConfig } from "@/domain/assessment/types";

/**
 * Default engine configuration.
 *
 * - limits: per-module question budget. A module never ends before `min`
 *   (unless the bank is exhausted) and never exceeds `max`.
 * - coverageQuestions: broad questions asked before discrimination starts.
 * - candidateCount: top types considered when picking a discriminating question
 *   and when checking that each finalist has enough evidence.
 * - stabilityMargin: required gap in relative share between the first and
 *   second type (and, leave-one-out, after removing any single answer the gap
 *   must still reach ambiguityMargin).
 * - minEvidencePerCandidate: each of the top `candidateCount` types needs at
 *   least this many answers that give it some score.
 * - ambiguityMargin: below this gap the final result is declared ambiguous.
 *
 * All values are design hypotheses, not calibrated against real data.
 */
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  engineVersion: "1.0.0",
  limits: {
    type: { min: 18, max: 28 },
    wing: { min: 4, max: 6 },
    instinct: { min: 6, max: 10 },
    functioning: { min: 8, max: 12 },
  },
  coverageQuestions: 8,
  candidateCount: 3,
  stabilityMargin: 0.12,
  minEvidencePerCandidate: 3,
  ambiguityMargin: 0.05,
};
