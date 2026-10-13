import type { EnneagramType, Instinct } from "@/domain/enneagram/structure";

/** A verifiable bibliographic source. Never invent entries. */
export interface SourceRef {
  key: string; // e.g. "riso-hudson-1999"
  author: string;
  title: string;
  year?: number;
  kind: "book" | "article" | "web";
  note?: string;
}

/** Marks who/what an interpretation belongs to. */
export type Attribution = "naranjo" | "chestnut" | "riso-hudson" | "ichazo" | "palmer" | "horney" | "editorial" | "contemporary";

export interface Claim {
  text: string;
  /** Whose tradition the statement belongs to, or "editorial" for original synthesis. */
  attribution: Attribution;
  sources?: string[]; // keys in SOURCES
}

/** All content ships as "draft": needs specialist review before public use. */
export type EditorialStatus = "draft" | "reviewed";

export interface TypeProfile {
  type: EnneagramType;
  name: string; // Reformador, Ayudador, ...
  summary: string;
  coreMotivation: string;
  basicDesire: string;
  basicFear: string;
  psychologicalNeed: string;
  passion: Claim;
  fixation: Claim;
  virtue: Claim;
  selfImage: string;
  defenseMechanisms: Claim[];
  strengths: string[];
  limitations: string[];
  habitualBehaviors: string[];
  recurringThoughts: string[];
  emotionalResponses: string[];
  inRelationships: string;
  atWork: string;
  inLeadership: string;
  inConflict: string;
  underPressure: string;
  constructivePatterns: string;
  lookAlikes: { type: EnneagramType; difference: string }[];
  selfObservationQuestions: string[];
  everydayExamples: string[];
  developmentPractices: string[];
  authorDifferences: string;
  sources: string[];
  status: EditorialStatus;
}

export interface WingProfile {
  type: EnneagramType;
  wing: EnneagramType;
  label: string; // "1w9"
  explanation: string;
  similarities: string[];
  differences: string[];
  motivations: string;
  manifestations: string[];
  strengths: string[];
  limitations: string[];
  examples: string[];
  comparisonWithOtherWing: string;
  sources: string[];
  status: EditorialStatus;
}

export interface SubtypeProfile {
  type: EnneagramType;
  instinct: Instinct;
  name: string;
  /** Contratipo per Naranjo's tradition, when applicable. */
  countertype: { isCountertype: boolean; note: string };
  description: string;
  motivations: string[];
  outerManifestations: string[];
  innerBehaviors: string[];
  needs: string[];
  fears: string[];
  strengths: string[];
  difficulties: string[];
  differencesFromOtherSubtypes: string;
  possibleConfusions: { type: EnneagramType; note: string }[];
  inRelationships: string;
  atWork: string;
  examples: string[];
  selfObservationPractices: string[];
  attribution: Attribution[];
  sources: string[];
  status: EditorialStatus;
}

export interface LevelProfile {
  type: EnneagramType;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Official Riso-Hudson label ONLY if verifiable; otherwise null. Never invent canonical names. */
  sourceLevelName: string | null;
  /** Original, careful editorial label shown to the user. */
  editorialLabel: string;
  description: string;
  characteristicExpressions: string[];
  thinkingPatterns: string[];
  emotionalPatterns: string[];
  inRelationships: string;
  inDecisions: string;
  availableStrengths: string[];
  possibleDifficulties: string[];
  differenceFromAdjacent: string;
  examples: string[];
  reflectionQuestions: string[];
  growthOpportunities: string[];
  disclaimer: string; // no clinical validation
  sources: string[];
  status: EditorialStatus;
}
