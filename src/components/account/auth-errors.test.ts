import { describe, expect, it } from "vitest";
import { NETWORK_ERROR, RATE_LIMITED, signInFailure, signUpFailure } from "./auth-errors";

describe("signInFailure", () => {
  it("is generic for wrong credentials (same answer for unknown email and wrong password)", () => {
    const r = signInFailure({ status: 401, code: "INVALID_EMAIL_OR_PASSWORD" });
    expect(r).toEqual({ ok: false, message: "Correo o contraseña incorrectos." });
  });
  it("reports a rate limit", () => {
    expect(signInFailure({ status: 429 })).toEqual({ ok: false, message: RATE_LIMITED });
  });
  it("flags an unverified email with a specific message and code", () => {
    const r = signInFailure({ status: 403, code: "EMAIL_NOT_VERIFIED" });
    expect(r).toMatchObject({ ok: false, code: "email-not-verified" });
    expect(r.ok === false && r.message).toMatch(/confirmar tu correo/i);
  });
});

describe("signUpFailure", () => {
  it("stays generic about existing accounts", () => {
    const r = signUpFailure({ status: 422, code: "USER_ALREADY_EXISTS" });
    expect(r.ok === false && r.message).not.toMatch(/ya está registrad|ya existe/i);
  });
  it("reports a rate limit", () => {
    expect(signUpFailure({ status: 429 })).toEqual({ ok: false, message: RATE_LIMITED });
  });
});

it("exposes a network message", () => {
  expect(NETWORK_ERROR).toMatch(/conexión/i);
});
