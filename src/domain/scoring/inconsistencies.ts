import type { Answer, Inconsistency, Question } from "@/domain/assessment/types";
import { resolveAnswers, topTypeOfOption } from "./resolve";

/**
 * Two answered questions of the same equivalenceGroup whose chosen options have
 * a different top type are reported as an Inconsistency. Options without any
 * positive type score are skipped (nothing to compare). Pairs are emitted in
 * bank order, so the output is deterministic.
 */
export function detectInconsistencies(
  bank: readonly Question[],
  answers: readonly Answer[],
): Inconsistency[] {
  const byGroup = new Map<string, { id: string; top: number }[]>();
  for (const { question, option } of resolveAnswers(bank, answers)) {
    if (!question.equivalenceGroup) continue;
    const top = topTypeOfOption(option);
    if (top === null) continue;
    const list = byGroup.get(question.equivalenceGroup) ?? [];
    list.push({ id: question.id, top });
    byGroup.set(question.equivalenceGroup, list);
  }
  const out: Inconsistency[] = [];
  for (const [groupId, list] of byGroup) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].top !== list[j].top) {
          out.push({
            groupId,
            questionIds: [list[i].id, list[j].id],
            note: `Las respuestas a ${list[i].id} y ${list[j].id}, preguntas casi equivalentes, apuntan a tipos distintos (${list[i].top} y ${list[j].top}).`,
          });
        }
      }
    }
  }
  return out;
}
