import { describe, expect, it } from "vitest";
import { SOURCES } from "../sources";
import type { LevelProfile } from "../schema";
import { levels1 } from "./levels-1";
import { levels2 } from "./levels-2";
import { levels3 } from "./levels-3";
import { levels4 } from "./levels-4";
import { levels5 } from "./levels-5";

const byType: Record<number, LevelProfile[]> = {
  1: levels1,
  2: levels2,
  3: levels3,
  4: levels4,
  5: levels5,
};
const all = Object.values(byType).flat();

const FORBIDDEN = /trastorno|esquizo|psic[oó]pata|narcisista|sociopat|sociópata|paranoi|bipolar|\bTOC\b|obsesivo-compulsiv|patolog|enfermedad mental/i;
const PLACEHOLDER = /\bTODO\b|\bTBD\b|\bXXX\b|\bFIXME\b|lorem ipsum|por completar|\.\.\./;

function strings(p: LevelProfile): string[] {
  return [
    p.editorialLabel, p.description, p.inRelationships, p.inDecisions,
    p.differenceFromAdjacent, p.disclaimer,
    ...p.characteristicExpressions, ...p.thinkingPatterns, ...p.emotionalPatterns,
    ...p.availableStrengths, ...p.possibleDifficulties, ...p.examples,
    ...p.reflectionQuestions, ...p.growthOpportunities,
  ];
}

describe("level profiles for types 1-5", () => {
  it("has 45 profiles", () => {
    expect(all).toHaveLength(45);
  });

  for (const t of [1, 2, 3, 4, 5]) {
    it(`type ${t} has 9 ordered levels`, () => {
      const list = byType[t]!;
      expect(list.map((p) => p.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(list.every((p) => p.type === t)).toBe(true);
    });

    it(`type ${t} adjacent levels differ`, () => {
      const list = byType[t]!;
      for (let i = 1; i < list.length; i++) {
        expect(list[i]!.description).not.toBe(list[i - 1]!.description);
        expect(list[i]!.editorialLabel).not.toBe(list[i - 1]!.editorialLabel);
        expect(list[i]!.differenceFromAdjacent).not.toBe(list[i - 1]!.differenceFromAdjacent);
      }
    });
  }

  it.each(all.map((p) => [`${p.type}-${p.level}`, p] as const))("%s is well formed", (_id, p) => {
    expect(p.sourceLevelName === null || (typeof p.sourceLevelName === "string" && p.sourceLevelName.trim() !== "")).toBe(true);
    for (const s of strings(p)) expect(s.trim().length).toBeGreaterThan(0);
    for (const arr of [
      p.characteristicExpressions, p.thinkingPatterns, p.emotionalPatterns,
      p.availableStrengths, p.possibleDifficulties, p.examples, p.growthOpportunities,
    ]) expect(arr.length).toBeGreaterThanOrEqual(3);
    expect(p.reflectionQuestions.length).toBeGreaterThanOrEqual(3);
    for (const q of p.reflectionQuestions) expect(q.trim().endsWith("?")).toBe(true);
    expect(p.status).toBe("draft");
    expect(p.disclaimer).toMatch(/validaci[oó]n cl[ií]nica/i);
    expect(p.sources.length).toBeGreaterThan(0);
    for (const k of p.sources) expect(SOURCES[k]).toBeDefined();
    for (const s of strings(p)) {
      expect(s).not.toMatch(PLACEHOLDER);
      expect(s).not.toMatch(FORBIDDEN);
    }
  });

  it("flexible levels 1-3 and maladaptive levels 7-9 are labelled by band", () => {
    for (const p of all) {
      expect(p.editorialLabel.length).toBeGreaterThan(8);
      if (p.level <= 3) expect(p.editorialLabel).toMatch(/flexib|saludable|integra|abiert|amplio/i);
      if (p.level >= 7) expect(p.editorialLabel).toMatch(/desadaptativ|dificultad|sufrimiento|rigidez|tensi[oó]n/i);
    }
  });

  it("levels 7-9 recommend human/professional support in growth opportunities", () => {
    for (const p of all.filter((x) => x.level >= 7)) {
      expect(p.growthOpportunities.join(" ")).toMatch(/profesional/i);
      expect(p.growthOpportunities.join(" ")).toMatch(/apoyo|acompañ/i);
    }
  });

  it("does not use diagnostic framing (no 'diagnóstico' except as negation in disclaimer)", () => {
    for (const p of all) {
      for (const s of strings(p).filter((x) => x !== p.disclaimer)) {
        expect(s).not.toMatch(/diagn[oó]stic/i);
      }
    }
  });
});
