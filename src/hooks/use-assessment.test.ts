import { describe, expect, it } from "vitest";
import {
  assessmentReducer,
  initialState,
  type AssessmentState,
} from "./use-assessment";
import type { Progress, QuestionDTO } from "./assessment-types";

const q1: QuestionDTO = {
  id: "q1",
  text: "Pregunta uno",
  kind: "forced-choice",
  module: "type",
  options: [
    { id: "a", text: "A" },
    { id: "b", text: "B" },
  ],
};
const q2: QuestionDTO = { ...q1, id: "q2", text: "Pregunta dos" };
const progress: Progress = { answered: 0, module: "type", moduleIndex: 0, moduleMin: 5, moduleMax: 10 };
const assessment = { id: "as1", status: "in_progress" };

function inQuestion(): AssessmentState {
  return assessmentReducer(initialState, {
    type: "STARTED",
    assessment,
    question: q1,
    progress,
  });
}

describe("assessmentReducer", () => {
  it("starts idle and moves to loading when loading begins", () => {
    expect(initialState.status).toBe("idle");
    expect(assessmentReducer(initialState, { type: "LOAD" }).status).toBe("loading");
  });

  it("goes to consent when no assessment exists", () => {
    const s = assessmentReducer({ ...initialState, status: "loading" }, { type: "NO_CURRENT" });
    expect(s.status).toBe("consent");
  });

  it("offers to resume when an assessment exists", () => {
    const s = assessmentReducer(initialState, { type: "CURRENT_FOUND", assessment, question: q1, progress });
    expect(s.status).toBe("resume");
    expect(s.assessmentId).toBe("as1");
  });

  it("continues from the resume prompt into the question", () => {
    const resume = assessmentReducer(initialState, { type: "CURRENT_FOUND", assessment, question: q1, progress });
    const s = assessmentReducer(resume, { type: "CONTINUE" });
    expect(s.status).toBe("question");
    expect(s.question).toEqual(q1);
  });

  it("finishes immediately when the resumed assessment has no question left", () => {
    const s = assessmentReducer(initialState, { type: "CURRENT_FOUND", assessment, question: null, progress });
    expect(s.status).toBe("done");
  });

  it("shows the first question after starting", () => {
    const s = inQuestion();
    expect(s.status).toBe("question");
    expect(s.question?.id).toBe("q1");
    expect(s.assessmentId).toBe("as1");
  });

  it("marks the selection optimistically and submits", () => {
    const s = assessmentReducer(inQuestion(), { type: "SELECT", optionId: "b" });
    expect(s.status).toBe("submitting");
    expect(s.pendingOptionId).toBe("b");
  });

  it("ignores a second selection while submitting", () => {
    const submitting = assessmentReducer(inQuestion(), { type: "SELECT", optionId: "b" });
    const s = assessmentReducer(submitting, { type: "SELECT", optionId: "a" });
    expect(s.pendingOptionId).toBe("b");
  });

  it("advances to the next question after an answer", () => {
    const submitting = assessmentReducer(inQuestion(), { type: "SELECT", optionId: "b" });
    const s = assessmentReducer(submitting, {
      type: "ANSWERED",
      question: q2,
      progress: { ...progress, answered: 1 },
      done: false,
    });
    expect(s.status).toBe("question");
    expect(s.question?.id).toBe("q2");
    expect(s.pendingOptionId).toBeNull();
    expect(s.progress?.answered).toBe(1);
  });

  it("is done when the API says so", () => {
    const submitting = assessmentReducer(inQuestion(), { type: "SELECT", optionId: "b" });
    const s = assessmentReducer(submitting, { type: "ANSWERED", question: null, progress, done: true });
    expect(s.status).toBe("done");
  });

  it("goes back to the previous question", () => {
    const s = assessmentReducer(inQuestion(), { type: "BACK_START" });
    expect(s.status).toBe("submitting");
    const back = assessmentReducer(s, { type: "BACKED", question: { ...q1, selectedOptionId: "a" }, progress });
    expect(back.status).toBe("question");
    expect(back.question?.selectedOptionId).toBe("a");
  });

  it("pauses and resumes", () => {
    const paused = assessmentReducer(inQuestion(), { type: "PAUSED" });
    expect(paused.status).toBe("paused");
    expect(assessmentReducer(paused, { type: "CONTINUE" }).status).toBe("question");
  });

  it("keeps the question and clears the pending option on error", () => {
    const submitting = assessmentReducer(inQuestion(), { type: "SELECT", optionId: "b" });
    const s = assessmentReducer(submitting, { type: "FAILED", message: "Sin conexión" });
    expect(s.status).toBe("error");
    expect(s.error).toBe("Sin conexión");
    expect(s.question?.id).toBe("q1");
    expect(s.pendingOptionId).toBeNull();
  });

  it("returns to the question when an error is dismissed and a question exists", () => {
    const failed = assessmentReducer(inQuestion(), { type: "FAILED", message: "x" });
    expect(assessmentReducer(failed, { type: "DISMISS_ERROR" }).status).toBe("question");
  });

  it("returns to consent when an error is dismissed and nothing was loaded", () => {
    const failed = assessmentReducer(initialState, { type: "FAILED", message: "x" });
    expect(assessmentReducer(failed, { type: "DISMISS_ERROR" }).status).toBe("consent");
  });

  it("starts over: clears assessment and returns to consent", () => {
    const s = assessmentReducer(inQuestion(), { type: "RESET" });
    expect(s.status).toBe("consent");
    expect(s.assessmentId).toBeNull();
    expect(s.question).toBeNull();
  });
});
