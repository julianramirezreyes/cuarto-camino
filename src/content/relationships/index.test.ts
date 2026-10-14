import { describe, expect, it } from "vitest";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES, getRelationship } from "./index";

describe("relationship content index", () => {
  it("has exactly one profile per type, keyed by its number", () => {
    expect(Object.keys(RELATIONSHIP_PROFILES)).toHaveLength(9);
    for (const t of ENNEAGRAM_TYPES) {
      expect(RELATIONSHIP_PROFILES[t].type).toBe(t);
      expect(getRelationship(t)).toBe(RELATIONSHIP_PROFILES[t]);
    }
  });

  it("never repeats an identical list item between two different types (no templated text)", () => {
    const seen = new Map<string, number>();
    for (const t of ENNEAGRAM_TYPES) {
      const p = RELATIONSHIP_PROFILES[t];
      const items = [
        ...Object.values(p.contexts).flatMap((c) => [...c.brings, ...c.needs, ...c.frictions, ...c.tips]),
        ...p.forOthers,
        ...p.reflectionQuestions,
      ];
      for (const item of items) {
        const owner = seen.get(item);
        expect(owner === undefined || owner === t, `duplicate between type ${owner} and ${t}: ${item.slice(0, 60)}`).toBe(true);
        seen.set(item, t);
      }
    }
  });

  it("everything ships as draft and the lenses carry the honest disclaimers", () => {
    for (const t of ENNEAGRAM_TYPES) expect(RELATIONSHIP_PROFILES[t].status).toBe("draft");
    expect(RELATIONSHIP_LENSES.status).toBe("draft");
    expect(RELATIONSHIP_LENSES.disclaimers).toHaveLength(6);
  });
});
