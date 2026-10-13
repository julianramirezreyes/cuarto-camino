/**
 * Better Auth configuration (server-only). Everything is a factory: importing this
 * module never touches the database, env vars or network, so `next build` works with
 * no credentials. The singleton is created on first call of getAuth().
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, type Database } from "@/lib/db/client";
import { account, session, user, verification } from "@/lib/db/schema";
import { resolveAuthSecret } from "./config";

export interface AuthFactoryOptions {
  /** Drizzle database. Any pg-flavoured drizzle instance works (tests pass a mock). */
  db: Database;
  secret: string;
  baseURL?: string;
}

export function createAuth({ db, secret, baseURL }: AuthFactoryOptions) {
  return betterAuth({
    secret,
    baseURL,
    database: drizzleAdapter(db, {
      provider: "pg",
      // Explicit mapping: Better Auth model name -> our drizzle table.
      schema: { user, session, account, verification },
    }),
    // Native uuid primary keys (matches the migration; DB default gen_random_uuid()).
    advanced: { database: { generateId: "uuid" } },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      // Enable once an email provider exists (verification mail would otherwise be dropped).
      requireEmailVerification: false,
    },
    // nextCookies must stay last: lets server actions set the session cookie.
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | undefined;

/** Lazy singleton: reads DATABASE_URL / AUTH_SECRET / BETTER_AUTH_URL only when first used. */
export function getAuth(): Auth {
  instance ??= createAuth({
    db: getDb(),
    secret: resolveAuthSecret(),
    baseURL: process.env.BETTER_AUTH_URL,
  });
  return instance;
}
