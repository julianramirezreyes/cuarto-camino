export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Instinct = "sp" | "so" | "sx";

export const ENNEAGRAM_TYPES: readonly EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const INSTINCTS: readonly Instinct[] = ["sp", "so", "sx"];

/** Traditional integration (growth) arrows. Interpretations vary by school. */
export const INTEGRATION: Record<EnneagramType, EnneagramType> = {
  1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3,
};

/** Traditional stress (disintegration) arrows. Interpretations vary by school. */
export const STRESS: Record<EnneagramType, EnneagramType> = {
  1: 4, 2: 8, 3: 9, 4: 2, 5: 7, 6: 3, 7: 1, 8: 5, 9: 6,
};

/** The two adjacent types: [lower neighbour, upper neighbour], wrapping 9<->1. */
export function wingsOf(type: EnneagramType): [EnneagramType, EnneagramType] {
  const lower = (type === 1 ? 9 : type - 1) as EnneagramType;
  const upper = (type === 9 ? 1 : type + 1) as EnneagramType;
  return [lower, upper];
}

export const CENTERS = {
  instinctive: [8, 9, 1],
  emotional: [2, 3, 4],
  mental: [5, 6, 7],
} as const satisfies Record<string, readonly EnneagramType[]>;

export const HORNEVIAN_GROUPS = {
  assertive: [3, 7, 8],
  compliant: [1, 2, 6],
  withdrawn: [4, 5, 9],
} as const satisfies Record<string, readonly EnneagramType[]>;

export const HARMONIC_GROUPS = {
  competency: [1, 3, 5],
  positiveOutlook: [2, 7, 9],
  reactive: [4, 6, 8],
} as const satisfies Record<string, readonly EnneagramType[]>;

export const TYPE_NAMES: Record<EnneagramType, string> = {
  1: "Reformador",
  2: "Ayudador",
  3: "Triunfador",
  4: "Individualista",
  5: "Investigador",
  6: "Leal",
  7: "Entusiasta",
  8: "Desafiador",
  9: "Pacificador",
};

export type GroupSystem = "centers" | "hornevian" | "harmonic";

/** The three classic groupings of the nine types, each splitting them into three groups of three. */
export const GROUP_SYSTEMS = {
  centers: CENTERS,
  hornevian: HORNEVIAN_GROUPS,
  harmonic: HARMONIC_GROUPS,
} as const;

/** Key of the group a type belongs to in the given system (e.g. ("centers", 4) -> "emotional"). */
export function groupKeyOf(system: GroupSystem, type: EnneagramType): string {
  const groups = GROUP_SYSTEMS[system] as Record<string, readonly EnneagramType[]>;
  const key = Object.keys(groups).find((k) => groups[k].includes(type));
  if (!key) throw new Error(`type ${type} is not in system ${system}`);
  return key;
}
