/** Version of the privacy notice the user accepts. Bump it whenever the text changes. */
export const POLICY_VERSION = "2026-10-draft";

export type QuestionKind =
  | "scenario-choice"
  | "motivation-comparison"
  | "frequency"
  | "intensity"
  | "likert"
  | "forced-choice";

export type AssessmentModule = "type" | "wing" | "instinct" | "functioning";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionDTO {
  id: string;
  text: string;
  kind: QuestionKind;
  module: AssessmentModule;
  options: QuestionOption[];
  selectedOptionId?: string;
}

export interface Progress {
  answered: number;
  module: AssessmentModule;
  moduleIndex: number;
  moduleMin: number;
  moduleMax: number;
}

export interface AssessmentRef {
  id: string;
  status: string;
}

export const MODULE_ORDER: readonly AssessmentModule[] = ["type", "wing", "instinct", "functioning"];

export const MODULE_LABELS: Record<AssessmentModule, string> = {
  type: "Patrones",
  wing: "Matices",
  instinct: "Instintos",
  functioning: "Momento actual",
};

export const SCALE_KINDS: readonly QuestionKind[] = ["likert", "frequency", "intensity"];
