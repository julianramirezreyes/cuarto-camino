import { describe, expect, it } from "vitest";
import { passwordResetRedirect, verificationCallbackURL } from "./auth-urls";

describe("verificationCallbackURL", () => {
  it("returns to the sign-in page flagged as verified", () => {
    expect(verificationCallbackURL(null)).toBe("/cuenta/entrar?verificado=1");
  });
  it("keeps a safe next and drops an unsafe one", () => {
    expect(verificationCallbackURL("/resultado")).toBe("/cuenta/entrar?verificado=1&next=%2Fresultado");
    expect(verificationCallbackURL("//evil.example")).toBe("/cuenta/entrar?verificado=1");
    expect(verificationCallbackURL("https://evil.example")).toBe("/cuenta/entrar?verificado=1");
  });
});

it("password reset lands on the reset page", () => {
  expect(passwordResetRedirect()).toBe("/cuenta/restablecer");
});
