import type { EnneagramType } from "@/domain/enneagram/structure";
import type { RelationshipProfile } from "../schema";
import { RELATIONSHIP_LENSES } from "./lenses";
import { relType1 } from "./type-1";
import { relType2 } from "./type-2";
import { relType3 } from "./type-3";
import { relType4 } from "./type-4";
import { relType5 } from "./type-5";
import { relType6 } from "./type-6";
import { relType7 } from "./type-7";
import { relType8 } from "./type-8";
import { relType9 } from "./type-9";

export const RELATIONSHIP_PROFILES: Record<EnneagramType, RelationshipProfile> = {
  1: relType1,
  2: relType2,
  3: relType3,
  4: relType4,
  5: relType5,
  6: relType6,
  7: relType7,
  8: relType8,
  9: relType9,
};

export function getRelationship(type: EnneagramType): RelationshipProfile {
  return RELATIONSHIP_PROFILES[type];
}

export { RELATIONSHIP_LENSES };
