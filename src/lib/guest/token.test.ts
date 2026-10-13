import { describe, expect, it } from "vitest";
import { generateGuestToken, hashToken, tokenMatchesHash } from "./token";

describe("guest token", () => {
  it("is 32 random bytes encoded as base64url", () => {
    const t = generateGuestToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(Buffer.from(t, "base64url")).toHaveLength(32);
  });

  it("is unguessable in practice: no collisions across many tokens", () => {
    const seen = new Set(Array.from({ length: 5000 }, generateGuestToken));
    expect(seen.size).toBe(5000);
  });

  it("hashes to a stable 64-char hex SHA-256 that differs from the token", () => {
    const h = hashToken("abc");
    expect(h).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(hashToken("abc")).toBe(h);
  });

  it("matches only the right token", () => {
    const t = generateGuestToken();
    const stored = hashToken(t);
    expect(tokenMatchesHash(t, stored)).toBe(true);
    expect(tokenMatchesHash(generateGuestToken(), stored)).toBe(false);
    expect(tokenMatchesHash("", stored)).toBe(false);
  });

  it("never throws on malformed stored hashes", () => {
    expect(tokenMatchesHash("x", "")).toBe(false);
    expect(tokenMatchesHash("x", "zz")).toBe(false);
    expect(tokenMatchesHash("x", "ab".repeat(100))).toBe(false);
  });
});
