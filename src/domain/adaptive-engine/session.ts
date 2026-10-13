import type { Answer, EngineConfig, Question } from "@/domain/assessment/types";
import { buildReport, type AssessmentReport } from "./report";
import { selectNextQuestion } from "./selector";

export interface AssessmentRun {
  answers: Answer[];
  report: AssessmentReport;
}

/**
 * Reusable session driver: asks `respond` for an option id for each selected
 * question until the engine has nothing more to ask. `respond` may return null
 * to abandon the session (the partial report is still built).
 * Pure: no I/O, no clock; the same respondent yields the same run.
 */
export function runAssessment(
  bank: readonly Question[],
  respond: (question: Question, answersSoFar: readonly Answer[]) => string | null,
  config: EngineConfig,
): AssessmentRun {
  const answers: Answer[] = [];
  for (let guard = 0; guard <= bank.length; guard++) {
    const q = selectNextQuestion(bank, answers, config);
    if (!q) break;
    const optionId = respond(q, answers);
    if (optionId === null) break;
    answers.push({ questionId: q.id, optionId });
  }
  return { answers, report: buildReport(bank, answers, config) };
}
