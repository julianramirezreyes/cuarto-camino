import { describe, expect, it } from "vitest";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import { LEVEL_PROFILES, getLevel } from "./index";

describe("level profiles index", () => {
  it("contains 81 profiles: 9 types x 9 levels, unique", () => {
    expect(LEVEL_PROFILES).toHaveLength(81);
    const keys = new Set(LEVEL_PROFILES.map((l) => `${l.type}-${l.level}`));
    expect(keys.size).toBe(81);
  });

  it("looks up any type and level", () => {
    for (const t of ENNEAGRAM_TYPES) {
      for (let n = 1; n <= 9; n++) {
        expect(getLevel(t, n as 1)?.type).toBe(t);
        expect(getLevel(t, n as 1)?.level).toBe(n);
      }
    }
  });
});
