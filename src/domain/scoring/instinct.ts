import type { Answer, Question } from "@/domain/assessment/types";
import { INSTINCTS, type Instinct } from "@/domain/enneagram/structure";
import { INSTINCT_MARGIN, relativeShares, round9 } from "./params";
import { resolveAnswers, type ResolvedAnswer } from "./resolve";

export interface InstinctResult {
  raw: Record<Instinct, number>;
  /** Relative shares (not probabilities). */
  shares: Record<Instinct, number>;
  /** Dominant instinct, or null when evidence is absent or too balanced. */
  dominant: Instinct | null;
  /** top share - second share. */
  margin: number;
  evidenceCount: number;
  /**
   * Always "dominant-only": the engine does not claim an ordered stack
   * (2nd/3rd instinct) because a handful of questions cannot support it.
   */
  stackConfidence: "dominant-only";
}

export function computeInstincts(bank: readonly Question[], answers: readonly Answer[]): InstinctResult {
  return instinctsFromResolved(resolveAnswers(bank, answers));
}

export function instinctsFromResolved(resolved: readonly ResolvedAnswer[]): InstinctResult {
  const raw = { sp: 0, so: 0, sx: 0 } as Record<Instinct, number>;
  let evidenceCount = 0;
  for (const { question, option } of resolved) {
    if (question.module !== "instinct") continue;
    let any = false;
    for (const i of INSTINCTS) {
      const s = option.scores.instincts?.[i] ?? 0;
      raw[i] += question.weight * s;
      if (s > 0) any = true;
    }
    if (any) evidenceCount += 1;
  }
  for (const i of INSTINCTS) raw[i] = round9(raw[i]);
  const shares = relativeShares(INSTINCTS, raw);
  const ranked = [...INSTINCTS].sort((a, b) => raw[b] - raw[a] || INSTINCTS.indexOf(a) - INSTINCTS.indexOf(b));
  const margin = shares[ranked[0]] - shares[ranked[1]];
  const dominant = evidenceCount > 0 && margin >= INSTINCT_MARGIN ? ranked[0] : null;
  return { raw, shares, dominant, margin, evidenceCount, stackConfidence: "dominant-only" };
}
