import type { LevelProfile, SourceRef, SubtypeProfile, TypeProfile, WingProfile } from "@/content/schema";
import type { EnneagramType } from "@/domain/enneagram/structure";

/**
 * Plain, serializable slice of the content for ONE type. Built on the server
 * (`src/app/api/content/type-bundle.ts`) so the large content files never ship to the browser.
 */
export interface TypeBundle {
  type: EnneagramType;
  profile: TypeProfile;
  /** The two adjacent-type wing profiles. */
  wings: WingProfile[];
  /** sp / so / sx. */
  subtypes: SubtypeProfile[];
  /** The nine levels of the type, ordered 1..9. */
  levels: LevelProfile[];
  stackings: { order: string; description: string }[];
  stackingsNote: string;
  /** Bibliography entries resolved from every source key used by the content above (deduped). */
  sources: SourceRef[];
}

/** Light view of one of the closest alternative types, used by the header and the comparison. */
export interface AlternativeSummary {
  type: EnneagramType;
  name: string;
  summary: string;
  coreMotivation: string;
  /** Difference vs. the main type from the main type's `lookAlikes`, when documented. */
  difference: string | null;
}

export interface ResultMeta {
  engineVersion: string;
  bankVersion: string;
  /** ISO string. */
  completedAt: string;
}
