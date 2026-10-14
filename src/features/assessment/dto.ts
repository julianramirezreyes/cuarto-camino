import type { AssessmentModule, EngineConfig, Question, ResponseKind } from "@/domain/assessment/types";
import type { TrailEntry } from "./trail";

/** What the client may see of a question. NEVER scores, weights, rationale or references. */
export interface QuestionDTO {
  id: string;
  text: string;
  kind: ResponseKind;
  module: AssessmentModule;
  options: { id: string; text: string }[];
  selectedOptionId?: string;
}

export interface Progress {
  /** Questions answered on the current path. */
  answered: number;
  /** Module of the shown question (the last module when finished). */
  module: AssessmentModule;
  /** Zero-based position of the shown question inside its module. */
  moduleIndex: number;
  moduleMin: number;
  moduleMax: number;
}

export function toQuestionDTO(question: Question, selectedOptionId?: string): QuestionDTO {
  const dto: QuestionDTO = {
    id: question.id,
    text: question.text,
    kind: question.kind,
    module: question.module,
    options: question.options.map((o) => ({ id: o.id, text: o.text })),
  };
  if (selectedOptionId !== undefined) dto.selectedOptionId = selectedOptionId;
  return dto;
}

/**
 * Progress for `question` (null = finished). `trail` is the whole path (so `answered`
 * is stable while going back); `before` are the entries that come before the question.
 */
export function progressFor(
  trail: readonly TrailEntry[],
  before: readonly TrailEntry[],
  question: Question | null,
  config: EngineConfig,
): Progress {
  const mod: AssessmentModule = question?.module ?? "functioning";
  const { min, max } = config.limits[mod];
  return {
    answered: trail.length,
    module: mod,
    moduleIndex: before.filter((e) => e.question.module === mod).length,
    moduleMin: min,
    moduleMax: max,
  };
}
