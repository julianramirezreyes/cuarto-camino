import { describe, expect, it } from "vitest";
import { SOURCES } from "../sources";
import type { LevelProfile } from "../schema";
import { levels6 } from "./levels-6";
import { levels7 } from "./levels-7";
import { levels8 } from "./levels-8";
import { levels9 } from "./levels-9";

const BY_TYPE = { 6: levels6, 7: levels7, 8: levels8, 9: levels9 } as const;
const ALL: LevelProfile[] = [...levels6, ...levels7, ...levels8, ...levels9];

const BANNED = [/trastorno/i, /esquizo/i, /psic[oó]pat/i, /narcisista/i, /soci[oó]pat/i, /paranoi/i, /patolog/i, /bipolar/i, /diagn[oó]stic[oa]d/i];
const PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum|placeholder|\.\.\./;

const strings = (p: LevelProfile): string[] => {
  const out: string[] = [];
  for (const v of Object.values(p)) {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) out.push(...(v as string[]));
  }
  return out;
};

describe("levels 6-9", () => {
  it("has 36 profiles", () => {
    expect(ALL).toHaveLength(36);
  });

  for (const [t, list] of Object.entries(BY_TYPE)) {
    it(`type ${t} has 9 ordered levels`, () => {
      expect(list.map((p) => p.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(list.every((p) => p.type === Number(t))).toBe(true);
    });

    it(`type ${t}: adjacent descriptions differ`, () => {
      for (let i = 1; i < list.length; i++) {
        expect(list[i].description).not.toBe(list[i - 1].description);
        expect(list[i].editorialLabel).not.toBe(list[i - 1].editorialLabel);
      }
    });
  }

  it("has non-empty fields and enough items", () => {
    for (const p of ALL) {
      const id = `${p.type}/${p.level}`;
      for (const s of strings(p)) expect(s.trim().length, id).toBeGreaterThan(0);
      for (const k of ["description", "inRelationships", "inDecisions", "differenceFromAdjacent", "disclaimer", "editorialLabel"] as const) {
        expect(p[k].trim().length, `${id} ${k}`).toBeGreaterThan(10);
      }
      for (const k of ["characteristicExpressions", "thinkingPatterns", "emotionalPatterns", "availableStrengths", "possibleDifficulties", "examples", "reflectionQuestions", "growthOpportunities"] as const) {
        expect(p[k].length, `${id} ${k}`).toBeGreaterThanOrEqual(3);
      }
      expect(p.status).toBe("draft");
    }
  });

  it("sourceLevelName is null or a non-empty string", () => {
    for (const p of ALL) {
      expect(p.sourceLevelName === null || (typeof p.sourceLevelName === "string" && p.sourceLevelName.length > 0)).toBe(true);
    }
  });

  it("cites only registered sources", () => {
    for (const p of ALL) {
      expect(p.sources.length).toBeGreaterThan(0);
      for (const k of p.sources) expect(SOURCES[k], `${p.type}/${p.level} ${k}`).toBeDefined();
    }
  });

  it("has no placeholders or clinical diagnostic terms", () => {
    for (const p of ALL) {
      for (const s of strings(p)) {
        expect(s, `${p.type}/${p.level}`).not.toMatch(PLACEHOLDER);
        for (const b of BANNED) expect(s, `${p.type}/${p.level}`).not.toMatch(b);
      }
    }
  });

  it("states the model has no clinical validation", () => {
    for (const p of ALL) {
      expect(p.disclaimer).toMatch(/interpretativ/i);
      expect(p.disclaimer).toMatch(/validaci[oó]n cl[ií]nica/i);
    }
  });

  it("reflection questions are questions", () => {
    for (const p of ALL) for (const q of p.reflectionQuestions) expect(q).toMatch(/\?$/);
  });

  it("levels 7-9 suggest professional or human support", () => {
    for (const p of ALL.filter((x) => x.level >= 7)) {
      expect(p.growthOpportunities.join(" "), `${p.type}/${p.level}`).toMatch(/apoyo profesional/i);
    }
  });

  it("levels 1 and 9 compare with one neighbour only (mention it)", () => {
    for (const p of ALL.filter((x) => x.level === 1 || x.level === 9)) {
      expect(p.differenceFromAdjacent).toMatch(p.level === 1 ? /nivel 2/i : /nivel 8/i);
    }
  });
});
