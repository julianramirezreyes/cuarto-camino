import type { EnneagramType, Instinct } from "@/domain/enneagram/structure";

export type AssessmentModule = "type" | "wing" | "instinct" | "functioning";
export type ResponseKind =
  | "scenario-choice"
  | "motivation-comparison"
  | "frequency"
  | "intensity"
  | "likert"
  | "forced-choice";

/** Coarse functioning band. Interpretive model only, never a clinical measure. */
export type FunctioningBand = "flexible" | "intermediate" | "maladaptive";

export interface OptionScores {
  /** Evidence toward each enneagram type (weights, any real number, usually 0..3). */
  types?: Partial<Record<EnneagramType, number>>;
  /** Evidence toward each instinct (instinct module). */
  instincts?: Partial<Record<Instinct, number>>;
  /** Evidence toward a functioning band (functioning module). */
  bands?: Partial<Record<FunctioningBand, number>>;
}

export interface QuestionOption {
  id: string;
  text: string;
  scores: OptionScores;
}

export interface Question {
  id: string; // stable unique id, e.g. "q-type-001"
  code: string; // internal code, e.g. "TYPE_SCENARIO_DEADLINE"
  version: number;
  text: string; // Spanish, plain language, never names a type
  module: AssessmentModule;
  kind: ResponseKind;
  options: QuestionOption[];
  /** Types this question is meant to help separate (used by the selector). */
  relatedTypes: EnneagramType[];
  dimensions: string[]; // psychological dimensions explored
  weight: number; // configurable, default 1
  /** Hypothesised discrimination (0..1). Design hypothesis, not calibrated. */
  discrimination: number;
  /** Questions sharing a group are near-equivalent: never ask two of them,
   *  but if both answered, they are compared for inconsistency. */
  equivalenceGroup?: string;
  /** For functioning questions: time window the question refers to. */
  timeWindow?: "last-4-weeks";
  rationale: string; // conceptual justification
  references: string[]; // keys into the sources registry
  reviewStatus: "draft" | "reviewed";
  active: boolean;
}

export interface Answer {
  questionId: string;
  optionId: string;
  answeredAt?: string;
}

export interface EngineConfig {
  engineVersion: string;
  /** Per-module minimum/maximum number of questions. */
  limits: Record<AssessmentModule, { min: number; max: number }>;
  /** Number of broad-coverage questions asked before discrimination starts. */
  coverageQuestions: number;
  /** Candidates considered when choosing a discriminating question. */
  candidateCount: number;
  /** Stop type module when (top1 - top2) relative share >= this. */
  stabilityMargin: number;
  /** Each of the top candidates needs at least this many relevant answers. */
  minEvidencePerCandidate: number;
  /** Margin under which the result is declared ambiguous. */
  ambiguityMargin: number;
}

export interface Compatibility {
  type: EnneagramType;
  raw: number;
  /** Relative affinity share (the interface keeps its older internal name) (0..1) among the nine types. NOT a calibrated probability. */
  share: number;
  evidenceCount: number;
}

export interface Inconsistency {
  groupId: string;
  questionIds: [string, string];
  note: string;
}

export interface StopDecision {
  stop: boolean;
  reason:
    | "continue"
    | "min-not-reached"
    | "stable"
    | "max-reached"
    | "bank-exhausted";
}
