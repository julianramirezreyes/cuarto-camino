import { DEFAULT_ENGINE_CONFIG } from "@/domain/adaptive-engine";

/**
 * Version of the typed question bank in src/content/questions. Stored on every
 * assessment (assessments.bank_version) so old answers are never reinterpreted against
 * a different bank. BUMP IT whenever a question, option, score or weight changes.
 */
export const BANK_VERSION = "1.0.0-draft";

export const ENGINE_VERSION = DEFAULT_ENGINE_CONFIG.engineVersion;
