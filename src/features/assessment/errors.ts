export type AssessmentErrorCode =
  | "not_found"
  | "not_complete"
  | "already_completed"
  | "question_not_available"
  | "no_previous"
  | "version_mismatch"
  | "invalid_answer"
  | "consent_required";

/** Domain error raised by the service. The HTTP layer maps `code` to a status. */
export class AssessmentError extends Error {
  constructor(readonly code: AssessmentErrorCode) {
    super(code);
    this.name = "AssessmentError";
  }
}
