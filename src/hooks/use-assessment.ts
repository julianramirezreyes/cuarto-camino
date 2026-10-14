"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { ApiError, assessmentApi, errorMessage } from "./assessment-api";
import {
  POLICY_VERSION,
  type AssessmentRef,
  type Progress,
  type QuestionDTO,
} from "./assessment-types";

export type AssessmentStatus =
  | "idle"
  | "consent"
  | "resume"
  | "loading"
  | "question"
  | "submitting"
  | "paused"
  | "done"
  | "error";

export interface AssessmentState {
  status: AssessmentStatus;
  assessmentId: string | null;
  question: QuestionDTO | null;
  progress: Progress | null;
  /** Option the user just picked, shown as selected while the answer is in flight. */
  pendingOptionId: string | null;
  error: string | null;
}

export const initialState: AssessmentState = {
  status: "idle",
  assessmentId: null,
  question: null,
  progress: null,
  pendingOptionId: null,
  error: null,
};

export type AssessmentAction =
  | { type: "LOAD" }
  | { type: "NO_CURRENT" }
  | { type: "CURRENT_FOUND"; assessment: AssessmentRef; question: QuestionDTO | null; progress: Progress }
  | { type: "STARTED"; assessment: AssessmentRef; question: QuestionDTO | null; progress: Progress }
  | { type: "CONTINUE" }
  | { type: "SELECT"; optionId: string }
  | { type: "ANSWERED"; question: QuestionDTO | null; progress: Progress; done: boolean }
  | { type: "BACK_START" }
  | { type: "BACKED"; question: QuestionDTO; progress: Progress }
  | { type: "PAUSED" }
  | { type: "FAILED"; message: string }
  | { type: "DISMISS_ERROR" }
  | { type: "RESET" };

export function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case "LOAD":
      return { ...state, status: "loading", error: null };
    case "NO_CURRENT":
      return { ...initialState, status: "consent" };
    case "CURRENT_FOUND":
      return {
        ...initialState,
        status: action.question ? "resume" : "done",
        assessmentId: action.assessment.id,
        question: action.question,
        progress: action.progress,
      };
    case "STARTED":
      return {
        ...initialState,
        status: action.question ? "question" : "done",
        assessmentId: action.assessment.id,
        question: action.question,
        progress: action.progress,
      };
    case "CONTINUE":
      return state.question ? { ...state, status: "question", error: null } : state;
    case "SELECT":
      if (state.status !== "question") return state;
      return { ...state, status: "submitting", pendingOptionId: action.optionId };
    case "ANSWERED":
      return {
        ...state,
        status: action.done || !action.question ? "done" : "question",
        question: action.question,
        progress: action.progress,
        pendingOptionId: null,
        error: null,
      };
    case "BACK_START":
      if (state.status !== "question") return state;
      return { ...state, status: "submitting", pendingOptionId: null };
    case "BACKED":
      return {
        ...state,
        status: "question",
        question: action.question,
        progress: action.progress,
        pendingOptionId: null,
        error: null,
      };
    case "PAUSED":
      return { ...state, status: "paused", pendingOptionId: null };
    case "FAILED":
      return { ...state, status: "error", error: action.message, pendingOptionId: null };
    case "DISMISS_ERROR":
      return { ...state, status: state.question ? "question" : "consent", error: null };
    case "RESET":
      return { ...initialState, status: "consent" };
  }
}

function toMessage(e: unknown): string {
  return e instanceof ApiError ? errorMessage(e) : errorMessage({ code: "unknown", status: 500 });
}

export function useAssessment() {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });
  /** Ids already deleted by a restart whose follow-up POST failed, so a retry does not DELETE twice. */
  const deletedIds = useRef(new Set<string>());
  const lastAttempt = useRef<(() => Promise<void>) | null>(null);

  /** Runs an API step; remembers it so "Reintentar" can repeat it. */
  const attempt = useCallback(async (step: () => Promise<void>) => {
    lastAttempt.current = step;
    try {
      await step();
    } catch (e) {
      dispatch({ type: "FAILED", message: toMessage(e) });
    }
  }, []);

  const load = useCallback(
    () =>
      attempt(async () => {
        dispatch({ type: "LOAD" });
        const current = await assessmentApi.getCurrent();
        if (!current) dispatch({ type: "NO_CURRENT" });
        else dispatch({ type: "CURRENT_FOUND", ...current });
      }),
    [attempt],
  );

  useEffect(() => {
    let cancelled = false;
    // Defer so the initial render is the quiet "idle" frame and state updates stay out of the effect body.
    queueMicrotask(() => {
      if (!cancelled) void load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const start = useCallback(
    () =>
      attempt(async () => {
        dispatch({ type: "LOAD" });
        const res = await assessmentApi.start(POLICY_VERSION);
        dispatch({ type: "STARTED", ...res });
      }),
    [attempt],
  );

  const restart = useCallback(
    () =>
      attempt(async () => {
        const id = stateRef.current.assessmentId;
        dispatch({ type: "LOAD" });
        if (id && !deletedIds.current.has(id)) {
          await assessmentApi.remove(id);
          deletedIds.current.add(id);
        }
        const res = await assessmentApi.start(POLICY_VERSION);
        dispatch({ type: "STARTED", ...res });
      }),
    [attempt],
  );

  const select = useCallback(
    (optionId: string) => {
      const { status, question, assessmentId } = stateRef.current;
      if (status !== "question" || !question || !assessmentId) return;
      dispatch({ type: "SELECT", optionId });
      void attempt(async () => {
        const res = await assessmentApi.answer(assessmentId, question.id, optionId);
        dispatch({ type: "ANSWERED", ...res });
      });
    },
    [attempt],
  );

  const back = useCallback(() => {
    const { status, assessmentId } = stateRef.current;
    if (status !== "question" || !assessmentId) return;
    dispatch({ type: "BACK_START" });
    void attempt(async () => {
      const res = await assessmentApi.back(assessmentId);
      dispatch({ type: "BACKED", ...res });
    });
  }, [attempt]);

  const pause = useCallback(() => {
    const { status, assessmentId } = stateRef.current;
    if (status !== "question" || !assessmentId) return;
    void attempt(async () => {
      await assessmentApi.pause(assessmentId);
      dispatch({ type: "PAUSED" });
    });
  }, [attempt]);

  const retry = useCallback(() => {
    const step = lastAttempt.current;
    if (step) void attempt(step);
  }, [attempt]);

  return {
    state,
    start,
    restart,
    select,
    back,
    pause,
    retry,
    continueExisting: () => dispatch({ type: "CONTINUE" }),
    dismissError: () => dispatch({ type: "DISMISS_ERROR" }),
  };
}
