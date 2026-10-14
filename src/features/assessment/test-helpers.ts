import { QUESTION_BANK } from "@/content/questions";
import { DEFAULT_ENGINE_CONFIG } from "@/domain/adaptive-engine";
import type { Question } from "@/domain/assessment/types";
import { syntheticRespondent } from "@/tests/fixtures/mini-bank";
import { InMemoryAssessmentRepository } from "./in-memory-repository";
import { createGuestService } from "./guest-service";
import { createAssessmentService } from "./service";
import { BANK_VERSION } from "./versions";

export function makeHarness(start = new Date("2026-01-01T00:00:00Z")) {
  const repo = new InMemoryAssessmentRepository();
  let clock = start.getTime();
  const now = () => new Date(clock);
  const advance = (ms: number) => void (clock += ms);
  const service = createAssessmentService({ repo, bank: QUESTION_BANK, config: DEFAULT_ENGINE_CONFIG, bankVersion: BANK_VERSION, now });
  const guests = createGuestService({ repo, now });
  return { repo, service, guests, now, advance };
}

/** Deterministic respondent biased toward `type` (instinct picked by argmax like the engine tests). */
export function respondent(type: Parameters<typeof syntheticRespondent>[0]["type"] = 5, seed = 1) {
  const base = syntheticRespondent({ type, noise: 0.1, seed, instinct: "so", wingTowardUpper: true });
  return (q: { id: string; module: string; options: Question["options"] }) => {
    const full = QUESTION_BANK.find((x) => x.id === q.id)!;
    if (full.module !== "instinct") return base(full);
    return [...full.options].sort((a, b) => (b.scores.instincts?.so ?? 0) - (a.scores.instincts?.so ?? 0))[0].id;
  };
}

/** Any option id of a question that differs from `not`. */
export function otherOption(questionId: string, not: string): string {
  const q = QUESTION_BANK.find((x) => x.id === questionId)!;
  return q.options.find((o) => o.id !== not)!.id;
}
