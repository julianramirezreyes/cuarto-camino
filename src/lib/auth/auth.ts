/**
 * Better Auth configuration (server-only). Everything is a factory: importing this
 * module never touches the database, env vars or network, so `next build` works with
 * no credentials. The singleton is created on first call of getAuth().
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { dispatchEmail } from "@/lib/email/dispatch";
import { getEmailTransport } from "@/lib/email";
import { buildPasswordChangedEmail, buildPasswordResetEmail, buildVerificationEmail } from "@/lib/email/templates";
import type { EmailTransport } from "@/lib/email/types";
import { getDb, type Database } from "@/lib/db/client";
import { account, rateLimit, session, user, verification } from "@/lib/db/schema";
import { resolveAuthSecret, resolveTrustedOrigins } from "./config";

export interface AuthFactoryOptions {
  /** Drizzle database. Any pg-flavoured drizzle instance works (tests pass a mock). */
  db: Database;
  secret: string;
  baseURL?: string;
  /** Origins allowed to call the auth endpoints (CSRF/origin check). */
  trustedOrigins?: string[];
  /** Secure cookies. Defaults to NODE_ENV === "production". */
  isProduction?: boolean;
  /**
   * Mail transport. When null/undefined email is off and the behaviour is exactly the legacy one
   * (no verification required, no reset flow) so a deployment without SMTP never locks users out.
   */
  emailTransport?: EmailTransport | null;
  /** How a send is kept alive after the response (default: Next's after()). Tests inject their own. */
  schedule?: (task: Promise<void>) => void;
}

/** Verification and reset links both live one hour (seconds, as Better Auth expects). */
export const EMAIL_TOKEN_TTL_SECONDS = 60 * 60;

export function createAuth({
  db,
  secret,
  baseURL,
  trustedOrigins,
  isProduction = process.env.NODE_ENV === "production",
  emailTransport = null,
  schedule,
}: AuthFactoryOptions) {
  const send = emailTransport
    ? (message: Parameters<typeof dispatchEmail>[1]) => dispatchEmail(emailTransport, message, { schedule })
    : null;
  return betterAuth({
    secret,
    baseURL,
    trustedOrigins,
    database: drizzleAdapter(db, {
      provider: "pg",
      // Explicit mapping: Better Auth model name -> our drizzle table.
      schema: { user, session, account, verification, rateLimit },
    }),
    // Native uuid primary keys (matches the migration; DB default gen_random_uuid()).
    advanced: {
      database: { generateId: "uuid" },
      // Better Auth only turns this on by itself for an https baseURL; be explicit in production.
      useSecureCookies: isProduction,
    },
    user: {
      // Self-service "delete my account". Requires the password (or a fresh session); the FKs
      // (ON DELETE CASCADE) remove sessions, accounts, assessments, results and consents.
      deleteUser: { enabled: true },
    },
    // On by default only in production; keep it on everywhere. Counters live in Postgres
    // (table auth_rate_limit) so the limit holds across serverless instances.
    // Credential endpoints get a tighter budget.
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 10,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 5 },
        "/delete-user": { window: 60, max: 5 },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      // Only when mail can actually be delivered; otherwise unverified users would be locked out.
      requireEmailVerification: send !== null,
      resetPasswordTokenExpiresIn: EMAIL_TOKEN_TTL_SECONDS,
      revokeSessionsOnPasswordReset: true,
      ...(send && {
        // Sending is scheduled after the response, so the reset request answers in the same
        // time (and with the same body) whether or not the address exists.
        sendResetPassword: async ({ user, url }) =>
          send(buildPasswordResetEmail({ to: user.email, name: user.name, url })),
        onPasswordReset: async ({ user }) =>
          send(buildPasswordChangedEmail({ to: user.email, name: user.name })),
      }),
    },
    ...(send && {
      emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: EMAIL_TOKEN_TTL_SECONDS,
        sendVerificationEmail: async ({ user, url }) =>
          send(buildVerificationEmail({ to: user.email, name: user.name, url })),
      },
    }),
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
    trustedOrigins: resolveTrustedOrigins(),
    emailTransport: getEmailTransport(),
  });
  return instance;
}
