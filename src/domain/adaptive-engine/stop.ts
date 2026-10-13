import type { Answer, AssessmentModule, EngineConfig, Question, StopDecision } from "@/domain/assessment/types";
import { compatibilityFromResolved } from "@/domain/scoring/compatibility";
import { functioningFromResolved } from "@/domain/scoring/functioning";
import { instinctsFromResolved } from "@/domain/scoring/instinct";
import { wingFromResolved } from "@/domain/scoring/wing";
import { analyze, eligibleQuestions, MODULE_ORDER, type EngineState } from "./state";

/**
 * Is the type ranking stable enough to stop asking type questions?
 *  1. gap(top1, top2) in relative share >= stabilityMargin, AND
 *  2. each of the top `candidateCount` types has >= minEvidencePerCandidate
 *     answers giving it some score, AND
 *  3. leave-one-out: removing ANY single answer, the same top1 still leads top2
 *     by at least ambiguityMargin. This is what guarantees the engine never
 *     stops because of one decisive answer.
 */
function typeIsStable(state: EngineState): boolean {
  const { ranking, config, resolved } = state;
  if (!state.hasTypeEvidence) return false;
  const [first, second] = ranking;
  if (first.share - second.share < config.stabilityMargin) return false;
  const finalists = ranking.slice(0, config.candidateCount);
  if (finalists.some((c) => c.evidenceCount < config.minEvidencePerCandidate)) return false;
  const typeAnswers = resolved.filter((r) => r.question.module === "type");
  for (let i = 0; i < typeAnswers.length; i++) {
    const without = compatibilityFromResolved(typeAnswers.filter((_, j) => j !== i));
    const a = without.find((c) => c.type === first.type)!;
    const b = without.find((c) => c.type === second.type)!;
    if (a.share - b.share < config.ambiguityMargin) return false;
  }
  return true;
}

function moduleDecided(state: EngineState, module: AssessmentModule): boolean {
  switch (module) {
    case "type":
      return typeIsStable(state);
    case "wing":
      return state.hasTypeEvidence && wingFromResolved(state.resolved, state.main).likelyWing !== null;
    case "instinct":
      return instinctsFromResolved(state.resolved).dominant !== null;
    case "functioning":
      return functioningFromResolved(state.resolved).decided;
  }
}

export function moduleDecision(state: EngineState, module: AssessmentModule): StopDecision {
  const { min, max } = state.config.limits[module];
  const count = state.counts[module];
  if (count >= max) return { stop: true, reason: "max-reached" };
  if (eligibleQuestions(state, module).length === 0) return { stop: true, reason: "bank-exhausted" };
  if (count < min) return { stop: false, reason: "min-not-reached" };
  if (moduleDecided(state, module)) return { stop: true, reason: "stable" };
  return { stop: false, reason: "continue" };
}

/**
 * Stop decision for one module (default: "type"). Order of checks:
 * max-reached, bank-exhausted, min-not-reached, stable, otherwise continue.
 */
export function shouldStop(
  bank: readonly Question[],
  answers: readonly Answer[],
  config: EngineConfig,
  module: AssessmentModule = "type",
): StopDecision {
  return moduleDecision(analyze(bank, answers, config), module);
}

/**
 * Whole-session decision: the decision of the first module that has not
 * stopped yet (so `stop` is false), or the last module's decision when every
 * module has stopped.
 */
export function sessionDecision(state: EngineState): StopDecision {
  let last: StopDecision = { stop: true, reason: "bank-exhausted" };
  for (const m of MODULE_ORDER) {
    last = moduleDecision(state, m);
    if (!last.stop) return last;
  }
  return last;
}
