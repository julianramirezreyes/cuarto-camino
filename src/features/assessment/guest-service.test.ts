import { describe, expect, it } from "vitest";
import { GUEST_IDLE_TTL_MS } from "@/lib/guest";
import { makeHarness } from "./test-helpers";

const consent = { granted: true as const, policyVersion: "2026-01" };

describe("guest sessions", () => {
  it("issue stores only the hash and resolve finds the session by token", async () => {
    const h = makeHarness();
    const { token, guestSessionId } = await h.guests.issue();
    const stored = [...h.repo.guests.values()][0];
    expect(stored.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify([...h.repo.guests.values()])).not.toContain(token);
    expect(await h.guests.resolve(token)).toEqual({ guestSessionId, refreshed: false });
    expect(await h.guests.resolve(undefined)).toBeNull();
    expect(await h.guests.resolve("not-a-token")).toBeNull();
  });

  it("slides the expiry (refreshed) and rejects an expired session", async () => {
    const h = makeHarness();
    const { token } = await h.guests.issue();
    h.advance(2 * 60 * 60 * 1000);
    expect((await h.guests.resolve(token))?.refreshed).toBe(true);
    h.advance(GUEST_IDLE_TTL_MS + 1000);
    expect(await h.guests.resolve(token)).toBeNull();
  });
});

describe("claim guest -> user", () => {
  async function guestWithAssessment() {
    const h = makeHarness();
    const { token, guestSessionId } = await h.guests.issue();
    const started = await h.service.startOrResume({ kind: "guest", guestSessionId }, consent);
    return { h, token, guestSessionId, assessmentId: started.assessment.id };
  }

  it("the cookie holder claims once: assessments and consent move to the user", async () => {
    const { h, token, guestSessionId, assessmentId } = await guestWithAssessment();
    const r = await h.guests.claim("u1", token);
    expect(r).toEqual({ claimed: 1, outcome: "claimed" });
    const a = h.repo.assessments.get(assessmentId)!;
    expect(a.userId).toBe("u1");
    expect(a.guestSessionId).toBeNull(); // single owner invariant
    expect(h.repo.consents).toEqual([{ userId: "u1", guestSessionId: null, policyVersion: "2026-01" }]);
    expect(h.repo.guests.get(guestSessionId)?.claimedByUserId).toBe("u1");
    // now reachable as the user, no longer as the guest
    expect((await h.service.getCurrent({ kind: "user", userId: "u1" })).assessment.id).toBe(assessmentId);
    expect(await h.guests.resolve(token)).toBeNull();
  });

  it("cannot be claimed twice, not even by the same user", async () => {
    const { h, token } = await guestWithAssessment();
    await h.guests.claim("u1", token);
    expect(await h.guests.claim("u1", token)).toEqual({ claimed: 0, outcome: "already_claimed" });
  });

  it("another user cannot take a session that was already claimed, with the leaked token", async () => {
    const { h, token, assessmentId } = await guestWithAssessment();
    await h.guests.claim("u1", token);
    expect((await h.guests.claim("u2", token)).claimed).toBe(0);
    expect(h.repo.assessments.get(assessmentId)?.userId).toBe("u1");
  });

  it("without the cookie token, or with a wrong one, nothing is claimed", async () => {
    const { h, assessmentId } = await guestWithAssessment();
    expect(await h.guests.claim("u1", undefined)).toEqual({ claimed: 0, outcome: "no_token" });
    expect(await h.guests.claim("u1", "A".repeat(43))).toEqual({ claimed: 0, outcome: "unknown_session" });
    expect(h.repo.assessments.get(assessmentId)?.userId).toBeNull();
  });

  it("an expired guest session cannot be claimed", async () => {
    const { h, token } = await guestWithAssessment();
    h.advance(GUEST_IDLE_TTL_MS + 1000);
    expect(await h.guests.claim("u1", token)).toEqual({ claimed: 0, outcome: "expired" });
  });

  it("two concurrent claims: exactly one wins, the guard decides", async () => {
    const { h, token, assessmentId } = await guestWithAssessment();
    const [a, b] = await Promise.all([h.guests.claim("u1", token), h.guests.claim("u2", token)]);
    const winners = [a, b].filter((r) => r.outcome === "claimed");
    expect(winners).toHaveLength(1);
    const owner = h.repo.assessments.get(assessmentId)!.userId;
    expect(owner).toBe(a.outcome === "claimed" ? "u1" : "u2");
  });

  it("deleted guest assessments are not moved", async () => {
    const { h, token, assessmentId } = await guestWithAssessment();
    h.repo.assessments.get(assessmentId)!.deletedAt = h.now();
    expect(await h.guests.claim("u1", token)).toEqual({ claimed: 0, outcome: "claimed" });
    expect(h.repo.assessments.get(assessmentId)?.userId).toBeNull();
  });
});
