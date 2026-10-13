import type { Answer, Question, QuestionOption } from "@/domain/assessment/types";

export interface ResolvedAnswer {
  question: Question;
  option: QuestionOption;
  /** Position of the question in the bank (used for deterministic ordering). */
  index: number;
}

/**
 * Normalizes a raw answer list against the bank:
 *  - unknown question or option ids are dropped,
 *  - answers to inactive questions are dropped,
 *  - a later answer to the same question replaces the earlier one,
 *  - the result is ordered by bank position, so scoring does not depend on the
 *    order in which answers arrived (floating-point sums stay identical).
 */
export function resolveAnswers(
  bank: readonly Question[],
  answers: readonly Answer[],
): ResolvedAnswer[] {
  const indexById = new Map<string, number>();
  bank.forEach((q, i) => {
    if (!indexById.has(q.id)) indexById.set(q.id, i);
  });
  const latest = new Map<string, string>();
  for (const a of answers) latest.set(a.questionId, a.optionId);

  const out: ResolvedAnswer[] = [];
  for (const [questionId, optionId] of latest) {
    const index = indexById.get(questionId);
    if (index === undefined) continue;
    const question = bank[index];
    if (!question.active) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    out.push({ question, option, index });
  }
  return out.sort((a, b) => a.index - b.index);
}

/** Highest-scoring type of an option; ties go to the lower type number. */
export function topTypeOfOption(option: QuestionOption): number | null {
  let best: number | null = null;
  let bestScore = 0;
  for (const [t, s] of Object.entries(option.scores.types ?? {})) {
    const type = Number(t);
    if (s === undefined || s <= 0) continue;
    if (s > bestScore || (s === bestScore && best !== null && type < best)) {
      best = type;
      bestScore = s;
    }
  }
  return best;
}
