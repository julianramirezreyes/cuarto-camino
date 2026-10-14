import {
  GROUP_SYSTEMS,
  INTEGRATION,
  STRESS,
  groupKeyOf,
  wingsOf,
  type EnneagramType,
  type GroupSystem,
} from "./structure";

export type ArrowRelation = "integration" | "stress" | null;

/**
 * Structural facts about two types. By design it holds NO score, rank or verdict: the tradition itself
 * says no pairing is blessed or doomed, and no study we could verify shows that the pair of types predicts
 * how a relationship goes. These facts only feed explanatory text.
 */
export interface PairFacts {
  a: EnneagramType;
  b: EnneagramType;
  sameType: boolean;
  /** Group key both share in each system, or null when they belong to different groups. */
  shared: Record<GroupSystem, string | null>;
  /** Each person's group key in each system, as [a, b]. */
  groups: Record<GroupSystem, [string, string]>;
  /** Traditional arrow from one type to the other (direction-specific). */
  arrows: { aToB: ArrowRelation; bToA: ArrowRelation };
  /** The two types are neighbours on the circle (one is a possible wing of the other). */
  adjacent: boolean;
}

function arrow(from: EnneagramType, to: EnneagramType): ArrowRelation {
  if (INTEGRATION[from] === to) return "integration";
  if (STRESS[from] === to) return "stress";
  return null;
}

export function describePair(a: EnneagramType, b: EnneagramType): PairFacts {
  const systems = Object.keys(GROUP_SYSTEMS) as GroupSystem[];
  const groups = {} as Record<GroupSystem, [string, string]>;
  const shared = {} as Record<GroupSystem, string | null>;
  for (const system of systems) {
    const ka = groupKeyOf(system, a);
    const kb = groupKeyOf(system, b);
    groups[system] = [ka, kb];
    shared[system] = ka === kb ? ka : null;
  }
  return {
    a,
    b,
    sameType: a === b,
    shared,
    groups,
    arrows: { aToB: arrow(a, b), bToA: arrow(b, a) },
    adjacent: wingsOf(a).includes(b),
  };
}

/** Order-independent key for two different groups of a system, e.g. ("centers","mental","emotional") -> "emotional|mental". */
export function groupPairKey(system: GroupSystem, k1: string, k2: string): string {
  const order = Object.keys(GROUP_SYSTEMS[system]);
  return [k1, k2].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join("|");
}
