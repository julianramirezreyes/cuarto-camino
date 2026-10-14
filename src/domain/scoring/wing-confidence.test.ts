import { describe, expect, it } from "vitest";
import type { Answer, Question } from "@/domain/assessment/types";
import { makeQuestion } from "@/tests/fixtures/mini-bank";
import { computeWing } from "./wing";

/** Main type 2 -> neighbours 1 (lower) and 3 (upper). Each question strongly favours the upper wing. */
function bank(n: number): { bank: Question[]; answers: Answer[] } {
  const qs = Array.from({ length: n }, (_, i) =>
    makeQuestion({
      id: `q-wing-c-${i}`,
      module: "wing",
      relatedTypes: [2, 1, 3],
      options: [
        { id: "lo", text: "lo", scores: { types: { 1: 2 } } },
        { id: "hi", text: "hi", scores: { types: { 3: 2 } } },
      ],
    }),
  );
  return { bank: qs, answers: qs.map((q) => ({ questionId: q.id, optionId: "hi" })) };
}

describe("wing confidence shrinks with the amount of evidence", () => {
  it("is below 1 even when every answer agrees, if there are few answers", () => {
    const { bank: b, answers } = bank(3);
    const w = computeWing(b, answers, 2);
    expect(w.likelyWing).toBe(3);
    expect(w.confidence).toBeCloseTo(0.5, 6); // margin 1 * 3 / (3 + 3)
    expect(w.confidence).toBeLessThan(1);
  });

  it("grows as more consistent evidence arrives, and never reaches 1", () => {
    const c = (n: number) => {
      const { bank: b, answers } = bank(n);
      return computeWing(b, answers, 2).confidence;
    };
    expect(c(1)).toBeLessThan(c(3));
    expect(c(3)).toBeLessThan(c(12));
    expect(c(12)).toBeLessThan(1);
  });

  it("is 0 without evidence", () => {
    expect(computeWing([], [], 2).confidence).toBe(0);
  });
});
