import { describe, expect, it } from "vitest";
import { describePair, groupPairKey } from "./pair";
import { ENNEAGRAM_TYPES } from "./structure";

describe("describePair", () => {
  it("flags two people of the same type", () => {
    const p = describePair(4, 4);
    expect(p.sameType).toBe(true);
    expect(p.shared).toEqual({ centers: "emotional", hornevian: "withdrawn", harmonic: "reactive" });
    expect(p.adjacent).toBe(false);
  });

  it("finds the groups two different types share (and the ones they do not)", () => {
    const p = describePair(2, 4); // both emotional center; compliant vs withdrawn; positive outlook vs reactive
    expect(p.shared.centers).toBe("emotional");
    expect(p.shared.hornevian).toBeNull();
    expect(p.shared.harmonic).toBeNull();
    expect(p.groups.hornevian).toEqual(["compliant", "withdrawn"]);
    expect(p.groups.harmonic).toEqual(["positiveOutlook", "reactive"]);
  });

  it("reports the traditional arrows in each direction", () => {
    // integration 4->1, stress 4->2 ; integration 2->4, stress 2->8
    const p = describePair(4, 2);
    expect(p.arrows.aToB).toBe("stress");
    expect(p.arrows.bToA).toBe("integration");
    expect(describePair(1, 4).arrows).toEqual({ aToB: "stress", bToA: "integration" });
    expect(describePair(1, 3).arrows).toEqual({ aToB: null, bToA: null });
  });

  it("marks neighbours on the circle (wing relation), wrapping 9 and 1", () => {
    expect(describePair(4, 5).adjacent).toBe(true);
    expect(describePair(9, 1).adjacent).toBe(true);
    expect(describePair(4, 6).adjacent).toBe(false);
  });

  it("is consistent when the people are swapped", () => {
    for (const a of ENNEAGRAM_TYPES) {
      for (const b of ENNEAGRAM_TYPES) {
        const ab = describePair(a, b);
        const ba = describePair(b, a);
        expect(ab.shared).toEqual(ba.shared);
        expect(ab.adjacent).toBe(ba.adjacent);
        expect(ab.sameType).toBe(ba.sameType);
        expect(ab.arrows.aToB).toBe(ba.arrows.bToA);
        expect(ab.arrows.bToA).toBe(ba.arrows.aToB);
      }
    }
  });

  it("never produces a score, rank or verdict: only structural facts", () => {
    const keys = Object.keys(describePair(3, 7)).sort();
    expect(keys).toEqual(["a", "adjacent", "arrows", "b", "groups", "sameType", "shared"]);
  });
});

describe("groupPairKey", () => {
  it("is order independent and follows the order of the system's groups", () => {
    expect(groupPairKey("centers", "mental", "emotional")).toBe("emotional|mental");
    expect(groupPairKey("centers", "emotional", "mental")).toBe("emotional|mental");
    expect(groupPairKey("centers", "mental", "instinctive")).toBe("instinctive|mental");
    expect(groupPairKey("hornevian", "withdrawn", "assertive")).toBe("assertive|withdrawn");
    expect(groupPairKey("harmonic", "reactive", "competency")).toBe("competency|reactive");
  });
});
