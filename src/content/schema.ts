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

/** Where two people relate. "work" covers work and society (teams, community, shared institutions). */
export type RelationshipContext = "friendship" | "partner" | "family" | "work";

export interface RelationshipContextGuide {
  /** What a person of this type tends to bring to this kind of bond. */
  brings: string[];
  /** What they often need from the other person. */
  needs: string[];
  /** Frictions that may appear (framed as tendencies, never as predictions). */
  frictions: string[];
  /** Concrete, kind suggestions for communicating or caring for the bond. */
  tips: string[];
}

/**
 * How one type tends to relate to others. DESCRIPTIVE ONLY: no ranking of "best/worst partners", no scores,
 * no predictions. Health level, wing, instinctual subtype and each person's story matter more than type.
 */
export interface RelationshipProfile {
  type: EnneagramType;
  summary: string;
  contexts: Record<RelationshipContext, RelationshipContextGuide>;
  /** What it helps other people to know when relating to this type. */
  forOthers: string[];
  /** Open questions for self-reflection or for a conversation between two people. */
  reflectionQuestions: string[];
  /** Note for two people who share this type. */
  sameTypeNote: string;
  /** Type-specific reminder about what matters more than the type (health, wing, subtype, history). */
  caveats: string;
  sources: string[];
  status: EditorialStatus;
}

export type GroupSystemKey = "centers" | "hornevian" | "harmonic";

/**
 * Texts that explain what a structural fact between two people can mean. `shared[system][group]` is used when both
 * belong to that group; `different[system][pairKey]` when they belong to two different groups (pairKey from
 * `groupPairKey`, groups ordered as in the system). Every text is framed as a tendency, never as a verdict.
 */
export interface RelationshipLenses {
  shared: Record<GroupSystemKey, Record<string, string>>;
  different: Record<GroupSystemKey, Record<string, string>>;
  arrows: { integration: string; stress: string };
  adjacent: string;
  sameType: string;
  /** Honest framing shown with the feature (no evidence that the pair of types predicts satisfaction, etc.). */
  disclaimers: string[];
  status: EditorialStatus;
}
