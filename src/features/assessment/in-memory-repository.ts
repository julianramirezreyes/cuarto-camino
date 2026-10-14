import { randomUUID } from "node:crypto";
import {
  OPEN_STATUSES,
  type AssessmentRecord,
  type AssessmentRepository,
  type CompleteAssessmentInput,
  type CreateAssessmentInput,
  type GuestSessionRecord,
  type Owner,
  type ResultRecord,
  type StoredAnswer,
} from "./repository";

interface ConsentRow {
  userId: string | null;
  guestSessionId: string | null;
  policyVersion: string;
}

/** Test adapter. Same observable behaviour as the Drizzle one (incl. the claim guard). */
export class InMemoryAssessmentRepository implements AssessmentRepository {
  readonly assessments = new Map<string, AssessmentRecord>();
  readonly answers = new Map<string, Map<string, string>>();
  readonly results = new Map<string, ResultRecord[]>();
  readonly guests = new Map<string, GuestSessionRecord>();
  readonly consents: ConsentRow[] = [];

  async findById(id: string) {
    const a = this.assessments.get(id);
    return a ? { ...a } : null;
  }

  async findOpenByOwner(owner: Owner) {
    const open = [...this.assessments.values()]
      .filter(
        (a) =>
          a.deletedAt === null &&
          (OPEN_STATUSES as readonly string[]).includes(a.status) &&
          (owner.kind === "user" ? a.userId === owner.userId : a.guestSessionId === owner.guestSessionId),
      )
      .sort((x, y) => y.startedAt.getTime() - x.startedAt.getTime());
    return open[0] ? { ...open[0] } : null;
  }

  async findLatestCompletedByOwner(owner: Owner) {
    const done = [...this.assessments.values()]
      .filter(
        (a) =>
          a.deletedAt === null &&
          a.status === "completed" &&
          a.completedAt !== null &&
          (owner.kind === "user" ? a.userId === owner.userId : a.guestSessionId === owner.guestSessionId),
      )
      .sort((x, y) => (y.completedAt?.getTime() ?? 0) - (x.completedAt?.getTime() ?? 0));
    return done[0] ? { ...done[0] } : null;
  }

  async create(input: CreateAssessmentInput) {
    const userId = input.owner.kind === "user" ? input.owner.userId : null;
    const guestSessionId = input.owner.kind === "guest" ? input.owner.guestSessionId : null;
    const record: AssessmentRecord = {
      id: randomUUID(),
      userId,
      guestSessionId,
      status: "in_progress",
      engineVersion: input.engineVersion,
      bankVersion: input.bankVersion,
      startedAt: input.now,
      completedAt: null,
      deletedAt: null,
    };
    this.assessments.set(record.id, record);
    this.answers.set(record.id, new Map());
    this.consents.push({ userId, guestSessionId, policyVersion: input.policyVersion });
    return { ...record };
  }

  async listAnswers(assessmentId: string): Promise<StoredAnswer[]> {
    return [...(this.answers.get(assessmentId) ?? [])].map(([questionId, optionId]) => ({ questionId, optionId }));
  }

  async upsertAnswer(assessmentId: string, answer: StoredAnswer) {
    this.answers.get(assessmentId)?.set(answer.questionId, answer.optionId);
  }

  async setStatus(assessmentId: string, status: "in_progress" | "paused") {
    const a = this.assessments.get(assessmentId);
    if (a) a.status = status;
  }

  async complete(input: CompleteAssessmentInput) {
    const a = this.assessments.get(input.assessmentId);
    if (!a) return;
    const list = this.results.get(a.id) ?? [];
    if (!list.some((r) => r.engineVersion === input.engineVersion)) {
      list.push({ report: input.report, engineVersion: input.engineVersion, bankVersion: input.bankVersion, createdAt: input.now });
    }
    this.results.set(a.id, list);
    if (a.status !== "completed") {
      a.status = "completed";
      a.completedAt = input.now;
    }
  }

  async findResult(assessmentId: string, engineVersion: string) {
    return this.results.get(assessmentId)?.find((r) => r.engineVersion === engineVersion) ?? null;
  }

  async softDelete(assessmentId: string, now: Date) {
    const a = this.assessments.get(assessmentId);
    if (a) a.deletedAt = now;
  }

  async findGuestSessionByTokenHash(tokenHash: string) {
    const g = [...this.guests.values()].find((s) => s.tokenHash === tokenHash);
    return g ? { ...g } : null;
  }

  async createGuestSession(input: { tokenHash: string; now: Date; expiresAt: Date }) {
    const g: GuestSessionRecord = {
      id: randomUUID(),
      tokenHash: input.tokenHash,
      lastSeenAt: input.now,
      expiresAt: input.expiresAt,
      claimedByUserId: null,
    };
    this.guests.set(g.id, g);
    return { ...g };
  }

  async touchGuestSession(id: string, now: Date, expiresAt: Date) {
    const g = this.guests.get(id);
    if (g) {
      g.lastSeenAt = now;
      g.expiresAt = expiresAt;
    }
  }

  async claimGuestSession({ guestSessionId, userId }: { guestSessionId: string; userId: string; now: Date }) {
    const g = this.guests.get(guestSessionId);
    // Equivalent of: UPDATE guest_sessions ... WHERE id = $g AND claimed_by_user_id IS NULL
    if (!g || g.claimedByUserId !== null) return null;
    g.claimedByUserId = userId;
    let moved = 0;
    for (const a of this.assessments.values()) {
      if (a.guestSessionId === guestSessionId && a.deletedAt === null) {
        a.userId = userId;
        a.guestSessionId = null; // same step: the single-owner invariant never breaks
        moved++;
      }
    }
    for (const c of this.consents) {
      if (c.guestSessionId === guestSessionId) {
        c.userId = userId;
        c.guestSessionId = null;
      }
    }
    return { assessmentsMoved: moved };
  }
}
