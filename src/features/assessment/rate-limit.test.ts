import { describe, expect, it } from "vitest";
import { createFixedWindowRateLimiter } from "./rate-limit";

describe("fixed window rate limiter", () => {
  it("allows up to the limit, blocks after, resets with the next window", () => {
    let t = 0;
    const rl = createFixedWindowRateLimiter({ limit: 2, windowMs: 10_000, now: () => t });
    expect(rl.check("a").allowed).toBe(true);
    expect(rl.check("a").allowed).toBe(true);
    const blocked = rl.check("a");
    expect(blocked).toEqual({ allowed: false, retryAfterSeconds: 10 });
    t = 4_000;
    expect(rl.check("a").retryAfterSeconds).toBe(6);
    expect(rl.check("b").allowed).toBe(true);
    t = 10_000;
    expect(rl.check("a").allowed).toBe(true);
  });

  it("bounds memory: never tracks more than maxKeys", () => {
    let t = 0;
    const rl = createFixedWindowRateLimiter({ limit: 1, windowMs: 1_000, now: () => t, maxKeys: 3 });
    for (let i = 0; i < 50; i++) rl.check(`k${i}`);
    // oldest keys were dropped, so a very old key starts fresh instead of staying blocked
    expect(rl.check("k0").allowed).toBe(true);
    t = 5_000;
    expect(rl.check("k49").allowed).toBe(true);
  });
});
