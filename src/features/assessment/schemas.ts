import { z } from "zod";

/** Stable ids from the typed question bank, e.g. "q-type-001" / "opt-a". */
const bankId = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "invalid id");

/** HTTP contract bodies. All strict: unknown keys are rejected. */
export const startBody = z.strictObject({
  consent: z.literal(true, { error: "Consent is required to start the assessment." }),
  policyVersion: z.string().min(1).max(32),
});

export const answerBody = z.strictObject({ questionId: bankId, optionId: bankId });

/** Optional body: the question the client is currently showing (to step back repeatedly). */
export const backBody = z.strictObject({ questionId: bankId.optional() });

export const assessmentIdParam = z.uuid();

export type StartBody = z.infer<typeof startBody>;
