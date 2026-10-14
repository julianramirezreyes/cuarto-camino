import type { Answer, EngineConfig, Question } from "@/domain/assessment/types";
import { selectNextQuestion } from "@/domain/adaptive-engine";

export interface TrailEntry {
  question: Question;
  optionId: string;
}

export interface Walk {
  /** Answers that form the engine's path, in the order the questions were asked. */
  trail: TrailEntry[];
  /** First question on the path without a stored answer; null = assessment finished. */
  next: Question | null;
}

/**
 * Derives the question path from the stored answers (a map questionId -> optionId).
 *
 * Why not store an order or a cursor: the engine picks the next question as a pure
 * function of the answers so far. Starting from no answers we ask the engine for a
 * question; if an answer is stored for it we consume it and ask again, otherwise that
 * question is the current one. The result depends only on the SET of stored answers,
 * so:
 *  - going back is just "the entry before X in the trail" (nothing is deleted);
 *  - changing an earlier answer re-derives everything after it; stored answers that
 *    are no longer on the path ("orphans") are ignored for scoring but kept, and are
 *    reused automatically if the path comes back to them (e.g. the user restores the
 *    original option) or the engine asks the same question again.
 */
export function walkAnswers(
  bank: readonly Question[],
  config: EngineConfig,
  stored: ReadonlyMap<string, string>,
): Walk {
  const trail: TrailEntry[] = [];
  const answers: Answer[] = [];
  for (let guard = 0; guard <= bank.length; guard++) {
    const next = selectNextQuestion(bank, answers, config);
    if (!next) return { trail, next: null };
    const optionId = stored.get(next.id);
    if (optionId === undefined || !next.options.some((o) => o.id === optionId)) return { trail, next };
    answers.push({ questionId: next.id, optionId });
    trail.push({ question: next, optionId });
  }
  return { trail, next: null };
}
