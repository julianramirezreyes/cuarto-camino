import { describe, expect, it } from "vitest";
import { guestCookieName, guestCookieOptions } from "./cookie";
import {
  GUEST_IDLE_TTL_SECONDS,
  guestExpiresAt,
  isGuestExpired,
  shouldTouchGuest,
} from "./policy";

describe("guest cookie", () => {
  it("is httpOnly, lax, path / and secure in production", () => {
    expect(guestCookieOptions(true)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_IDLE_TTL_SECONDS,
    });
    expect(guestCookieOptions(false).secure).toBe(false);
  });
  it("uses the __Host- prefix only when secure", () => {
    expect(guestCookieName(true)).toBe("__Host-cc_guest");
    expect(guestCookieName(false)).toBe("cc_guest");
  });
  it("max age equals the 30 day idle policy", () => {
    expect(GUEST_IDLE_TTL_SECONDS).toBe(30 * 86400);
  });
});

describe("guest expiry policy", () => {
  const t0 = new Date("2026-01-01T00:00:00Z");
  it("expires 30 days after the reference time", () => {
    expect(guestExpiresAt(t0).toISOString()).toBe("2026-01-31T00:00:00.000Z");
  });
  it("is expired at and after expiresAt, not before", () => {
    const s = { expiresAt: guestExpiresAt(t0) };
    expect(isGuestExpired(s, new Date(s.expiresAt.getTime() - 1))).toBe(false);
    expect(isGuestExpired(s, s.expiresAt)).toBe(true);
  });
  it("touches at most once per hour", () => {
    const s = { lastSeenAt: t0 };
    expect(shouldTouchGuest(s, new Date(t0.getTime() + 59 * 60_000))).toBe(
      false,
    );
    expect(shouldTouchGuest(s, new Date(t0.getTime() + 60 * 60_000))).toBe(
      true,
    );
  });
});
