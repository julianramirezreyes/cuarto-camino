import { describe, expect, it } from "vitest";
import type { RelationshipContext, RelationshipProfile } from "../schema";
import { SOURCES } from "../sources";
import { relType6 } from "./type-6";
import { relType7 } from "./type-7";
import { relType8 } from "./type-8";
import { relType9 } from "./type-9";

const PROFILES: Array<[6 | 7 | 8 | 9, RelationshipProfile]> = [
  [6, relType6],
  [7, relType7],
  [8, relType8],
  [9, relType9],
];
const CONTEXTS: RelationshipContext[] = ["friendship", "partner", "family", "work"];
const ALLOWED_SOURCES = [
  "enneagram-institute-combinations",
  "palmer-1995",
  "riso-hudson-1999",
  "riso-hudson-1996",
  "hook-2021",
  "carpenter-2015",
];

const FORBIDDEN: RegExp[] = [
  /incompatib/i,
  /compatibles/i,
  /compatibilidad/i,
  /mejor pareja/i,
  /peor pareja/i,
  /alma gemela/i,
  /media naranja/i,
  /condenad/i,
  /destinad/i,
  /funcionar[aá]\b/i,
  /fracasar[aá]\b/i,
  /\bsiempre\b/i,
  /\bnunca\b/i,
  /%/,
  /\d+\s*por ciento/i,
  /trastorno/i,
  /narcisista/i,
  /t[oó]xic/i,
  /abusador/i,
  /codependen/i,
  /diagn[oó]stic/i,
  /\b(novio|novia|esposo|esposa|marido|mujer|hombre|chico|chica)\b/i,
  /la ciencia (demuestra|prueba|respalda)/i,
];

function walk(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => walk(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => walk(v, out));
  return out;
}

describe("relationship profiles for types 6-9", () => {
  it("has the four profiles with the right type", () => {
    expect(PROFILES.map(([, p]) => p.type)).toEqual([6, 7, 8, 9]);
  });

  describe.each(PROFILES)("type %i", (n, p) => {
    it("matches the declared type, status and sources", () => {
      expect(p.type).toBe(n);
      expect(p.status).toBe("draft");
      expect(p.sources.length).toBeGreaterThanOrEqual(3);
      expect(p.sources.length).toBeLessThanOrEqual(5);
      for (const s of p.sources) {
        expect(ALLOWED_SOURCES).toContain(s);
        expect(SOURCES[s]).toBeDefined();
      }
    });

    it("has a summary of 3-4 sentences", () => {
      const sentences = p.summary.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(3);
      expect(sentences.length).toBeLessThanOrEqual(4);
    });

    it("has all four contexts with at least 4 non-empty items per list", () => {
      expect(Object.keys(p.contexts).sort()).toEqual([...CONTEXTS].sort());
      for (const c of CONTEXTS) {
        for (const list of ["brings", "needs", "frictions", "tips"] as const) {
          expect(p.contexts[c][list].length, `${c}.${list}`).toBeGreaterThanOrEqual(4);
        }
      }
    });

    it("has enough forOthers and reflection questions", () => {
      expect(p.forOthers.length).toBeGreaterThanOrEqual(5);
      expect(p.reflectionQuestions.length).toBeGreaterThanOrEqual(6);
      for (const q of p.reflectionQuestions) {
        expect(q.startsWith("¿")).toBe(true);
        expect(q.endsWith("?")).toBe(true);
      }
    });

    it("has no empty strings", () => {
      for (const s of walk({ ...p, type: undefined })) expect(s.trim().length).toBeGreaterThan(0);
    });

    it("contains no forbidden terms", () => {
      for (const s of walk(p)) {
        for (const re of FORBIDDEN) expect(s, `${re} in: ${s}`).not.toMatch(re);
      }
    });

    it("does not repeat items across contexts", () => {
      const seen = new Set<string>();
      for (const c of CONTEXTS) {
        for (const list of ["brings", "needs", "frictions", "tips"] as const) {
          for (const item of p.contexts[c][list]) {
            expect(seen.has(item), `duplicate: ${item}`).toBe(false);
            seen.add(item);
          }
        }
      }
    });

    it("sameTypeNote covers recognition and blind spots", () => {
      expect(p.sameTypeNote).toMatch(/reconoc/i);
      expect(p.sameTypeNote).toMatch(/punto(s)? ciego/i);
    });

    it("caveats mention health, attachment or subtype and limited support", () => {
      expect(p.caveats).toMatch(/salud/i);
      expect(p.caveats).toMatch(/apego|subtipo/i);
      expect(p.caveats).toMatch(/respaldo emp[ií]rico limitado|evidencia emp[ií]rica limitada/i);
    });
  });

  it("summaries differ across types", () => {
    expect(new Set(PROFILES.map(([, p]) => p.summary)).size).toBe(4);
  });
});
