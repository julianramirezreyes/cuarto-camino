import { describe, expect, it } from "vitest";
import type { FunctioningResult } from "@/domain/scoring/functioning";
import { bandOfLevel, plausibleLevels } from "./levels-logic";

const f = (over: Partial<FunctioningResult>): FunctioningResult => ({
  raw: { flexible: 0, intermediate: 0, maladaptive: 0 },
  shares: { flexible: 0.2, intermediate: 0.6, maladaptive: 0.2 },
  band: "intermediate",
  decided: false,
  uncertainty: 0.5,
  margin: 0.4,
  evidenceCount: 4,
  ...over,
});

describe("plausibleLevels", () => {
  it("never returns more than two levels", () => {
    for (const band of ["flexible", "intermediate", "maladaptive"] as const) {
      expect(plausibleLevels(f({ band })).length).toBeLessThanOrEqual(2);
    }
  });
  it("is empty without a band", () => expect(plausibleLevels(f({ band: null }))).toEqual([]));
  it("is one level when the band is decided", () => expect(plausibleLevels(f({ decided: true }))).toEqual([5]));
  it("adds the neighbour toward the second most supported band", () => {
    expect(plausibleLevels(f({ shares: { flexible: 0.3, intermediate: 0.5, maladaptive: 0.2 } }))).toEqual([5, 4]);
    expect(plausibleLevels(f({ shares: { flexible: 0.1, intermediate: 0.5, maladaptive: 0.4 } }))).toEqual([5, 6]);
    expect(plausibleLevels(f({ band: "flexible", shares: { flexible: 0.5, intermediate: 0.4, maladaptive: 0.1 } }))).toEqual([2, 3]);
    expect(plausibleLevels(f({ band: "maladaptive", shares: { flexible: 0.1, intermediate: 0.4, maladaptive: 0.5 } }))).toEqual([8, 7]);
  });
  it("always stays inside the band", () => {
    expect(plausibleLevels(f({ band: "flexible", shares: { flexible: 0.5, intermediate: 0.1, maladaptive: 0.4 } })).every((l) => bandOfLevel(l) === "flexible")).toBe(true);
  });
});

describe("bandOfLevel", () => {
  it("groups 1-3, 4-6, 7-9", () => {
    expect([1, 3, 4, 6, 7, 9].map(bandOfLevel)).toEqual(["flexible", "flexible", "intermediate", "intermediate", "maladaptive", "maladaptive"]);
  });
});
