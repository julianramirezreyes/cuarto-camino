import type { Answer, Question } from "@/domain/assessment/types";
import { wingsOf, type EnneagramType } from "@/domain/enneagram/structure";
import { WING_EVIDENCE_PRIOR, WING_MARGIN, round9 } from "./params";
import { resolveAnswers, type ResolvedAnswer } from "./resolve";

export interface WingResult {
  main: EnneagramType;
  /** [lower neighbour, upper neighbour]. */
  wings: [EnneagramType, EnneagramType];
  /** Weighted evidence toward [lower, upper]. */
  scores: [number, number];
  /** Relative shares of the two neighbours (0.5/0.5 without evidence). */
  shares: [number, number];
  /**
   * |upper - lower| / (upper + lower), shrunk by the amount of evidence: margin * n / (n + prior).
   * 0 without evidence. Heuristic, not a calibrated probability.
   */
  confidence: number;
  /** Winning neighbour, or null when evidence is absent or too balanced. */
  likelyWing: EnneagramType | null;
  evidenceCount: number;
}

/**
 * A wing question serves a main type when, across its options, it scores BOTH
 * neighbours of that type. This keeps questions written for other mains from
 * leaking into this main's wing estimate.
 */
export function questionServesMain(question: Question, main: EnneagramType): boolean {
  if (question.module !== "wing") return false;
  const [lo, hi] = wingsOf(main);
  const scored = new Set<number>();
  for (const o of question.options) {
    for (const [t, s] of Object.entries(o.scores.types ?? {})) if ((s ?? 0) > 0) scored.add(Number(t));
  }
  return scored.has(lo) && scored.has(hi);
}

export function computeWing(
  bank: readonly Question[],
  answers: readonly Answer[],
  main: EnneagramType,
): WingResult {
  return wingFromResolved(resolveAnswers(bank, answers), main);
}

export function wingFromResolved(resolved: readonly ResolvedAnswer[], main: EnneagramType): WingResult {
  const [lo, hi] = wingsOf(main);
  let sLo = 0;
  let sHi = 0;
  let evidenceCount = 0;
  for (const { question, option } of resolved) {
    if (!questionServesMain(question, main)) continue;
    const a = option.scores.types?.[lo] ?? 0;
    const b = option.scores.types?.[hi] ?? 0;
    sLo += question.weight * a;
    sHi += question.weight * b;
    if (a > 0 || b > 0) evidenceCount += 1;
  }
  sLo = round9(sLo);
  sHi = round9(sHi);
  const total = sLo + sHi;
  const margin = total > 0 ? Math.abs(sHi - sLo) / total : 0;
  const confidence = margin * (evidenceCount / (evidenceCount + WING_EVIDENCE_PRIOR));
  const shares: [number, number] = total > 0 ? [sLo / total, sHi / total] : [0.5, 0.5];
  // Naming a wing depends on the raw margin; `confidence` only tells how much to trust it.
  const likelyWing = total > 0 && margin >= WING_MARGIN ? (sHi > sLo ? hi : lo) : null;
  return { main, wings: [lo, hi], scores: [sLo, sHi], shares, confidence, likelyWing, evidenceCount };
}

/**
 * Shares to SHOW for the two wings. The raw split ignores how many answers produced it (three unanimous answers
 * give 90/10), so it is pulled toward 50/50 with the same prior used for `confidence`, and rounded to whole
 * percentages that add up to 100. Works on already stored reports, which only carry `shares` and `evidenceCount`.
 */
export function shrunkWingShares(shares: readonly [number, number], evidenceCount: number): [number, number] {
  const factor = evidenceCount / (evidenceCount + WING_EVIDENCE_PRIOR);
  const second = Math.round((0.5 + (shares[1] - 0.5) * factor) * 100) / 100;
  return [Math.round((1 - second) * 100) / 100, second];
}
