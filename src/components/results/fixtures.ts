/** Test fixtures (real content slices + a hand-made report). Not imported by production code. */
import { buildAlternativeSummaries, buildTypeBundle } from "@/app/api/content/type-bundle";
import type { AssessmentReport } from "@/domain/adaptive-engine";
import type { Compatibility } from "@/domain/assessment/types";
import { ENNEAGRAM_TYPES, type EnneagramType } from "@/domain/enneagram/structure";
import type { ResultMeta } from "./types";

export function makeReport(over: Partial<AssessmentReport> = {}, order: EnneagramType[] = [4, 5, 9, 1, 2, 3, 6, 7, 8]): AssessmentReport {
  const shares = [0.34, 0.27, 0.15, 0.08, 0.06, 0.04, 0.03, 0.02, 0.01];
  const ranking: Compatibility[] = order.map((type, i) => ({ type, raw: shares[i] * 10, share: shares[i], evidenceCount: 5 }));
  return {
    engineVersion: "test-engine",
    primaryType: order[0],
    ranking,
    alternatives: ranking.slice(0, 3),
    ambiguous: false,
    inconsistencies: [],
    moduleCounts: { type: 12, wing: 3, instinct: 3, functioning: 4 },
    wing: { main: order[0], wings: [3, 5], scores: [1, 3], shares: [0.25, 0.75], confidence: 0.5, likelyWing: 5, evidenceCount: 3 },
    instinct: {
      raw: { sp: 1, so: 3, sx: 2 },
      shares: { sp: 0.17, so: 0.5, sx: 0.33 },
      dominant: "so",
      margin: 0.17,
      evidenceCount: 3,
      stackConfidence: "dominant-only",
    },
    functioning: {
      raw: { flexible: 1, intermediate: 3, maladaptive: 1 },
      shares: { flexible: 0.2, intermediate: 0.6, maladaptive: 0.2 },
      band: "intermediate",
      decided: true,
      uncertainty: 0.42,
      margin: 0.4,
      evidenceCount: 4,
    },
    stop: { stop: true, reason: "stable" },
    explanation: ["Se registraron 22 respuestas válidas.", "Los porcentajes son compatibilidad relativa entre los nueve tipos."],
    ...over,
  };
}

export const META: ResultMeta = { engineVersion: "test-engine", bankVersion: "bank-1", completedAt: "2026-01-02T10:00:00.000Z" };

export function makeProps(over: Partial<AssessmentReport> = {}, order?: EnneagramType[]) {
  const report = makeReport(over, order);
  const primary = buildTypeBundle(report.primaryType ?? 4);
  const alternatives = buildAlternativeSummaries(
    primary.profile,
    report.alternatives.slice(1, 3).map((a) => a.type),
  );
  return { assessmentId: "11111111-1111-4111-8111-111111111111", report, meta: META, primary, alternatives };
}

export { ENNEAGRAM_TYPES, buildTypeBundle };
