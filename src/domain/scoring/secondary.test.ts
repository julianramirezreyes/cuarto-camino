import { describe, expect, it } from "vitest";
import type { Answer } from "@/domain/assessment/types";
import { MINI_BANK, makeQuestion } from "@/tests/fixtures/mini-bank";
import { computeFunctioning } from "./functioning";
import { computeInstincts } from "./instinct";
import { computeWing } from "./wing";

const pick = (qid: string, suffix: string): Answer => ({ questionId: qid, optionId: `${qid}-${suffix}` });

describe("computeWing", () => {
  it("returns null wing without evidence", () => {
    const w = computeWing(MINI_BANK, [], 2);
    expect(w.likelyWing).toBeNull();
    expect(w.wings).toEqual([1, 3]);
    expect(w.evidenceCount).toBe(0);
  });

  it("picks the dominant neighbour", () => {
    const w = computeWing(MINI_BANK, [pick("q-wing-2-1", "hi"), pick("q-wing-2-2", "hi")], 2);
    expect(w.likelyWing).toBe(3);
    expect(w.confidence).toBeGreaterThan(0.9);
  });

  it("returns null when neighbours are balanced", () => {
    const w = computeWing(MINI_BANK, [pick("q-wing-2-1", "hi"), pick("q-wing-2-2", "lo")], 2);
    expect(w.likelyWing).toBeNull();
  });

  it("wraps around 9 <-> 1 and ignores questions of other mains", () => {
    const w = computeWing(MINI_BANK, [pick("q-wing-9-1", "hi"), pick("q-wing-2-1", "lo")], 9);
    expect(w.wings).toEqual([8, 1]);
    expect(w.likelyWing).toBe(1);
    expect(w.evidenceCount).toBe(1);
  });

  it("ignores inactive questions", () => {
    const bank = MINI_BANK.map((q) => (q.id === "q-wing-2-1" ? { ...q, active: false } : q));
    const w = computeWing(bank, [pick("q-wing-2-1", "hi")], 2);
    expect(w.evidenceCount).toBe(0);
  });
});

describe("computeInstincts", () => {
  it("gives only the dominant instinct, never a full stack", () => {
    const answers = ["001", "002", "003", "004"].map((n) => pick(`q-inst-${n}`, "sx"));
    const r = computeInstincts(MINI_BANK, answers);
    expect(r.dominant).toBe("sx");
    expect(r.stackConfidence).toBe("dominant-only");
    expect(r.shares.sx).toBeGreaterThan(r.shares.sp);
    expect(r.shares.sp + r.shares.so + r.shares.sx).toBeCloseTo(1, 9);
  });

  it("no dominant when evidence is balanced or absent", () => {
    expect(computeInstincts(MINI_BANK, []).dominant).toBeNull();
    const r = computeInstincts(MINI_BANK, [pick("q-inst-001", "sp"), pick("q-inst-002", "so")]);
    expect(r.dominant).toBeNull();
  });

  it("changed answer replaces the previous one", () => {
    const r = computeInstincts(MINI_BANK, [pick("q-inst-001", "sp"), pick("q-inst-001", "so")]);
    expect(r.raw.sp).toBe(0);
    expect(r.raw.so).toBe(3);
  });
});

describe("computeFunctioning", () => {
  it("band null and maximal uncertainty without evidence", () => {
    const r = computeFunctioning(MINI_BANK, []);
    expect(r.band).toBeNull();
    expect(r.uncertainty).toBeCloseTo(1, 9);
  });

  it("uncertainty decreases as evidence concentrates", () => {
    const few = computeFunctioning(MINI_BANK, [pick("q-func-001", "flexible")]);
    const many = computeFunctioning(
      MINI_BANK,
      ["001", "002", "003", "004", "005", "006"].map((n) => pick(`q-func-${n}`, "flexible")),
    );
    expect(many.band).toBe("flexible");
    expect(many.uncertainty).toBeLessThan(few.uncertainty);
    expect(many.uncertainty).toBeGreaterThanOrEqual(0);
  });

  it("mixed answers are uncertain", () => {
    const r = computeFunctioning(MINI_BANK, [
      pick("q-func-001", "flexible"),
      pick("q-func-002", "maladaptive"),
    ]);
    expect(r.uncertainty).toBeGreaterThan(0.8);
    expect(r.decided).toBe(false);
  });

  it("tie goes to the first band deterministically", () => {
    const bank = [makeQuestion({ id: "x", module: "functioning", options: [{ id: "x1", text: "", scores: { bands: { maladaptive: 1, intermediate: 1 } } }] })];
    expect(computeFunctioning(bank, [{ questionId: "x", optionId: "x1" }]).band).toBe("intermediate");
  });
});
