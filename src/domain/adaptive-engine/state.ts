import type { Answer, AssessmentModule, Compatibility, EngineConfig, Question } from "@/domain/assessment/types";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { compatibilityFromResolved } from "@/domain/scoring/compatibility";
import { resolveAnswers, type ResolvedAnswer } from "@/domain/scoring/resolve";
import { questionServesMain } from "@/domain/scoring/wing";

export const MODULE_ORDER: readonly AssessmentModule[] = ["type", "wing", "instinct", "functioning"];

export interface EngineState {
  bank: readonly Question[];
  config: EngineConfig;
  resolved: ResolvedAnswer[];
  counts: Record<AssessmentModule, number>;
  answeredIds: Set<string>;
  answeredGroups: Set<string>;
  ranking: Compatibility[];
  /** True when at least one answered type question gave some evidence. */
  hasTypeEvidence: boolean;
  /** Top-ranked type (ties: lower number). Only meaningful with evidence. */
  main: EnneagramType;
}

export function analyze(bank: readonly Question[], answers: readonly Answer[], config: EngineConfig): EngineState {
  const resolved = resolveAnswers(bank, answers);
  const counts: Record<AssessmentModule, number> = { type: 0, wing: 0, instinct: 0, functioning: 0 };
  const answeredIds = new Set<string>();
  const answeredGroups = new Set<string>();
  for (const { question } of resolved) {
    counts[question.module] += 1;
    answeredIds.add(question.id);
    if (question.equivalenceGroup) answeredGroups.add(question.equivalenceGroup);
  }
  const ranking = compatibilityFromResolved(resolved);
  return {
    bank,
    config,
    resolved,
    counts,
    answeredIds,
    answeredGroups,
    ranking,
    hasTypeEvidence: ranking.some((c) => c.evidenceCount > 0),
    main: ranking[0].type,
  };
}

/** Unanswered, active questions of a module that may still be asked. */
export function eligibleQuestions(state: EngineState, module: AssessmentModule): Question[] {
  return state.bank.filter((q) => {
    if (!q.active || q.module !== module) return false;
    if (state.answeredIds.has(q.id)) return false;
    if (q.equivalenceGroup && state.answeredGroups.has(q.equivalenceGroup)) return false;
    if (module === "wing" && !questionServesMain(q, state.main)) return false;
    return true;
  });
}
