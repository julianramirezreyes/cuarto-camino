import {
  CENTERS,
  ENNEAGRAM_TYPES,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  INSTINCTS,
  INTEGRATION,
  STRESS,
  wingsOf,
  type EnneagramType,
  type Instinct,
} from "@/domain/enneagram/structure";
import { SOURCES } from "@/content/sources";

export const LEVELS_PER_TYPE = 9;

export interface ReferenceSeed {
  types: { number: EnneagramType }[];
  wings: { type: EnneagramType; wing: EnneagramType }[];
  connections: {
    from: EnneagramType;
    to: EnneagramType;
    kind: "integration" | "stress";
  }[];
  triads: {
    type: EnneagramType;
    kind: "center" | "hornevian" | "harmonic";
    groupKey: string;
  }[];
  subtypes: { key: string; type: EnneagramType; instinct: Instinct }[];
  levels: { key: string; type: EnneagramType; level: number }[];
  sources: {
    key: string;
    author: string;
    title: string;
    year: number | null;
    kind: "book" | "article" | "web";
    note: string | null;
  }[];
}

function triadRows(
  kind: "center" | "hornevian" | "harmonic",
  groups: Record<string, readonly EnneagramType[]>,
) {
  return Object.entries(groups).flatMap(([groupKey, members]) =>
    members.map((type) => ({ type, kind, groupKey })),
  );
}

/** Pure derivation of every structural row from the typed domain. No I/O. */
export function buildReferenceSeed(): ReferenceSeed {
  return {
    types: ENNEAGRAM_TYPES.map((number) => ({ number })),
    wings: ENNEAGRAM_TYPES.flatMap((type) =>
      wingsOf(type).map((wing) => ({ type, wing })),
    ),
    connections: ENNEAGRAM_TYPES.flatMap((from) => [
      { from, to: INTEGRATION[from], kind: "integration" as const },
      { from, to: STRESS[from], kind: "stress" as const },
    ]),
    triads: [
      ...triadRows("center", CENTERS),
      ...triadRows("hornevian", HORNEVIAN_GROUPS),
      ...triadRows("harmonic", HARMONIC_GROUPS),
    ],
    subtypes: ENNEAGRAM_TYPES.flatMap((type) =>
      INSTINCTS.map((instinct) => ({
        key: `${type}-${instinct}`,
        type,
        instinct,
      })),
    ),
    levels: ENNEAGRAM_TYPES.flatMap((type) =>
      Array.from({ length: LEVELS_PER_TYPE }, (_, i) => ({
        key: `${type}-L${i + 1}`,
        type,
        level: i + 1,
      })),
    ),
    sources: Object.values(SOURCES).map((s) => ({
      key: s.key,
      author: s.author,
      title: s.title,
      year: s.year ?? null,
      kind: s.kind,
      note: s.note ?? null,
    })),
  };
}
