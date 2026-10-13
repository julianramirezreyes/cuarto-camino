import { z } from "zod";

/** Stable ids from the typed question bank, e.g. "q-type-001" / "opt-a". */
const bankId = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "invalid id");

const assessmentId = z.uuid();

/** Start requires explicit, affirmative consent to a named policy version. */
export const startAssessmentInput = z.strictObject({
  consent: z.strictObject({
    granted: z.literal(true, {
      error: "Consent is required to start the assessment.",
    }),
    policyVersion: z.string().min(1).max(32),
  }),
});

export const submitAnswerInput = z.strictObject({
  assessmentId,
  questionId: bankId,
  optionId: bankId,
});

export const pauseAssessmentInput = z.strictObject({ assessmentId });

/** The guest token travels in the httpOnly cookie, never in the body. */
export const claimGuestDataInput = z.strictObject({ confirm: z.literal(true) });

export const deleteDataInput = z.discriminatedUnion("scope", [
  z.strictObject({
    scope: z.literal("assessment"),
    assessmentId,
    confirm: z.literal(true),
  }),
  z.strictObject({ scope: z.literal("all"), confirm: z.literal(true) }),
]);

export type StartAssessmentInput = z.infer<typeof startAssessmentInput>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerInput>;
export type PauseAssessmentInput = z.infer<typeof pauseAssessmentInput>;
export type ClaimGuestDataInput = z.infer<typeof claimGuestDataInput>;
export type DeleteDataInput = z.infer<typeof deleteDataInput>;
