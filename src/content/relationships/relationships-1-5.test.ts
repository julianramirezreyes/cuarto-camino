import { describe, expect, it } from "vitest";
import type { RelationshipContext, RelationshipProfile } from "../schema";
import { SOURCES } from "../sources";
import { relType1 } from "./type-1";
import { relType2 } from "./type-2";
import { relType3 } from "./type-3";
import { relType4 } from "./type-4";
import { relType5 } from "./type-5";

const PROFILES: [number, RelationshipProfile][] = [
  [1, relType1],
  [2, relType2],
  [3, relType3],
  [4, relType4],
  [5, relType5],
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

const FORBIDDEN: [string, RegExp][] = [
  ["incompatib/compatib", /incompatible|compatible|compatibilidad/i],
  ["mejor/peor pareja", /mejor(es)? pareja|peor(es)? pareja/i],
  ["alma gemela / media naranja", /alma gemela|media naranja/i],
  ["destino", /condenad|destinad|destino/i],
  ["predicciones", /funcionar[aá]\b|fracasar[aá]\b/i],
  ["absolutos", /\bsiempre\b|\bnunca\b/i],
  ["porcentajes", /%|por ciento|porcentaje/i],
  ["ranking", /\branking\b|\bpuntaje\b|\bpuntuaci/i],
  ["clinico", /trastorno|narcisista|t[oó]xic[oa]|abusador|codependencia|patolog/i],
  ["genero", /\b(él|ella|ellos|ellas|novio|novia|esposo|esposa|marido|mujer|hombre|varón)\b/i],
  ["ciencia respalda", /(la )?ciencia (demuestra|respalda|prueba|confirma)|est[aá] comprobado|probado cient/i],
  ["citas", /"|“|”/],
];

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("relationship profiles, types 1 to 5", () => {
  it("has exactly the five profiles with the right type", () => {
    expect(PROFILES).toHaveLength(5);
    for (const [n, p] of PROFILES) expect(p.type).toBe(n);
  });

  describe.each(PROFILES)("type %i", (_n, p) => {
    it("is a draft with valid, allowed sources", () => {
      expect(p.status).toBe("draft");
      expect(p.sources.length).toBeGreaterThanOrEqual(3);
      expect(p.sources.length).toBeLessThanOrEqual(5);
      expect(new Set(p.sources).size).toBe(p.sources.length);
      for (const s of p.sources) {
        expect(ALLOWED_SOURCES).toContain(s);
        expect(SOURCES[s]).toBeDefined();
      }
    });

    it("has a 3 to 4 sentence summary", () => {
      const sentences = p.summary.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(3);
      expect(sentences.length).toBeLessThanOrEqual(4);
    });

    it("covers all four contexts with at least 4 distinct items per list", () => {
      expect(Object.keys(p.contexts).sort()).toEqual([...CONTEXTS].sort());
      for (const c of CONTEXTS) {
        for (const list of ["brings", "needs", "frictions", "tips"] as const) {
          const items = p.contexts[c][list];
          expect(items.length, `${c}.${list}`).toBeGreaterThanOrEqual(4);
          expect(new Set(items).size).toBe(items.length);
        }
      }
    });

    it("has no identical item shared between contexts", () => {
      const seen = new Map<string, string>();
      for (const c of CONTEXTS) {
        for (const list of ["brings", "needs", "frictions", "tips"] as const) {
          for (const item of p.contexts[c][list]) {
            const prev = seen.get(item);
            expect(prev, `"${item}" repeated in ${prev} and ${c}`).toBeUndefined();
            seen.set(item, c);
          }
        }
      }
    });

    it("has forOthers (>=5) and reflection questions (>=6, ¿...?)", () => {
      expect(p.forOthers.length).toBeGreaterThanOrEqual(5);
      expect(p.reflectionQuestions.length).toBeGreaterThanOrEqual(6);
      for (const q of p.reflectionQuestions) {
        expect(q.startsWith("¿")).toBe(true);
        expect(q.endsWith("?")).toBe(true);
      }
    });

    it("has non-empty strings everywhere", () => {
      const all = strings(p);
      expect(all.length).toBeGreaterThan(50);
      for (const s of all) expect(s.trim().length).toBeGreaterThan(0);
    });

    it("sameTypeNote mentions recognition and blind spots", () => {
      expect(p.sameTypeNote).toMatch(/reconoc/i);
      expect(p.sameTypeNote).toMatch(/punto(s)? ciego/i);
    });

    it("caveats mention health, attachment or subtype, and limited empirical support", () => {
      expect(p.caveats).toMatch(/salud/i);
      expect(p.caveats).toMatch(/apego|subtipo/i);
      expect(p.caveats).toMatch(/respaldo emp[ií]rico limitado|evidencia emp[ií]rica (es )?limitada/i);
    });

    it.each(FORBIDDEN)("contains no forbidden term: %s", (_label, re) => {
      for (const s of strings(p)) expect(s).not.toMatch(re);
    });
  });

  it("has different summaries across types", () => {
    expect(new Set(PROFILES.map(([, p]) => p.summary)).size).toBe(5);
  });

  it("shares no context item between different types", () => {
    const seen = new Map<string, number>();
    for (const [n, p] of PROFILES) {
      for (const c of CONTEXTS) {
        for (const list of ["brings", "needs", "frictions", "tips"] as const) {
          for (const item of p.contexts[c][list]) {
            const prev = seen.get(item);
            expect(prev === undefined || prev === n).toBe(true);
            seen.set(item, n);
          }
        }
      }
    }
  });
});
