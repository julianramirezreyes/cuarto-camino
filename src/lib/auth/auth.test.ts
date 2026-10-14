import { drizzle } from "drizzle-orm/neon-http";
import { describe, expect, it, vi } from "vitest";
import type { EmailMessage, EmailTransport } from "@/lib/email/types";
import * as schema from "@/lib/db/schema";
import { createAuth } from "./auth";
import { MIN_AUTH_SECRET_LENGTH, resolveAuthSecret, resolveTrustedOrigins } from "./config";

describe("resolveAuthSecret", () => {
  it("fails clearly when missing or too short", () => {
    expect(() => resolveAuthSecret({})).toThrow(/AUTH_SECRET is not set/);
    expect(() => resolveAuthSecret({ AUTH_SECRET: "short" })).toThrow(
      /at least/,
    );
  });
  it("returns a long enough secret", () => {
    const s = "x".repeat(MIN_AUTH_SECRET_LENGTH);
    expect(resolveAuthSecret({ AUTH_SECRET: s })).toBe(s);
  });
});

describe("createAuth (no live database)", () => {
  it("builds against our drizzle schema without connecting", async () => {
    const db = drizzle.mock({ schema });
    const auth = createAuth({
      db,
      secret: "x".repeat(40),
      baseURL: "http://localhost:3000",
    });
    expect(typeof auth.handler).toBe("function");
    expect(auth.options.emailAndPassword?.enabled).toBe(true);
    expect(auth.options.advanced?.database?.generateId).toBe("uuid");
  });
});

describe("createAuth hardening", () => {
  const make = (extra: Partial<Parameters<typeof createAuth>[0]> = {}) =>
    createAuth({
      db: drizzle.mock({ schema }),
      secret: "x".repeat(40),
      baseURL: "http://localhost:3000",
      ...extra,
    });

  it("enables account deletion", () => {
    expect(make().options.user?.deleteUser?.enabled).toBe(true);
  });

  it("passes the trusted origins through", () => {
    const auth = make({ trustedOrigins: ["https://app.example"] });
    expect(auth.options.trustedOrigins).toEqual(["https://app.example"]);
  });

  it("keeps rate limiting on (even outside production) with stricter credential endpoints", () => {
    const rl = make().options.rateLimit;
    expect(rl?.enabled).toBe(true);
    expect(Object.keys(rl?.customRules ?? {})).toEqual(
      expect.arrayContaining(["/sign-in/email", "/sign-up/email"]),
    );
  });

  it("stores the auth rate-limit counters in Postgres (shared across serverless instances)", () => {
    expect(make().options.rateLimit?.storage).toBe("database");
  });

  it("uses secure cookies in production only", () => {
    expect(make({ isProduction: true }).options.advanced?.useSecureCookies).toBe(true);
    expect(make({ isProduction: false }).options.advanced?.useSecureCookies).toBe(false);
  });

  it("without an email transport behaves as before: no verification, no reset flow", () => {
    const o = make();
    expect(o.options.emailAndPassword?.requireEmailVerification).toBe(false);
    expect(o.options.emailAndPassword?.sendResetPassword).toBeUndefined();
    expect(o.options.emailVerification?.sendOnSignUp).toBeFalsy();
    expect(o.options.emailVerification?.sendVerificationEmail).toBeUndefined();
  });

  it("keeps the password rules unchanged (min 10)", () => {
    expect(make().options.emailAndPassword?.minPasswordLength).toBe(10);
    expect(make({ emailTransport: fakeTransport().transport }).options.emailAndPassword?.minPasswordLength).toBe(10);
  });
});

function fakeTransport() {
  const sent: EmailMessage[] = [];
  const transport: EmailTransport = { send: async (m) => void sent.push(m) };
  return { transport, sent };
}

describe("createAuth with an email transport", () => {
  const user = { id: "u1", name: "Ana", email: "ana@example.com", emailVerified: false } as never;
  const make = () => {
    const { transport, sent } = fakeTransport();
    const pending: Promise<void>[] = [];
    const auth = createAuth({
      db: drizzle.mock({ schema }),
      secret: "x".repeat(40),
      baseURL: "http://localhost:3000",
      emailTransport: transport,
      schedule: (p) => void pending.push(p),
    });
    return { auth, sent, flush: () => Promise.all(pending) };
  };

  it("requires verified email, sends on sign-up and signs in after verification", () => {
    const { auth } = make();
    expect(auth.options.emailAndPassword?.requireEmailVerification).toBe(true);
    expect(auth.options.emailVerification?.sendOnSignUp).toBe(true);
    expect(auth.options.emailVerification?.autoSignInAfterVerification).toBe(true);
  });

  it("expires verification and reset tokens in one hour and revokes sessions on reset", () => {
    const { auth } = make();
    expect(auth.options.emailVerification?.expiresIn).toBe(3600);
    expect(auth.options.emailAndPassword?.resetPasswordTokenExpiresIn).toBe(3600);
    expect(auth.options.emailAndPassword?.revokeSessionsOnPasswordReset).toBe(true);
  });

  it("sends the verification mail after the response (scheduled, not awaited inline)", async () => {
    const { auth, sent, flush } = make();
    await auth.options.emailVerification!.sendVerificationEmail!({ user, url: "https://x.test/v?t=1", token: "t" });
    await flush();
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: "ana@example.com", subject: "Confirma tu correo" });
    expect(sent[0].text).toContain("https://x.test/v?t=1");
  });

  it("sends the reset mail and a password-changed notice", async () => {
    const { auth, sent, flush } = make();
    await auth.options.emailAndPassword!.sendResetPassword!({ user, url: "https://x.test/r/1", token: "t" });
    await auth.options.emailAndPassword!.onPasswordReset!({ user });
    await flush();
    expect(sent.map((m) => m.subject)).toEqual(["Restablece tu contraseña", "Cambiaste tu contraseña"]);
  });

  it("a failing transport never makes the callback throw", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const auth = createAuth({
      db: drizzle.mock({ schema }),
      secret: "x".repeat(40),
      emailTransport: { send: async () => Promise.reject(new Error("smtp down")) },
      schedule: (p) => void p,
    });
    await expect(
      auth.options.emailVerification!.sendVerificationEmail!({ user, url: "https://x.test", token: "t" }),
    ).resolves.toBeUndefined();
  });
});

describe("resolveTrustedOrigins", () => {
  it("collects origins from BETTER_AUTH_URL and APP_URL, dedupes and ignores junk", () => {
    expect(
      resolveTrustedOrigins({
        BETTER_AUTH_URL: "https://app.example/some/path",
        APP_URL: "https://app.example",
      }),
    ).toEqual(["https://app.example"]);
    expect(resolveTrustedOrigins({ APP_URL: "not a url", BETTER_AUTH_URL: "" })).toEqual([]);
    expect(resolveTrustedOrigins({ APP_URL: "http://localhost:3000" })).toEqual(["http://localhost:3000"]);
  });
});
