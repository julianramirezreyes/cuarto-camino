import type { AssessmentReport } from "@/domain/adaptive-engine";
import { buildReport } from "@/domain/adaptive-engine";
import type { EngineConfig, Question } from "@/domain/assessment/types";
import { canAccessAssessment, type Principal as GuestPrincipal } from "@/lib/guest";
import { progressFor, toQuestionDTO, type Progress, type QuestionDTO } from "./dto";
import { AssessmentError } from "./errors";
import type { AssessmentRecord, AssessmentRepository, AssessmentStatus } from "./repository";
import { walkAnswers, type Walk } from "./trail";

/** Authenticated caller of the service (anonymous callers never get this far). */
export type Principal = Exclude<GuestPrincipal, { kind: "anonymous" }>;

export interface AssessmentServiceDeps {
  repo: AssessmentRepository;
  bank: readonly Question[];
  config: EngineConfig;
  /** Version of `bank`; compared with assessments.bank_version before touching answers. */
  bankVersion: string;
  now?: () => Date;
}

export interface AssessmentSummary {
  id: string;
  status: AssessmentStatus;
}

export interface AssessmentView {
  assessment: AssessmentSummary;
  question: QuestionDTO | null;
  progress: Progress;
}

export interface AnswerOutcome {
  question: QuestionDTO | null;
  progress: Progress;
  done: boolean;
}

export interface ResultView {
  report: AssessmentReport;
  engineVersion: string;
  bankVersion: string;
  completedAt: Date;
}

