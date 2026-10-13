import type {
  FunctioningBand,
  OptionScores,
  Question,
  QuestionOption,
  ResponseKind,
} from "@/domain/assessment/types";
import type { EnneagramType, Instinct } from "@/domain/enneagram/structure";

export type TypeScores = Partial<Record<EnneagramType, number>>;
export type InstinctScores = Partial<Record<Instinct, number>>;
export type BandScores = Partial<Record<FunctioningBand, number>>;

export const LIKERT_LABELS = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Ni de acuerdo ni en desacuerdo",
  "De acuerdo",
  "Totalmente de acuerdo",
] as const;
export const FREQUENCY_LABELS = [
  "Casi nunca",
  "Pocas veces",
  "A veces",
  "Con frecuencia",
  "Casi siempre",
] as const;
export const INTENSITY_LABELS = [
  "Nada",
  "Poco",
  "Algo",
  "Bastante",
  "Muchísimo",
] as const;

/** Monotone evidence curve applied to ordered 5-point scales. */
export const SCALE_CURVE = [0, 0.5, 1, 1.75, 2.5] as const;

const LETTERS = "abcdefgh";

export function labelsFor(kind: ResponseKind): readonly string[] {
  if (kind === "likert") return LIKERT_LABELS;
  if (kind === "frequency") return FREQUENCY_LABELS;
  if (kind === "intensity") return INTENSITY_LABELS;
  throw new Error(`No scale labels for kind ${kind}`);
}

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export function pad(n: number): string {
  return String(n).padStart(3, "0");
}

/** Builds options with ids a, b, c... from [text, scores] tuples. */
export function opts(
  items: ReadonlyArray<readonly [string, OptionScores]>,
): QuestionOption[] {
  return items.map(([text, scores], i) => ({
    id: LETTERS[i] as string,
    text,
    scores,
  }));
}

/** Ordered scale options; `scoresAt(i, curve)` returns the scores for position i. */
export function scaleOptions(
  kind: ResponseKind,
  scoresAt: (position: number, curveValue: number) => OptionScores,
): QuestionOption[] {
  return labelsFor(kind).map((text, i) => ({
    id: LETTERS[i] as string,
    text,
    scores: scoresAt(i, SCALE_CURVE[i] as number),
  }));
}

export interface DraftBase {
  code: string;
  text: string;
  kind: ResponseKind;
  dims: string[];
  /** Hypothesised discrimination 0..1 (not calibrated). */
  d: number;
  why: string;
  refs: string[];
  group?: string;
  weight?: number;
}

export interface DraftOptions {
  options: QuestionOption[];
  related: EnneagramType[];
  timeWindow?: "last-4-weeks";
}

export function finish(
  module: Question["module"],
  index: number,
  base: DraftBase,
  extra: DraftOptions,
): Question {
  const q: Question = {
    id: `q-${module}-${pad(index + 1)}`,
    code: base.code,
    version: 1,
    text: base.text,
    module,
    kind: base.kind,
    options: extra.options,
    relatedTypes: extra.related,
    dimensions: base.dims,
    weight: base.weight ?? 1,
    discrimination: base.d,
    rationale: base.why,
    references: base.refs,
    reviewStatus: "draft",
    active: true,
  };
  if (base.group) q.equivalenceGroup = base.group;
  if (extra.timeWindow) q.timeWindow = extra.timeWindow;
  return q;
}
