import { describe, expect, it } from "vitest";
import type { Question } from "@/domain/assessment/types";
import { MINI_BANK } from "@/tests/fixtures/mini-bank";
import { topTypeOfOption } from "./resolve";
import { detectInconsistencies } from "./inconsistencies";

const q = (id: string) => MINI_BANK.find((x) => x.id === id)!;
/** Option whose TOP type is t (fixture options have a primary 3 and a secondary 1). */
const optionGiving = (question: Question, t: number) => question.options.find((o) => topTypeOfOption(o) === t);

describe("detectInconsistencies", () => {
  it("is empty with no answers or one answer of the group", () => {
    expect(detectInconsistencies(MINI_BANK, [])).toEqual([]);
    expect(detectInconsistencies(MINI_BANK, [{ questionId: "q-type-004", optionId: "q-type-004-o0" }])).toEqual([]);
  });

  it("flags two group members whose chosen options point to different types", () => {
    const a = q("q-type-004");
    const b = q("q-type-013");
    expect(a.equivalenceGroup).toBe(b.equivalenceGroup);
    const r = detectInconsistencies(MINI_BANK, [
      { questionId: a.id, optionId: optionGiving(a, 6)!.id },
      { questionId: b.id, optionId: optionGiving(b, 1)!.id },
    ]);
    expect(r).toHaveLength(1);
    expect(r[0].groupId).toBe("eq-a");
    expect(r[0].questionIds).toEqual([a.id, b.id]);
    expect(r[0].note).toMatch(/\S/);
  });

  it("does not flag when top types agree", () => {
    const a = q("q-type-004");
    const b = q("q-type-013");
    // find a type available in both questions
    const common = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).find((t) => optionGiving(a, t) && optionGiving(b, t))!;
    const r = detectInconsistencies(MINI_BANK, [
      { questionId: a.id, optionId: optionGiving(a, common)!.id },
      { questionId: b.id, optionId: optionGiving(b, common)!.id },
    ]);
    expect(r).toEqual([]);
  });

  it("uses the latest answer when a question is answered twice, ignores unknown ids", () => {
    const a = q("q-type-004");
    const b = q("q-type-013");
    const common = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).find((t) => optionGiving(a, t) && optionGiving(b, t))!;
    const other = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).find((t) => t !== common && optionGiving(a, t))!;
    const r = detectInconsistencies(MINI_BANK, [
      { questionId: a.id, optionId: optionGiving(a, other)!.id },
      { questionId: a.id, optionId: optionGiving(a, common)!.id },
      { questionId: b.id, optionId: optionGiving(b, common)!.id },
      { questionId: "ghost", optionId: "x" },
    ]);
    expect(r).toEqual([]);
  });
});
