import type { Answer, FunctioningBand, Question } from "@/domain/assessment/types";
import { FUNCTIONING_MARGIN, relativeShares, round9 } from "./params";
import { resolveAnswers, type ResolvedAnswer } from "./resolve";

export const BANDS: readonly FunctioningBand[] = ["flexible", "intermediate", "maladaptive"];

export interface FunctioningResult {
  raw: Record<FunctioningBand, number>;
  shares: Record<FunctioningBand, number>;
  /** Most supported band (ties: flexible > intermediate > maladaptive); null without evidence. */
  band: FunctioningBand | null;
  /** True when the gap between the top two bands reaches FUNCTIONING_MARGIN. */
  decided: boolean;
  /** Normalized Shannon entropy of the shares, 0 (certain) .. 1 (no information). */
  uncertainty: number;
  margin: number;
  evidenceCount: number;
}

export function computeFunctioning(bank: readonly Question[], answers: readonly Answer[]): FunctioningResult {
  return functioningFromResolved(resolveAnswers(bank, answers));
}

export function functioningFromResolved(resolved: readonly ResolvedAnswer[]): FunctioningResult {
  const raw = { flexible: 0, intermediate: 0, maladaptive: 0 } as Record<FunctioningBand, number>;
  let evidenceCount = 0;
  for (const { question, option } of resolved) {
    if (question.module !== "functioning") continue;
    let any = false;
    for (const b of BANDS) {
      const s = option.scores.bands?.[b] ?? 0;
      raw[b] += question.weight * s;
      if (s > 0) any = true;
    }
    if (any) evidenceCount += 1;
  }
  for (const b of BANDS) raw[b] = round9(raw[b]);
  const shares = relativeShares(BANDS, raw);
  const ranked = [...BANDS].sort((a, b) => raw[b] - raw[a] || BANDS.indexOf(a) - BANDS.indexOf(b));
  const margin = shares[ranked[0]] - shares[ranked[1]];
  const entropy = -BANDS.reduce((s, b) => s + shares[b] * Math.log(shares[b]), 0);
  const uncertainty = Math.min(1, Math.max(0, entropy / Math.log(BANDS.length)));
  return {
    raw,
    shares,
    band: evidenceCount > 0 ? ranked[0] : null,
    decided: evidenceCount > 0 && margin >= FUNCTIONING_MARGIN,
    uncertainty,
    margin,
    evidenceCount,
  };
}
