import type { Question } from "@/domain/assessment/types";
import { FUNCTIONING_QUESTIONS } from "./functioning-questions";
import { INSTINCT_QUESTIONS } from "./instinct-questions";
import { TYPE_QUESTIONS } from "./type-questions";
import { WING_QUESTIONS } from "./wing-questions";

/**
 * Full v1 question bank (all draft, pending specialist review).
 * The pool is deliberately larger than what one person answers so the adaptive
 * engine can choose; equivalence groups let it test answer consistency.
 */
export const QUESTION_BANK: Question[] = [
  ...TYPE_QUESTIONS,
  ...WING_QUESTIONS,
  ...INSTINCT_QUESTIONS,
  ...FUNCTIONING_QUESTIONS,
];

export {
  FUNCTIONING_QUESTIONS,
  INSTINCT_QUESTIONS,
  TYPE_QUESTIONS,
  WING_QUESTIONS,
};
