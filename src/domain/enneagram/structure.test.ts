import { describe, expect, it } from "vitest";
import {
  CENTERS,
  ENNEAGRAM_TYPES,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  INTEGRATION,
  STRESS,
  wingsOf,
} from "./structure";

describe("enneagram structure", () => {
  it("has the nine types", () => {
    expect(ENNEAGRAM_TYPES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("maps traditional integration and stress arrows", () => {
    expect(INTEGRATION).toEqual({ 1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3 });
    expect(STRESS).toEqual({ 1: 4, 2: 8, 3: 9, 4: 2, 5: 7, 6: 3, 7: 1, 8: 5, 9: 6 });
  });

  it("returns the two adjacent wings, wrapping 9 and 1", () => {
    expect(wingsOf(1)).toEqual([9, 2]);
    expect(wingsOf(9)).toEqual([8, 1]);
    expect(wingsOf(5)).toEqual([4, 6]);
  });

  it("partitions the types in each classification exactly once", () => {
    for (const groups of [CENTERS, HORNEVIAN_GROUPS, HARMONIC_GROUPS]) {
      const all = Object.values(groups).flat().sort();
      expect(all).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
    expect(CENTERS.instinctive).toEqual([8, 9, 1]);
    expect(HORNEVIAN_GROUPS.assertive).toEqual([3, 7, 8]);
    expect(HARMONIC_GROUPS.reactive).toEqual([4, 6, 8]);
  });
});
