import { DEFAULT_ENGINE_CONFIG } from "@/domain/adaptive-engine";

/**
 * Version of the typed question bank in src/content/questions. Stored on every
 * assessment (assessments.bank_version) so old answers are never reinterpreted against
 * a different bank. BUMP IT whenever a question, option, score or weight changes.
 */
/**
 * History: 1.0.0-draft (150 questions) -> 1.1.0-draft (177: 3 more wing questions per main type, 6 each)
 * -> 1.1.1-draft (instinct choice options rotated so no instinct always comes first)
 * -> 1.2.0-draft (188: bias fixes from the audit: reverse-keyed type and instinct items, balanced secondary mass, neutral wing options).
 * Assessments left open under an older version are not resumable (see service.getCurrent): they start fresh.
 */
export const BANK_VERSION = "1.2.0-draft";

export const ENGINE_VERSION = DEFAULT_ENGINE_CONFIG.engineVersion;
