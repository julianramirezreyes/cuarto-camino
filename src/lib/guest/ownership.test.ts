import { describe, expect, it } from "vitest";
import {
  authorizeGuestClaim,
  canAccessAssessment,
  type Principal,
} from "./ownership";
import { generateGuestToken, hashToken } from "./token";

const guestA: Principal = { kind: "guest", guestSessionId: "g-a" };
const guestB: Principal = { kind: "guest", guestSessionId: "g-b" };
const userA: Principal = { kind: "user", userId: "u-a" };
const userB: Principal = { kind: "user", userId: "u-b" };

describe("canAccessAssessment", () => {
  const guestOwned = { userId: null, guestSessionId: "g-a" };
  const userOwned = { userId: "u-a", guestSessionId: null };

  it("lets a guest read only its own assessment", () => {
    expect(canAccessAssessment(guestOwned, guestA)).toBe(true);
    expect(canAccessAssessment(guestOwned, guestB)).toBe(false);
    expect(canAccessAssessment(userOwned, guestA)).toBe(false);
  });
  it("lets a user read only its own assessment", () => {
    expect(canAccessAssessment(userOwned, userA)).toBe(true);
    expect(canAccessAssessment(userOwned, userB)).toBe(false);
  });
  it("does not let a user reach guest data without claiming it", () => {
    expect(canAccessAssessment(guestOwned, userA)).toBe(false);
  });
  it("denies anonymous principals", () => {
    expect(canAccessAssessment(guestOwned, { kind: "anonymous" })).toBe(false);
  });
  it("denies soft-deleted assessments to everyone", () => {
    expect(
      canAccessAssessment({ ...userOwned, deletedAt: new Date() }, userA),
    ).toBe(false);
  });
  it("denies malformed ownership (both or neither owner)", () => {
    expect(
      canAccessAssessment({ userId: "u-a", guestSessionId: "g-a" }, userA),
    ).toBe(false);
    expect(
      canAccessAssessment({ userId: null, guestSessionId: null }, guestA),
    ).toBe(false);
  });
});

describe("authorizeGuestClaim", () => {
  const now = new Date("2026-02-01T00:00:00Z");
  const token = generateGuestToken();
  const session = {
    id: "g-a",
    tokenHash: hashToken(token),
    expiresAt: new Date("2026-03-01T00:00:00Z"),
    claimedByUserId: null as string | null,
  };

  it("lets the holder of the current cookie claim", () => {
    expect(
      authorizeGuestClaim({ session, presentedToken: token, now }),
    ).toEqual({
      ok: true,
      guestSessionId: "g-a",
    });
  });
  it("rejects a missing or wrong token", () => {
    expect(
      authorizeGuestClaim({ session, presentedToken: undefined, now }),
    ).toEqual({
      ok: false,
      reason: "token_mismatch",
    });
    expect(
      authorizeGuestClaim({
        session,
        presentedToken: generateGuestToken(),
        now,
      }),
    ).toEqual({
      ok: false,
      reason: "token_mismatch",
    });
  });
  it("rejects a second claim, even with the right token", () => {
    expect(
      authorizeGuestClaim({
        session: { ...session, claimedByUserId: "u-a" },
        presentedToken: token,
        now,
      }),
    ).toEqual({ ok: false, reason: "already_claimed" });
  });
  it("rejects an expired session", () => {
    expect(
      authorizeGuestClaim({
        session: { ...session, expiresAt: now },
        presentedToken: token,
        now,
      }),
    ).toEqual({ ok: false, reason: "expired" });
  });
});
