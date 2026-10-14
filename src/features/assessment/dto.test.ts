import { describe, expect, it } from "vitest";
import { DEFAULT_ENGINE_CONFIG } from "@/domain/adaptive-engine";
import { makeQuestion } from "@/tests/fixtures/mini-bank";
import { progressFor } from "./dto";
import type { TrailEntry } from "./trail";

const q = (id: string, module: "type" | "wing" = "type") =>
  makeQuestion({ id, module, options: [{ id: "a", text: "a", scores: {} }] });
const entry = (id: string, module: "type" | "wing" = "type") =>
  ({ question: q(id, module), optionId: "a" }) as unknown as TrailEntry;

describe("progressFor.position", () => {
  const trail = [entry("q1"), entry("q2"), entry("q3")];

  it("is the 1-based position of the shown question, not the number of answers", () => {
    // Shown question is the 1st; answers stay stored (3) while going back.
    const p = progressFor(trail, [], trail[0].question, DEFAULT_ENGINE_CONFIG);
    expect(p.answered).toBe(3);
    expect(p.position).toBe(1);
  });

  it("advances with the shown question", () => {
    expect(progressFor(trail, trail.slice(0, 2), trail[2].question, DEFAULT_ENGINE_CONFIG).position).toBe(3);
  });

  it("equals the path length once finished", () => {
    expect(progressFor(trail, trail, null, DEFAULT_ENGINE_CONFIG).position).toBe(3);
  });
});
