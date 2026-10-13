import { describe, expect, it } from "vitest";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import type { Claim, TypeProfile } from "../schema";
import { SOURCES } from "../sources";
import { TYPE_PROFILES } from "./index";

const NAMES: Record<number, string> = {
  1: "Reformador",
  2: "Ayudador",
  3: "Triunfador",
  4: "Individualista",
  5: "Investigador",
  6: "Leal",
  7: "Entusiasta",
  8: "Desafiador",
  9: "Pacificador",
};

const STRING_FIELDS = [
  "name", "summary", "coreMotivation", "basicDesire", "basicFear", "psychologicalNeed",
  "selfImage", "inRelationships", "atWork", "inLeadership", "inConflict", "underPressure",
  "constructivePatterns", "authorDifferences",
] as const;

const ARRAY_FIELDS = [
  "strengths", "limitations", "habitualBehaviors", "recurringThoughts", "emotionalResponses",
  "everydayExamples", "developmentPractices", "selfObservationQuestions",
] as const;

const PLACEHOLDER = /[Ll]orem|[Ii]psum|\bTODO\b|\bTBD\b|\bXXX\b|\.\.\.|…/;

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

function claims(p: TypeProfile): Claim[] {
  return [p.passion, p.fixation, p.virtue, ...p.defenseMechanisms];
}

describe("TYPE_PROFILES", () => {
  it("contains exactly the 9 types, keyed consistently", () => {
    expect(Object.keys(TYPE_PROFILES).sort()).toEqual(ENNEAGRAM_TYPES.map(String).sort());
    for (const t of ENNEAGRAM_TYPES) {
      expect(TYPE_PROFILES[t].type).toBe(t);
      expect(TYPE_PROFILES[t].name).toBe(NAMES[t]);
    }
  });

  describe.each(ENNEAGRAM_TYPES)("type %i", (t) => {
    const p = TYPE_PROFILES[t];

    it("has non-empty string fields", () => {
      for (const f of STRING_FIELDS) {
        expect(p[f].trim().length, `${f} empty`).toBeGreaterThan(f === "name" ? 0 : 20);
      }
    });

    it("has at least 5 items in each array field, all non-empty", () => {
      for (const f of ARRAY_FIELDS) {
        expect(p[f].length, `${f} length`).toBeGreaterThanOrEqual(5);
        for (const item of p[f]) expect(item.trim().length).toBeGreaterThan
          (10);
      }
    });

    it("has open self-observation questions", () => {
      expect(p.selfObservationQuestions.length).toBeGreaterThanOrEqual(3);
      for (const q of p.selfObservationQuestions) {
        expect(q.startsWith("¿")).toBe(true);
        expect(q.endsWith("?")).toBe(true);
      }
    });

    it("has attributed claims with text and valid sources", () => {
      expect(p.defenseMechanisms.length).toBeGreaterThanOrEqual(2);
      for (const c of claims(p)) {
        expect(c.text.trim().length).toBeGreaterThan(10);
        expect(c.attribution).toBeTruthy();
        for (const s of c.sources ?? []) expect(SOURCES[s], `unknown source ${s}`).toBeDefined();
      }
      // passion / fixation / virtue are tradition-attributed, never plain editorial
      for (const c of [p.passion, p.fixation, p.virtue]) {
        expect(["naranjo", "ichazo"]).toContain(c.attribution);
        expect((c.sources ?? []).length).toBeGreaterThan(0);
      }
    });

    it("cites only registered sources, including the evidence review", () => {
      expect(p.sources.length).toBeGreaterThanOrEqual(2);
      expect(p.sources).toContain("hook-2021");
      for (const s of p.sources) expect(SOURCES[s], `unknown source ${s}`).toBeDefined();
    });

    it("is a draft", () => {
      expect(p.status).toBe("draft");
    });

    it("has no placeholder text", () => {
      for (const s of allStrings(p)) expect(s).not.toMatch(PLACEHOLDER);
    });

    it("has look-alikes with at least two distinct other types and real explanations", () => {
      expect(p.lookAlikes.length).toBeGreaterThanOrEqual(2);
      const types = p.lookAlikes.map((l) => l.type);
      expect(new Set(types).size).toBe(types.length);
      for (const l of p.lookAlikes) {
        expect(l.type).not.toBe(t);
        expect(ENNEAGRAM_TYPES).toContain(l.type);
        expect(l.difference.trim().length).toBeGreaterThan(80);
      }
    });

    it("frames the model as interpretive, never as a diagnosis", () => {
      const text = allStrings(p).join(" ").toLowerCase();
      expect(text).not.toContain("gurdjieff");
      expect(text).toMatch(/modelo|interpretativ/);
    });
  });

  it("does not repeat the same summary across types", () => {
    const summaries = ENNEAGRAM_TYPES.map((t) => TYPE_PROFILES[t].summary);
    expect(new Set(summaries).size).toBe(9);
  });
});
