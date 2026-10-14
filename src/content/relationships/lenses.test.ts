import { describe, expect, it } from "vitest";
import { GROUP_SYSTEMS, type GroupSystem } from "@/domain/enneagram/structure";
import { groupPairKey } from "@/domain/enneagram/pair";
import { RELATIONSHIP_LENSES } from "./lenses";

const SYSTEMS = Object.keys(GROUP_SYSTEMS) as GroupSystem[];

function pairKeys(system: GroupSystem): string[] {
  const keys = Object.keys(GROUP_SYSTEMS[system]);
  const out: string[] = [];
  for (const a of keys) for (const b of keys) if (a !== b) out.push(groupPairKey(system, a, b));
  return [...new Set(out)];
}

function lensTexts(): string[] {
  const l = RELATIONSHIP_LENSES;
  return [
    ...SYSTEMS.flatMap((s) => Object.values(l.shared[s])),
    ...SYSTEMS.flatMap((s) => Object.values(l.different[s])),
    l.arrows.integration,
    l.arrows.stress,
    l.adjacent,
    l.sameType,
  ];
}

const allTexts = () => [...lensTexts(), ...RELATIONSHIP_LENSES.disclaimers];
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).filter(Boolean);

describe("RELATIONSHIP_LENSES", () => {
  it("is a draft", () => {
    expect(RELATIONSHIP_LENSES.status).toBe("draft");
  });

  it("has shared texts for the 3 groups of each system", () => {
    for (const s of SYSTEMS) {
      expect(Object.keys(RELATIONSHIP_LENSES.shared[s]).sort()).toEqual(Object.keys(GROUP_SYSTEMS[s]).sort());
    }
  });

  it("has a different text for every pair key groupPairKey can produce, and nothing else", () => {
    for (const s of SYSTEMS) {
      const keys = pairKeys(s);
      expect(keys).toHaveLength(3);
      expect(Object.keys(RELATIONSHIP_LENSES.different[s]).sort()).toEqual([...keys].sort());
    }
  });

  it("has non-empty lens texts of 2-3 sentences and at most 420 chars", () => {
    const texts = lensTexts();
    expect(texts).toHaveLength(9 + 9 + 4);
    for (const t of texts) {
      expect(t.trim().length).toBeGreaterThan(0);
      expect(t.length).toBeLessThanOrEqual(420);
      expect(sentences(t).length).toBeGreaterThanOrEqual(2);
      expect(sentences(t).length).toBeLessThanOrEqual(3);
    }
  });

  it("avoids forbidden terms, absolutes, percentages and gendered or clinical wording", () => {
    const forbidden = [
      /incompatib/i, /compatible/i, /compatibilidad/i, /mejor pareja/i, /peor pareja/i, /alma gemela/i,
      /media naranja/i, /condenad/i, /destinad/i, /funcionar[aá]/i, /fracasar[aá]/i,
      /\bsiempre\b/i, /\bnunca\b/i, /%/, /\d+\s*(por|de cada)\b/i, /por ciento/i, /ranking de/i,
      /diagn[oó]stic/i, /trastorno/i, /patolog/i, /cl[ií]nic/i, /\bterapia\b/i, /s[ií]ntoma/i,
      /\b(él|ella|ellos|ellas|hombre|mujer|esposo|esposa|novio|novia|marido)\b/i,
      /[“"«]/,
    ];
    // Digits are only allowed in the single citation year of the disclaimers.
    for (const t of lensTexts()) expect(t).not.toMatch(/\d/);
    for (const t of allTexts()) for (const re of forbidden) expect(t, `${re} in: ${t}`).not.toMatch(re);
  });

  it("has 6 short disclaimers covering the honest framing", () => {
    const d = RELATIONSHIP_LENSES.disclaimers;
    expect(d).toHaveLength(6);
    for (const t of d) {
      expect(t.trim().length).toBeGreaterThan(0);
      expect(t.length).toBeLessThanOrEqual(320);
    }
    const joined = d.join(" ");
    expect(joined).toMatch(/interpretativ/i);
    expect(joined).toMatch(/Carpenter/);
    expect(joined).toMatch(/ranking|puntúa|puntaje/i);
    expect(d[1]).toMatch(/ning[uú]n|ninguna/i);
    expect(d[3]).toMatch(/apego|salud/i);
    expect(d[5]).toMatch(/apoyo/i);
  });

  it("states the limited support of arrows and adjacency", () => {
    expect(RELATIONSHIP_LENSES.arrows.integration).toMatch(/respaldo|evidencia/i);
    expect(RELATIONSHIP_LENSES.arrows.stress).toMatch(/respaldo|evidencia/i);
    expect(RELATIONSHIP_LENSES.adjacent).toMatch(/respaldo|evidencia/i);
  });

  it("never claims science supports pairing by type", () => {
    for (const t of allTexts()) expect(t).not.toMatch(/(estudios|ciencia|investigaci[oó]n)\s+(demuestra|demuestran|confirma|confirman|respalda|respaldan)/i);
  });
});
