import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const GUEST_TOKEN_BYTES = 32;

/** 256 bits of CSPRNG output, base64url (43 chars, cookie-safe). Shown to the browser only. */
export function generateGuestToken(): string {
  return randomBytes(GUEST_TOKEN_BYTES).toString("base64url");
}

/** SHA-256 hex digest. The only form of the token that is ever stored. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Constant-time comparison of a presented token against a stored hash.
 * Hashing first makes both buffers the same length, so timingSafeEqual cannot throw
 * and the comparison time does not leak how many leading characters matched.
 */
export function tokenMatchesHash(token: string, storedHash: string): boolean {
  const presented = Buffer.from(hashToken(token), "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (stored.length !== presented.length) return false;
  return timingSafeEqual(presented, stored);
}
