import { describe, expect, it } from "vitest";
import { ENNEAGRAM_TYPES, INSTINCTS } from "@/domain/enneagram/structure";
import { SOURCES } from "../sources";
import { INSTINCT_STACKINGS, SUBTYPE_PROFILES, getSubtype } from "./index";

const PLACEHOLDER = /\bTODO\b|\bTBD\b|\bXXX\b|[Ll]orem ipsum|[Pp]laceholder|por completar|\.\.\.|…/;
const ARRAYS = [
  "motivations", "outerManifestations", "innerBehaviors", "needs", "fears",
  "strengths", "difficulties", "examples", "selfObservationPractices",
] as const;

describe("subtype profiles", () => {
  it("has 27 unique type x instinct combinations, 3 per type", () => {
    expect(SUBTYPE_PROFILES).toHaveLength(27);
    const keys = new Set(SUBTYPE_PROFILES.map((p) => `${p.type}-${p.instinct}`));
    expect(keys.size).toBe(27);
    for (const t of ENNEAGRAM_TYPES) {
      expect(SUBTYPE_PROFILES.filter((p) => p.type === t)).toHaveLength(3);
      for (const i of INSTINCTS) expect(getSubtype(t, i)?.instinct).toBe(i);
    }
  });

  it.each(SUBTYPE_PROFILES.map((p) => [`${p.type}-${p.instinct}`, p] as const))(
    "%s is complete, sourced and draft",
    (_k, p) => {
      for (const f of ["name", "description", "differencesFromOtherSubtypes", "inRelationships", "atWork"] as const) {
        expect(p[f].trim().length, f).toBeGreaterThan(30);
        expect(p[f], f).not.toMatch(PLACEHOLDER);
      }
      expect(p.countertype.note.trim().length).toBeGreaterThan(20);
      for (const a of ARRAYS) {
        expect(p[a].length, a).toBeGreaterThanOrEqual(4);
        for (const s of p[a]) { expect(s.trim().length).toBeGreaterThan(15); expect(s).not.toMatch(PLACEHOLDER); }
      }
      expect(p.possibleConfusions.length).toBeGreaterThanOrEqual(2);
      for (const c of p.possibleConfusions) {
        expect(c.type).not.toBe(p.type);
        expect(c.note.trim().length).toBeGreaterThan(20);
      }
      expect(p.sources.length).toBeGreaterThan(0);
      for (const s of p.sources) expect(SOURCES[s], s).toBeDefined();
      expect(p.attribution.length).toBeGreaterThan(0);
      expect(p.status).toBe("draft");
    },
  );

  it("siblings of a type differ in their text", () => {
    for (const t of ENNEAGRAM_TYPES) {
      const sib = SUBTYPE_PROFILES.filter((p) => p.type === t);
      for (const f of ["name", "description", "inRelationships", "atWork", "differencesFromOtherSubtypes"] as const) {
        expect(new Set(sib.map((p) => p[f])).size, `${t} ${f}`).toBe(3);
      }
      expect(new Set(sib.map((p) => p.motivations.join("|"))).size).toBe(3);
    }
  });

  it("defines the six stackings with a note on inference limits", () => {
    expect(INSTINCT_STACKINGS.stackings.map((s) => s.order).sort()).toEqual(
      ["sp/sx", "sp/so", "so/sp", "so/sx", "sx/sp", "sx/so"].sort(),
    );
    for (const s of INSTINCT_STACKINGS.stackings) expect(s.description.length).toBeGreaterThan(30);
    expect(INSTINCT_STACKINGS.note).toMatch(/no puede|limitad/i);
  });
});
