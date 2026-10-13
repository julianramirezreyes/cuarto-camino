import { drizzle } from "drizzle-orm/neon-http";
import { describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { createAuth } from "./auth";
import { MIN_AUTH_SECRET_LENGTH, resolveAuthSecret } from "./config";

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
