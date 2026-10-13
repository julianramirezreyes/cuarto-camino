import { describe, expect, it } from "vitest";
import type { Answer } from "@/domain/assessment/types";
import { makeQuestion, MINI_BANK } from "@/tests/fixtures/mini-bank";
import { computeCompatibility } from "./compatibility";

const bank = [
  makeQuestion({
    id: "a",
    module: "type",
    weight: 2,
    options: [
      { id: "a1", text: "", scores: { types: { 1: 3, 2: 1 } } },
      { id: "a2", text: "", scores: { types: { 3: 3 } } },
    ],
  }),
  makeQuestion({
    id: "b",
    module: "type",
    options: [
      { id: "b1", text: "", scores: { types: { 1: 2 } } },
      { id: "b2", text: "", scores: { types: { 3: 2 } } },
    ],
  }),
  makeQuestion({
    id: "off",
    module: "type",
    active: false,
    options: [{ id: "off1", text: "", scores: { types: { 9: 5 } } }],
  }),
  makeQuestion({
    id: "w",
    module: "wing",
    options: [{ id: "w1", text: "", scores: { types: { 9: 5 } } }],
  }),
];

const ans = (questionId: string, optionId: string): Answer => ({ questionId, optionId });
const get = (r: ReturnType<typeof computeCompatibility>, t: number) => r.find((c) => c.type === t)!;

describe("computeCompatibility", () => {
  it("returns the nine types, shares sum to 1", () => {
    const r = computeCompatibility(bank, [ans("a", "a1")]);
    expect(r).toHaveLength(9);
    expect(new Set(r.map((c) => c.type)).size).toBe(9);
    expect(r.reduce((s, c) => s + c.share, 0)).toBeCloseTo(1, 9);
  });

  it("no answers => uniform shares, zero raw and evidence", () => {
    const r = computeCompatibility(bank, []);
    for (const c of r) {
      expect(c.raw).toBe(0);
      expect(c.evidenceCount).toBe(0);
      expect(c.share).toBeCloseTo(1 / 9, 9);
    }
  });

  it("weights raw by question weight and counts evidence", () => {
    const r = computeCompatibility(bank, [ans("a", "a1"), ans("b", "b1")]);
    expect(get(r, 1).raw).toBe(2 * 3 + 2);
    expect(get(r, 2).raw).toBe(2 * 1);
    expect(get(r, 1).evidenceCount).toBe(2);
    expect(get(r, 2).evidenceCount).toBe(1);
    expect(r[0].type).toBe(1);
    expect(get(r, 1).share).toBeGreaterThan(get(r, 2).share);
    expect(get(r, 2).share).toBeGreaterThan(get(r, 5).share);
  });

  it("ignores missing, unknown ids, inactive questions and non-type modules", () => {
    const r = computeCompatibility(bank, [
      ans("zzz", "a1"),
      ans("a", "nope"),
      ans("off", "off1"),
      ans("w", "w1"),
    ]);
    expect(get(r, 9).raw).toBe(0);
    expect(r.every((c) => c.raw === 0)).toBe(true);
  });

  it("a later answer to the same question replaces the earlier", () => {
    const r = computeCompatibility(bank, [ans("a", "a1"), ans("a", "a2")]);
    expect(get(r, 1).raw).toBe(0);
    expect(get(r, 3).raw).toBe(6);
  });

  it("breaks ties deterministically by lower type number", () => {
    const r = computeCompatibility(bank, [ans("a", "a1"), ans("b", "b2")]);
    // type1 raw 6, type3 raw 2+6=... a1 gives 1:6,2:2 ; b2 gives 3:2 -> distinct; build explicit tie
    const t = computeCompatibility(bank, [ans("b", "b1")]);
    const tie = computeCompatibility(
      [makeQuestion({ id: "t", module: "type", options: [{ id: "t1", text: "", scores: { types: { 4: 2, 2: 2 } } }] })],
      [ans("t", "t1")],
    );
    expect(tie[0].type).toBe(2);
    expect(tie[1].type).toBe(4);
    expect(tie[0].share).toBeCloseTo(tie[1].share, 12);
    expect(r).toHaveLength(9);
    expect(t[0].type).toBe(1);
  });

  it("is input-order invariant for distinct questions and deterministic", () => {
    const a = [ans("a", "a1"), ans("b", "b2")];
    expect(computeCompatibility(bank, a)).toEqual(computeCompatibility(bank, [...a].reverse()));
    expect(computeCompatibility(bank, a)).toEqual(computeCompatibility(bank, a));
  });

  it("handles negative scores by shifting", () => {
    const neg = [makeQuestion({ id: "n", module: "type", options: [{ id: "n1", text: "", scores: { types: { 5: -2, 6: 1 } } }] })];
    const r = computeCompatibility(neg, [ans("n", "n1")]);
    expect(r.every((c) => c.share > 0 && c.share < 1)).toBe(true);
    expect(r.reduce((s, c) => s + c.share, 0)).toBeCloseTo(1, 9);
    expect(r[0].type).toBe(6);
    expect(r[r.length - 1].type).toBe(5);
    expect(r.find((c) => c.type === 5)!.evidenceCount).toBe(0);
  });

  it("works on the synthetic mini bank", () => {
    const q = MINI_BANK.find((x) => x.module === "type")!;
    const r = computeCompatibility(MINI_BANK, [{ questionId: q.id, optionId: q.options[0].id }]);
    expect(r[0].raw).toBe(3);
  });
});
