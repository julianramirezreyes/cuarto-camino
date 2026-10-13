import { describe, expect, it } from "vitest";
import {
  CENTERS,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  wingsOf,
} from "@/domain/enneagram/structure";
import { buildReferenceSeed } from "./seed-data";

const seed = buildReferenceSeed();

describe("buildReferenceSeed", () => {
  it("has the expected cardinalities", () => {
    expect(seed.types).toHaveLength(9);
    expect(seed.wings).toHaveLength(18);
    expect(seed.connections).toHaveLength(18);
    expect(seed.triads).toHaveLength(27);
    expect(seed.subtypes).toHaveLength(27);
    expect(seed.levels).toHaveLength(81);
  });
  it("has unique natural keys (so ON CONFLICT DO NOTHING is truly idempotent)", () => {
    const uniq = (xs: string[]) => new Set(xs).size === xs.length;
    expect(uniq(seed.subtypes.map((s) => s.key))).toBe(true);
    expect(uniq(seed.levels.map((l) => l.key))).toBe(true);
    expect(uniq(seed.wings.map((w) => `${w.type}-${w.wing}`))).toBe(true);
    expect(uniq(seed.connections.map((c) => `${c.from}-${c.kind}`))).toBe(true);
    expect(uniq(seed.triads.map((t) => `${t.type}-${t.kind}`))).toBe(true);
    expect(uniq(seed.sources.map((s) => s.key))).toBe(true);
  });
  it("wings match the domain, never self, always adjacent on the circle", () => {
    for (const { type, wing } of seed.wings) {
      expect(wingsOf(type)).toContain(wing);
      expect(wing).not.toBe(type);
    }
  });
  it("connections never point to self", () => {
    expect(seed.connections.every((c) => c.from !== c.to)).toBe(true);
  });
  it("every type belongs to exactly one group per triad kind", () => {
    const groups = {
      center: CENTERS,
      hornevian: HORNEVIAN_GROUPS,
      harmonic: HARMONIC_GROUPS,
    };
    for (const kind of ["center", "hornevian", "harmonic"] as const) {
      const rows = seed.triads.filter((t) => t.kind === kind);
      expect(new Set(rows.map((r) => r.groupKey))).toEqual(
        new Set(Object.keys(groups[kind])),
      );
      expect(rows.map((r) => r.type).sort()).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    }
  });
  it("covers sp/so/sx for each type and levels 1..9", () => {
    expect(
      seed.subtypes
        .filter((s) => s.type === 4)
        .map((s) => s.instinct)
        .sort(),
    ).toEqual(["so", "sp", "sx"]);
    expect(seed.levels.filter((l) => l.type === 4).map((l) => l.level)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
  });
});
