import { describe, expect, it } from "vitest";
import { modernizeLegacyWording } from "./legacy-wording";

describe("modernizeLegacyWording", () => {
  it("shows the current term for reports saved with the older wording", () => {
    expect(modernizeLegacyWording("Los porcentajes son compatibilidad relativa entre los nueve tipos.")).toBe(
      "Los porcentajes son afinidad relativa entre los nueve tipos.",
    );
    expect(modernizeLegacyWording("El tipo con mayor compatibilidad relativa es el 3 (34%).")).toBe(
      "El tipo con mayor afinidad relativa es el 3 (34%).",
    );
    expect(modernizeLegacyWording("Compatibilidad relativa de los tipos")).toBe("Afinidad relativa de los tipos");
  });

  it("leaves text that already uses the current wording (or has none) untouched", () => {
    const text = "Se registraron 40 respuestas válidas; no son una probabilidad calibrada.";
    expect(modernizeLegacyWording(text)).toBe(text);
    expect(modernizeLegacyWording("afinidad relativa")).toBe("afinidad relativa");
  });
});
