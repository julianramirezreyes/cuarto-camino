import { describe, expect, it } from "vitest";
import { ENNEAGRAM_TYPES, wingsOf } from "@/domain/enneagram/structure";
import { SOURCES } from "../sources";
import { WING_PROFILES, getWing } from "./index";

const ARRAYS = ["similarities", "differences", "manifestations", "strengths", "limitations", "examples"] as const;
const STRINGS = ["explanation", "motivations", "comparisonWithOtherWing"] as const;
const PLACEHOLDER = /\b(TODO|TBD|XXX|FIXME)\b|lorem ipsum|placeholder/;

describe("wing profiles", () => {
  it("has 18 profiles", () => {
    expect(WING_PROFILES).toHaveLength(18);
  });

  it.each(ENNEAGRAM_TYPES)("type %i has both wings, adjacent, with right labels", (type) => {
    const [lower, upper] = wingsOf(type);
    const found = WING_PROFILES.filter((w) => w.type === type);
    expect(found.map((w) => w.wing)).toEqual([lower, upper]);
    for (const w of found) {
      expect(w.label).toBe(`${type}w${w.wing}`);
      expect([lower, upper]).toContain(w.wing);
      expect(getWing(type, w.wing)).toBe(w);
      expect(w.status).toBe("draft");
    }
  });

  it("getWing throws or returns undefined for non-adjacent", () => {
    expect(getWing(1, 5)).toBeUndefined();
  });

  it("has unique labels", () => {
    expect(new Set(WING_PROFILES.map((w) => w.label)).size).toBe(18);
  });

  it.each(WING_PROFILES.map((w) => [w.label, w] as const))("%s has non-empty content", (_l, w) => {
    for (const k of STRINGS) expect(w[k].trim().length).toBeGreaterThan(40);
    for (const k of ARRAYS) {
      expect(w[k].length).toBeGreaterThanOrEqual(4);
      for (const s of w[k]) expect(s.trim().length).toBeGreaterThan(20);
    }
    expect(w.sources.length).toBeGreaterThan(0);
  });

  it.each(WING_PROFILES.map((w) => [w.label, w] as const))("%s cites valid sources and has no placeholders", (_l, w) => {
    for (const s of w.sources) expect(SOURCES[s], s).toBeDefined();
    const all = [...STRINGS.map((k) => w[k]), ...ARRAYS.flatMap((k) => w[k])].join("\n");
    expect(all).not.toMatch(PLACEHOLDER);
  });

  it.each(ENNEAGRAM_TYPES)("the two wings of type %i do not share text", (type) => {
    const [a, b] = WING_PROFILES.filter((w) => w.type === type);
    for (const k of STRINGS) expect(a[k]).not.toBe(b[k]);
    const sa = new Set(ARRAYS.flatMap((k) => a[k]));
    for (const s of ARRAYS.flatMap((k) => b[k])) expect(sa.has(s)).toBe(false);
  });

  it("notes that wing theory differs across schools in each type's profiles", () => {
    for (const w of WING_PROFILES) {
      const txt = (w.explanation + w.comparisonWithOtherWing).toLowerCase();
      expect(txt).toMatch(/riso|escuela|autores|cuestion|teor/);
    }
  });
});
