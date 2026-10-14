import { describe, expect, it } from "vitest";
import { InMemoryAssessmentRepository } from "./in-memory-repository";

const base = { engineVersion: "1.0.0", bankVersion: "t", policyVersion: "p" };

async function seed(repo: InMemoryAssessmentRepository, owner: { kind: "guest"; guestSessionId: string }, completedAt: Date | null, deleted = false) {
  const rec = await repo.create({ owner, ...base, now: new Date("2026-01-01") });
  const stored = repo.assessments.get(rec.id)!;
  stored.status = completedAt ? "completed" : "in_progress";
  stored.completedAt = completedAt;
  stored.deletedAt = deleted ? new Date() : null;
  return rec.id;
}

describe("findLatestCompletedByOwner (in-memory)", () => {
  const owner = { kind: "guest", guestSessionId: "g1" } as const;

  it("returns the most recently completed, non-deleted assessment of the owner", async () => {
    const repo = new InMemoryAssessmentRepository();
    await seed(repo, owner, new Date("2026-02-01"));
    const newest = await seed(repo, owner, new Date("2026-03-01"));
    await seed(repo, owner, new Date("2026-04-01"), true); // deleted
    await seed(repo, owner, null); // not completed
    await seed(repo, { kind: "guest", guestSessionId: "g2" }, new Date("2026-05-01")); // someone else's
    expect((await repo.findLatestCompletedByOwner(owner))?.id).toBe(newest);
  });

  it("returns null when there is none", async () => {
    expect(await new InMemoryAssessmentRepository().findLatestCompletedByOwner(owner)).toBeNull();
  });
});
