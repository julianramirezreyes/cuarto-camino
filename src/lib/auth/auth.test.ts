import { drizzle } from "drizzle-orm/neon-http";
import { describe, expect, it } from "vitest";
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

  it("uses secure cookies in production only", () => {
    expect(make({ isProduction: true }).options.advanced?.useSecureCookies).toBe(true);
    expect(make({ isProduction: false }).options.advanced?.useSecureCookies).toBe(false);
  });

  it("does not require email verification yet (no provider)", () => {
    expect(make().options.emailAndPassword?.requireEmailVerification).toBe(false);
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
