export const MIN_AUTH_SECRET_LENGTH = 32;

/** Pure: reads AUTH_SECRET from the given env and enforces a minimum length. */
export function resolveAuthSecret(
  env: Record<string, string | undefined> = process.env,
): string {
  const secret = env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Generate one with: openssl rand -base64 32",
    );
  }
  if (secret.length < MIN_AUTH_SECRET_LENGTH) {
    throw new Error(
      `AUTH_SECRET must be at least ${MIN_AUTH_SECRET_LENGTH} characters.`,
    );
  }
  return secret;
}

/** Pure: the set of origins allowed to call the auth endpoints (BETTER_AUTH_URL and APP_URL). */
export function resolveTrustedOrigins(
  env: Record<string, string | undefined> = process.env,
): string[] {
  const origins = new Set<string>();
  for (const raw of [env.BETTER_AUTH_URL, env.APP_URL]) {
    if (!raw) continue;
    try {
      origins.add(new URL(raw).origin);
    } catch {
      /* ignore malformed values */
    }
  }
  return [...origins];
}
