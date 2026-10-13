import type {
  Answer,
  AssessmentModule,
  Compatibility,
  EngineConfig,
  Inconsistency,
  Question,
  StopDecision,
} from "@/domain/assessment/types";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { functioningFromResolved, type FunctioningResult } from "@/domain/scoring/functioning";
import { detectInconsistencies } from "@/domain/scoring/inconsistencies";
import { instinctsFromResolved, type InstinctResult } from "@/domain/scoring/instinct";
import { wingFromResolved, type WingResult } from "@/domain/scoring/wing";
import { analyze } from "./state";
import { sessionDecision } from "./stop";

export type ReportWing = Omit<WingResult, "main" | "wings"> & {
  main: EnneagramType | null;
  wings: [EnneagramType, EnneagramType] | null;
};

/**
 * Result of an assessment. Every `share` is a RELATIVE COMPATIBILITY index
 * among alternatives, NOT a calibrated probability.
 */
export interface AssessmentReport {
  engineVersion: string;
  /** Top-ranked type, or null when no answer gave any type evidence. */
  primaryType: EnneagramType | null;
  /** All nine types, ranked (share desc, ties by lower type number). */
  ranking: Compatibility[];
  /** The three most compatible types (positions 1-3 of the ranking). */
  alternatives: Compatibility[];
  /** True when the gap between first and second is < ambiguityMargin (or no evidence). */
  ambiguous: boolean;
  inconsistencies: Inconsistency[];
  moduleCounts: Record<AssessmentModule, number>;
  wing: ReportWing;
  instinct: InstinctResult;
  functioning: FunctioningResult;
  /** Whole-session stop decision at the time of the report. */
  stop: StopDecision;
  /** Human-readable Spanish lines describing how the result was derived. */
  explanation: string[];
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const BAND_ES = { flexible: "flexible", intermediate: "intermedio", maladaptive: "rígido o poco adaptativo" } as const;
const INSTINCT_ES = { sp: "conservación (sp)", so: "social (so)", sx: "sexual / uno a uno (sx)" } as const;

export function buildReport(bank: readonly Question[], answers: readonly Answer[], config: EngineConfig): AssessmentReport {
  const state = analyze(bank, answers, config);
  const { ranking, resolved, counts } = state;
  const primaryType = state.hasTypeEvidence ? ranking[0].type : null;
  const gap = ranking[0].share - ranking[1].share;
  const ambiguous = !state.hasTypeEvidence || gap < config.ambiguityMargin;

  const w = wingFromResolved(resolved, state.main);
  const wing: ReportWing = state.hasTypeEvidence
    ? w
    : { ...w, main: null, wings: null, likelyWing: null, evidenceCount: 0 };
  const instinct = instinctsFromResolved(resolved);
  const functioning = functioningFromResolved(resolved);
  const inconsistencies = detectInconsistencies(bank, answers);
  const stop = sessionDecision(state);

  const explanation: string[] = [];
  const total = counts.type + counts.wing + counts.instinct + counts.functioning;
  explanation.push(
    `Se registraron ${total} respuestas válidas (tipo: ${counts.type}, ala: ${counts.wing}, instinto: ${counts.instinct}, funcionamiento: ${counts.functioning}).`,
    "Los porcentajes son compatibilidad relativa entre los nueve tipos según tus respuestas; no son una probabilidad calibrada ni un diagnóstico.",
  );
  if (primaryType === null) {
    explanation.push("Todavía no hay evidencia suficiente para ordenar los tipos.");
  } else {
    const [a, b, c] = ranking;
    explanation.push(
      `El tipo con mayor compatibilidad relativa es el ${a.type} (${pct(a.share)}), seguido por el ${b.type} (${pct(b.share)}) y el ${c.type} (${pct(c.share)}).`,
    );
    explanation.push(
      ambiguous
        ? `La diferencia entre los dos primeros (${pct(gap)}) es menor que el margen de ambigüedad (${pct(config.ambiguityMargin)}): el resultado es ambiguo y conviene explorar también las alternativas.`
        : `La diferencia entre los dos primeros (${pct(gap)}) supera el margen de ambigüedad (${pct(config.ambiguityMargin)}).`,
    );
  }
  if (inconsistencies.length > 0) {
    explanation.push(
      `Se detectaron ${inconsistencies.length} inconsistencia(s) entre preguntas casi equivalentes; eso reduce la confianza en el resultado.`,
    );
  }
  if (wing.likelyWing !== null && wing.main !== null) {
    explanation.push(`Ala probable: ${wing.likelyWing} (con base en ${wing.evidenceCount} respuestas, sobre el tipo ${wing.main}).`);
  } else if (counts.wing > 0) {
    explanation.push("No hay evidencia suficientemente clara para indicar un ala.");
  }
  if (instinct.dominant !== null) {
    explanation.push(
      `Instinto dominante: ${INSTINCT_ES[instinct.dominant]}. Solo se informa el dominante; no se afirma un orden completo de instintos porque la evidencia no lo sostiene.`,
    );
  } else if (counts.instinct > 0) {
    explanation.push("No hay un instinto dominante claro con las respuestas disponibles.");
  }
  if (functioning.band !== null) {
    explanation.push(
      `Banda de funcionamiento (últimas 4 semanas): ${BAND_ES[functioning.band]}, con incertidumbre ${pct(functioning.uncertainty)}. Es un modelo interpretativo, no una medida clínica.`,
    );
  }
  explanation.push(`Versión del motor: ${config.engineVersion}.`);

  return {
    engineVersion: config.engineVersion,
    primaryType,
    ranking,
    alternatives: ranking.slice(0, 3),
    ambiguous,
    inconsistencies,
    moduleCounts: counts,
    wing,
    instinct,
    functioning,
    stop,
    explanation,
  };
}