export function createAssessmentService(deps: AssessmentServiceDeps) {
  const { repo, bank, config, bankVersion, now = () => new Date() } = deps;
  const questionsById = new Map(bank.map((q) => [q.id, q]));

  const ownerOf = (p: Principal) =>
    p.kind === "user" ? ({ kind: "user", userId: p.userId } as const) : ({ kind: "guest", guestSessionId: p.guestSessionId } as const);

  /** Foreign, missing and deleted ids are indistinguishable: not_found (404, no enumeration). */
  async function loadOwned(principal: Principal, id: string): Promise<AssessmentRecord> {
    const record = await repo.findById(id);
    if (!record || !canAccessAssessment(record, principal)) throw new AssessmentError("not_found");
    return record;
  }

  /** Answers are only meaningful against the bank/engine they were collected with. */
  function assertInterpretable(record: AssessmentRecord) {
    if (record.bankVersion !== bankVersion || record.engineVersion !== config.engineVersion) {
      throw new AssessmentError("version_mismatch");
    }
  }

  function assertEditable(record: AssessmentRecord) {
    if (record.status === "completed" || record.status === "abandoned") throw new AssessmentError("already_completed");
  }

  async function storedMap(id: string) {
    return new Map((await repo.listAnswers(id)).map((a) => [a.questionId, a.optionId]));
  }

  /**
   * Stores the report once the engine has nothing left to ask. The report is built from
   * the answers ON THE PATH at this moment and is then frozen: later reads return the
   * stored snapshot, never a recomputation (a new engine adds a row, see the schema).
   */
  async function complete(record: AssessmentRecord, walk: Walk) {
    const answers = walk.trail.map((e) => ({ questionId: e.question.id, optionId: e.optionId }));
    const report = buildReport(bank, answers, config);
    await repo.complete({
      assessmentId: record.id,
      report,
      engineVersion: record.engineVersion,
      bankVersion: record.bankVersion,
      now: now(),
    });
  }

  function currentView(record: AssessmentRecord, walk: Walk, status: AssessmentStatus = record.status): AssessmentView {
    // The current question never has a valid stored answer (it would be on the trail).
    return {
      assessment: { id: record.id, status },
      question: walk.next ? toQuestionDTO(walk.next) : null,
      progress: progressFor(walk.trail, walk.trail, walk.next, config),
    };
  }

  async function loadWalk(record: AssessmentRecord) {
    return walkAnswers(bank, config, await storedMap(record.id));
  }

  return {
    async startOrResume(
      principal: Principal,
      consent: { granted: true; policyVersion: string },
    ): Promise<AssessmentView & { resumed: boolean }> {
      if (consent.granted !== true) throw new AssessmentError("consent_required");
      const owner = ownerOf(principal);
      const open = await repo.findOpenByOwner(owner);
      if (open && open.bankVersion === bankVersion && open.engineVersion === config.engineVersion) {
        if (open.status === "paused") await repo.setStatus(open.id, "in_progress", now());
        const walk = await loadWalk(open);
        if (walk.next) return { ...currentView(open, walk, "in_progress"), resumed: true };
        await complete(open, walk); // finished but never closed: fall through to a fresh run
      }
      const record = await repo.create({
        owner,
        engineVersion: config.engineVersion,
        bankVersion,
        policyVersion: consent.policyVersion,
        now: now(),
      });
      const walk = await loadWalk(record);
      return { ...currentView(record, walk), resumed: false };
    },

    async getCurrent(principal: Principal): Promise<AssessmentView> {
      const open = await repo.findOpenByOwner(ownerOf(principal));
      if (!open) throw new AssessmentError("not_found");
      const record = await loadOwned(principal, open.id);
      assertInterpretable(record);
      const walk = await loadWalk(record);
      if (!walk.next) {
        await complete(record, walk);
        throw new AssessmentError("not_found");
      }
      return currentView(record, walk);
    },

    async submitAnswer(principal: Principal, id: string, questionId: string, optionId: string): Promise<AnswerOutcome> {
      const record = await loadOwned(principal, id);
      assertEditable(record);
      assertInterpretable(record);
      const question = questionsById.get(questionId);
      if (!question || !question.options.some((o) => o.id === optionId)) throw new AssessmentError("invalid_answer");

      const stored = await storedMap(id);
      const before = walkAnswers(bank, config, stored);
      const allowed = before.next?.id === questionId || before.trail.some((e) => e.question.id === questionId);
      if (!allowed) throw new AssessmentError("question_not_available");

      if (stored.get(questionId) !== optionId) {
        await repo.upsertAnswer(id, { questionId, optionId }, now());
        stored.set(questionId, optionId);
      }
      const after = walkAnswers(bank, config, stored);
      if (!after.next) {
        await complete(record, after);
        return { question: null, progress: progressFor(after.trail, after.trail, null, config), done: true };
      }
      if (record.status === "paused") await repo.setStatus(id, "in_progress", now());
      return {
        question: toQuestionDTO(after.next),
        progress: progressFor(after.trail, after.trail, after.next, config),
        done: false,
      };
    },

    /**
     * Previous question on the path, with the option already chosen. Stateless: the
     * server keeps no cursor, so to step back repeatedly the client passes the id of
     * the question it is showing (`fromQuestionId`, optional extension of the contract);
     * without it the step is taken from the current question. Nothing is deleted.
     */
    async goBack(
      principal: Principal,
      id: string,
      fromQuestionId?: string,
    ): Promise<{ question: QuestionDTO; progress: Progress }> {
      const record = await loadOwned(principal, id);
      assertEditable(record);
      assertInterpretable(record);
      const walk = await loadWalk(record);
      let index = walk.trail.length;
      if (fromQuestionId !== undefined) {
        const at = walk.trail.findIndex((e) => e.question.id === fromQuestionId);
        if (at >= 0) index = at;
        else if (walk.next?.id !== fromQuestionId) throw new AssessmentError("question_not_available");
      }
      if (index === 0) throw new AssessmentError("no_previous");
      const target = walk.trail[index - 1];
      return {
        question: toQuestionDTO(target.question, target.optionId),
        progress: progressFor(walk.trail, walk.trail.slice(0, index - 1), target.question, config),
      };
    },

    async pause(principal: Principal, id: string): Promise<{ status: "paused" }> {
      const record = await loadOwned(principal, id);
      assertEditable(record);
      await repo.setStatus(id, "paused", now());
      return { status: "paused" };
    },

    async getResult(principal: Principal, id: string): Promise<ResultView> {
      const record = await loadOwned(principal, id);
      if (record.status !== "completed" || !record.completedAt) throw new AssessmentError("not_complete");
      const result = await repo.findResult(id, record.engineVersion);
      if (!result) throw new AssessmentError("not_complete");
      return {
        report: result.report,
        engineVersion: result.engineVersion,
        bankVersion: result.bankVersion,
        completedAt: record.completedAt,
      };
    },

    async deleteAssessment(principal: Principal, id: string): Promise<void> {
      await loadOwned(principal, id);
      await repo.softDelete(id, now());
    },
  };
}

export type AssessmentService = ReturnType<typeof createAssessmentService>;
