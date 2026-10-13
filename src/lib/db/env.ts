export class MissingEnvError extends Error {
  constructor(readonly variable: string) {
    super(
      `${variable} is not set. Copy .env.example to .env.local and fill it in ` +
        `(Neon pooled connection string for DATABASE_URL).`,
    );
    this.name = "MissingEnvError";
  }
}

/** Returns DATABASE_URL or throws a clear MissingEnvError. Pure: takes the env as input. */
export function requireDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const url = env.DATABASE_URL?.trim();
  if (!url) throw new MissingEnvError("DATABASE_URL");
  return url;
}
