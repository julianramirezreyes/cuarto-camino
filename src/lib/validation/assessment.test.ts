import { describe, expect, it } from "vitest";
import {
  claimGuestDataInput,
  deleteDataInput,
  pauseAssessmentInput,
  startAssessmentInput,
  submitAnswerInput,
} from "./assessment";

const id = "3f2b8c1e-5d7a-4c1b-9a0e-1b2c3d4e5f60";

describe("startAssessmentInput", () => {
  it("accepts explicit consent", () => {
    expect(
      startAssessmentInput.safeParse({
        consent: { granted: true, policyVersion: "2026-01" },
      }).success,
    ).toBe(true);
  });
  it.each([
    [{}],
    [{ consent: { granted: false, policyVersion: "1" } }],
    [{ consent: { granted: "true", policyVersion: "1" } }],
    [{ consent: { granted: true } }],
    [{ consent: { granted: true, policyVersion: "1" }, extra: 1 }],
  ])("rejects %j", (input) => {
    expect(startAssessmentInput.safeParse(input).success).toBe(false);
  });
});

describe("submitAnswerInput", () => {
  it("accepts valid ids", () => {
    expect(
      submitAnswerInput.safeParse({
        assessmentId: id,
        questionId: "q-type-001",
        optionId: "opt_a",
      }).success,
    ).toBe(true);
  });
  it.each([
    [{ assessmentId: "nope", questionId: "q1", optionId: "a" }],
    [{ assessmentId: id, questionId: "", optionId: "a" }],
    [{ assessmentId: id, questionId: "q 1; drop", optionId: "a" }],
    [{ assessmentId: id, questionId: "q".repeat(65), optionId: "a" }],
    [{ assessmentId: id, questionId: "q1" }],
    [{ assessmentId: id, questionId: "q1", optionId: "a", userId: "x" }],
  ])("rejects %j", (input) => {
    expect(submitAnswerInput.safeParse(input).success).toBe(false);
  });
});

describe("pause / claim / delete", () => {
  it("pause needs a uuid", () => {
    expect(pauseAssessmentInput.safeParse({ assessmentId: id }).success).toBe(
      true,
    );
    expect(pauseAssessmentInput.safeParse({ assessmentId: "1" }).success).toBe(
      false,
    );
  });
  it("claim needs explicit confirmation and no token in the body", () => {
    expect(claimGuestDataInput.safeParse({ confirm: true }).success).toBe(true);
    expect(claimGuestDataInput.safeParse({ confirm: false }).success).toBe(
      false,
    );
    expect(
      claimGuestDataInput.safeParse({ confirm: true, token: "abc" }).success,
    ).toBe(false);
  });
  it("delete one assessment requires its id", () => {
    expect(
      deleteDataInput.safeParse({
        scope: "assessment",
        assessmentId: id,
        confirm: true,
      }).success,
    ).toBe(true);
    expect(
      deleteDataInput.safeParse({ scope: "assessment", confirm: true }).success,
    ).toBe(false);
  });
  it("delete all requires confirmation", () => {
    expect(
      deleteDataInput.safeParse({ scope: "all", confirm: true }).success,
    ).toBe(true);
    expect(deleteDataInput.safeParse({ scope: "all" }).success).toBe(false);
    expect(
      deleteDataInput.safeParse({ scope: "everything", confirm: true }).success,
    ).toBe(false);
  });
});
