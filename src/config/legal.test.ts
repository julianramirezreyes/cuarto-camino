import { describe, expect, it } from "vitest";
import { LEGAL, isSafeUrl, pendingLegalFields, type LegalConfig } from "./legal";

const complete: LegalConfig = {
  controllerName: "Mi Proyecto S.A.S.",
  controllerEmail: "privacidad@example.com",
  privacyPolicyUrl: "https://example.com/privacidad",
  policyVersion: "2026-11",
  isPilot: false,
};

describe("pendingLegalFields", () => {
  it("lists every missing field in plain Spanish", () => {
    expect(pendingLegalFields({ ...complete, controllerName: null, controllerEmail: null, privacyPolicyUrl: null })).toEqual([
      "nombre o razón social del responsable",
      "correo de contacto del responsable",
      "URL de la política de privacidad",
    ]);
  });

  it("is empty when everything is filled in correctly", () => {
    expect(pendingLegalFields(complete)).toEqual([]);
  });

  it("treats blank strings and malformed values as pending", () => {
    expect(pendingLegalFields({ ...complete, controllerName: "   " })).toContain("nombre o razón social del responsable");
    expect(pendingLegalFields({ ...complete, controllerEmail: "no-es-un-correo" })).toContain("correo de contacto del responsable");
    expect(pendingLegalFields({ ...complete, privacyPolicyUrl: "javascript:alert(1)" })).toContain("URL de la política de privacidad");
  });

  it("the shipped config is still a documented placeholder (nothing invented)", () => {
    expect(LEGAL.controllerName).toBeNull();
    expect(LEGAL.controllerEmail).toBeNull();
    expect(LEGAL.privacyPolicyUrl).toBeNull();
    expect(LEGAL.isPilot).toBe(true);
    expect(LEGAL.policyVersion).toMatch(/^\d{4}-\d{2}(-[a-z0-9]+)?$/);
  });
});

describe("isSafeUrl", () => {
  it("accepts https URLs and root-relative paths only", () => {
    expect(isSafeUrl("https://example.com/privacidad")).toBe(true);
    expect(isSafeUrl("/privacidad")).toBe(true);
  });

  it.each(["http://example.com", "javascript:alert(1)", "data:text/html,x", "//evil.example", "ftp://x.y", "", "https://", " /x"])(
    "rejects %j",
    (value) => {
      expect(isSafeUrl(value)).toBe(false);
    },
  );
});
