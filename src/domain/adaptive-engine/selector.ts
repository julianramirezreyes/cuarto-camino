import type { Answer, AssessmentModule, EngineConfig, Question } from "@/domain/assessment/types";
import { ENNEAGRAM_TYPES, INSTINCTS, type EnneagramType } from "@/domain/enneagram/structure";
import { BANDS } from "@/domain/scoring/functioning";
import { instinctsFromResolved } from "@/domain/scoring/instinct";
import { functioningFromResolved } from "@/domain/scoring/functioning";
import { wingFromResolved } from "@/domain/scoring/wing";
import { analyze, eligibleQuestions, MODULE_ORDER, type EngineState } from "./state";
import { moduleDecision } from "./stop";

export type QuestionPhase = "coverage" | "discrimination" | "wing" | "instinct" | "functioning";

export interface NextStep {
  question: Question;
  module: AssessmentModule;
  phase: QuestionPhase;
}

const EPS = 1e-12;

/** Lexicographic argmax; the first item wins ties (bank order => deterministic). */
function pickBest<T>(items: readonly T[], keys: (item: T) => number[]): T {
  let best = items[0];
  let bestKeys = keys(best);
  for (let i = 1; i < items.length; i++) {
    const k = keys(items[i]);
    for (let j = 0; j < k.length; j++) {
      if (k[j] > bestKeys[j] + EPS) {
        best = items[i];
        bestKeys = k;
        break;
      }
      if (k[j] < bestKeys[j] - EPS) break;
    }
  }
  return best;
}

const typesTouched = (q: Question): Set<EnneagramType> => {
  const s = new Set<EnneagramType>();
  for (const o of q.options)
    for (const t of ENNEAGRAM_TYPES) if ((o.scores.types?.[t] ?? 0) > 0) s.add(t);
  return s;
};

/** Coverage value = weight * sum over touched types of 1 / (1 + current evidence). */
function coverageValue(q: Question, evidence: Map<EnneagramType, number>): number {
  let v = 0;
  for (const t of typesTouched(q)) v += 1 / (1 + (evidence.get(t) ?? 0));
  return q.weight * v;
}

/** Mean over options of (max - min) of the given scores among `keys`. */
function meanRange<K>(q: Question, keys: readonly K[], score: (o: Question["options"][number], k: K) => number): number {
  if (q.options.length === 0 || keys.length < 2) return 0;
  let total = 0;
  for (const o of q.options) {
    const vals = keys.map((k) => score(o, k));
    total += Math.max(...vals) - Math.min(...vals);
  }
  return total / q.options.length;
}

function pickType(state: EngineState, pool: Question[]): NextStep {
  const evidence = new Map(state.ranking.map((c) => [c.type, c.evidenceCount] as const));
  if (state.counts.type < state.config.coverageQuestions) {
    const question = pickBest(pool, (q) => [coverageValue(q, evidence)]);
    return { question, module: "type", phase: "coverage" };
  }
  const candidates = state.ranking.slice(0, state.config.candidateCount).map((c) => c.type);
  const question = pickBest(pool, (q) => {
    const spread = meanRange(q, candidates, (o, t) => o.scores.types?.[t] ?? 0);
    const touched = typesTouched(q);
    const needy = candidates.filter(
      (t) => (evidence.get(t) ?? 0) < state.config.minEvidencePerCandidate && touched.has(t),
    ).length;
    const value = q.discrimination * q.weight * spread * (1 + 0.25 * needy);
    return [value, coverageValue(q, evidence)];
  });
  return { question, module: "type", phase: "discrimination" };
}

function pickByTopTwo<K extends string>(pool: Question[], ranked: readonly K[], score: (q: Question["options"][number], k: K) => number): Question {
  const top = ranked.slice(0, 2);
  return pickBest(pool, (q) => [q.discrimination * q.weight * meanRange(q, top, score)]);
}

function pickWing(state: EngineState, pool: Question[]): NextStep {
  const w = wingFromResolved(state.resolved, state.main);
  const question = pickBest(pool, (q) => [
    q.discrimination * q.weight * meanRange(q, w.wings, (o, t) => o.scores.types?.[t] ?? 0),
  ]);
  return { question, module: "wing", phase: "wing" };
}

function pickInstinct(state: EngineState, pool: Question[]): NextStep {
  const r = instinctsFromResolved(state.resolved);
  const ranked = [...INSTINCTS].sort((a, b) => r.raw[b] - r.raw[a] || INSTINCTS.indexOf(a) - INSTINCTS.indexOf(b));
  return { question: pickByTopTwo(pool, ranked, (o, i) => o.scores.instincts?.[i] ?? 0), module: "instinct", phase: "instinct" };
}

function pickFunctioning(state: EngineState, pool: Question[]): NextStep {
  const r = functioningFromResolved(state.resolved);
  const ranked = [...BANDS].sort((a, b) => r.raw[b] - r.raw[a] || BANDS.indexOf(a) - BANDS.indexOf(b));
  return { question: pickByTopTwo(pool, ranked, (o, b) => o.scores.bands?.[b] ?? 0), module: "functioning", phase: "functioning" };
}

/**
 * Plans the next step: modules are visited in order type -> wing -> instinct ->
 * functioning; a module is left when its stop decision says so (max reached,
 * bank exhausted, or min reached and stable). Returns null when every module
 * has stopped.
 */
export function planNext(bank: readonly Question[], answers: readonly Answer[], config: EngineConfig): NextStep | null {
  const state = analyze(bank, answers, config);
  for (const module of MODULE_ORDER) {
    if (moduleDecision(state, module).stop) continue;
    const pool = eligibleQuestions(state, module);
    switch (module) {
      case "type":
        return pickType(state, pool);
      case "wing":
        return pickWing(state, pool);
      case "instinct":
        return pickInstinct(state, pool);
      case "functioning":
        return pickFunctioning(state, pool);
    }
  }
  return null;
}

/** Next question to ask, or null when the assessment is complete. */
export function selectNextQuestion(bank: readonly Question[], answers: readonly Answer[], config: EngineConfig): Question | null {
  return planNext(bank, answers, config)?.question ?? null;
}
