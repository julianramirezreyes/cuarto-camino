import type { Answer, Compatibility, Question } from "@/domain/assessment/types";
import { ENNEAGRAM_TYPES, type EnneagramType } from "@/domain/enneagram/structure";
import { relativeShares, round9 } from "./params";
import { resolveAnswers, type ResolvedAnswer } from "./resolve";

/**
 * Compatibility of the respondent with each of the nine types, computed ONLY
 * from "type"-module questions.
 *
 *   raw_t   = sum over answers of question.weight * option.scores.types[t]
 *   share_t = relative share via shift-and-normalize (see params.relativeShares)
 *   evidenceCount_t = answers whose chosen option scores t > 0
 *
 * `share` is a relative compatibility index, NOT a calibrated probability.
 * Result is ranked: share desc, ties broken by lower type number.
 */
export function computeCompatibility(
  bank: readonly Question[],
  answers: readonly Answer[],
): Compatibility[] {
  return compatibilityFromResolved(resolveAnswers(bank, answers));
}

export function compatibilityFromResolved(resolved: readonly ResolvedAnswer[]): Compatibility[] {
  const raw = {} as Record<EnneagramType, number>;
  const evidence = {} as Record<EnneagramType, number>;
  for (const t of ENNEAGRAM_TYPES) {
    raw[t] = 0;
    evidence[t] = 0;
  }
  for (const { question, option } of resolved) {
    if (question.module !== "type") continue;
    for (const t of ENNEAGRAM_TYPES) {
      const s = option.scores.types?.[t] ?? 0;
      raw[t] += question.weight * s;
      if (s > 0) evidence[t] += 1;
    }
  }
  for (const t of ENNEAGRAM_TYPES) raw[t] = round9(raw[t]);
  const shares = relativeShares(ENNEAGRAM_TYPES, raw);
  return ENNEAGRAM_TYPES.map((type) => ({
    type,
    raw: raw[type],
    share: shares[type],
    evidenceCount: evidence[type],
  })).sort((a, b) => b.raw - a.raw || a.type - b.type);
}
