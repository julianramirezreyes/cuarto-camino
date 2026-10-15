import { describe, expect, it } from "vitest";
import type { AssessmentModule, Question } from "@/domain/assessment/types";
import {
  ENNEAGRAM_TYPES,
  wingsOf,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { SOURCES } from "@/content/sources";
import { QUESTION_BANK } from "./index";

const byModule = (m: AssessmentModule): Question[] =>
  QUESTION_BANK.filter((q) => q.module === m);

const FORBIDDEN_NAMES =
  /eneatipo|tipo\s*[1-9]|reformador|ayudador|triunfador|individualista|investigador|leal\b|entusiasta|desafiador|pacificador/i;

describe("question bank: structure", () => {
  it("has unique ids and codes", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    const codes = QUESTION_BANK.map((q) => q.code);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("meets module quantity targets", () => {
    expect(byModule("type").length).toBeGreaterThanOrEqual(60);
    expect(byModule("wing").length).toBe(54);
    expect(byModule("instinct").length).toBeGreaterThanOrEqual(24);
    expect(byModule("functioning").length).toBeGreaterThanOrEqual(20);
  });

  it.each(QUESTION_BANK.map((q) => [q.id, q] as const))(
    "%s has valid fields",
    (_id, q) => {
      expect(q.id).toMatch(new RegExp(`^q-${q.module}-\\d{3}$`));
      expect(q.code).toMatch(/^[A-Z0-9_]+$/);
      expect(q.version).toBe(1);
      expect(q.reviewStatus).toBe("draft");
      expect(q.active).toBe(true);
      expect(q.weight).toBeGreaterThan(0);
      expect(q.discrimination).toBeGreaterThanOrEqual(0.3);
      expect(q.discrimination).toBeLessThanOrEqual(0.9);
      expect(q.text.trim().length).toBeGreaterThan(15);
      expect(q.rationale.trim().length).toBeGreaterThan(20);
      expect(q.dimensions.length).toBeGreaterThan(0);
      expect(q.references.length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      const optionIds = q.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      for (const o of q.options) {
        expect(o.text.trim().length).toBeGreaterThan(0);
        for (const group of [
          o.scores.types,
          o.scores.instincts,
          o.scores.bands,
        ]) {
          for (const v of Object.values(group ?? {})) {
            expect(Number.isFinite(v)).toBe(true);
            expect(v).toBeGreaterThanOrEqual(0);
          }
        }
      }
      for (const t of q.relatedTypes) expect(ENNEAGRAM_TYPES).toContain(t);
    },
  );

  it("scores the dimension that matches the module", () => {
    for (const q of QUESTION_BANK) {
      for (const o of q.options) {
        if (q.module === "type" || q.module === "wing") {
          expect(Object.keys(o.scores.types ?? {}).length + 1).toBeGreaterThan(
            0,
          );
          expect(o.scores.instincts).toBeUndefined();
          expect(o.scores.bands).toBeUndefined();
        }
        if (q.module === "instinct") {
          expect(o.scores.types).toBeUndefined();
          expect(o.scores.instincts).toBeDefined();
        }
        if (q.module === "functioning") {
          expect(o.scores.types).toBeUndefined();
          expect(o.scores.bands).toBeDefined();
        }
      }
    }
  });

  it("references only keys that exist in SOURCES", () => {
    for (const q of QUESTION_BANK) {
      for (const r of q.references) expect(Object.keys(SOURCES)).toContain(r);
    }
  });

  it("uses ordered scales with monotone evidence for likert/frequency/intensity", () => {
    for (const q of QUESTION_BANK.filter((x) =>
      ["likert", "frequency", "intensity"].includes(x.kind),
    )) {
      expect(q.options).toHaveLength(5);
    }
  });
});

describe("question bank: content rules", () => {
  it("never names a type or a type number in question or option text", () => {
    for (const q of QUESTION_BANK) {
      expect(q.text, q.id).not.toMatch(FORBIDDEN_NAMES);
      for (const o of q.options)
        expect(o.text, `${q.id}/${o.id}`).not.toMatch(FORBIDDEN_NAMES);
    }
  });

  it("mixes response kinds across the bank", () => {
    const kinds = new Set(QUESTION_BANK.map((q) => q.kind));
    for (const k of [
      "scenario-choice",
      "motivation-comparison",
      "frequency",
      "intensity",
      "likert",
      "forced-choice",
    ]) {
      expect(kinds.has(k as Question["kind"]), k).toBe(true);
    }
  });

  it("functioning questions state the 4-week window and set timeWindow", () => {
    for (const q of byModule("functioning")) {
      expect(q.timeWindow).toBe("last-4-weeks");
      expect(q.text.toLowerCase()).toContain("últimas cuatro semanas");
    }
  });

  it("functioning questions avoid clinical or self-harm wording", () => {
    const clinical =
      /suicid|autolesi|hacerme daño|depresi|ansiedad cl|diagn|trastorno|medicaci|psiquiatr/i;
    for (const q of byModule("functioning")) {
      expect(q.text).not.toMatch(clinical);
      for (const o of q.options) expect(o.text).not.toMatch(clinical);
    }
  });

  it("only functioning questions carry a time window", () => {
    for (const q of QUESTION_BANK.filter((x) => x.module !== "functioning")) {
      expect(q.timeWindow).toBeUndefined();
    }
  });
});

describe("question bank: type module", () => {
  const typeQs = byModule("type");

  it("covers every type with enough related questions", () => {
    for (const t of ENNEAGRAM_TYPES) {
      const n = typeQs.filter((q) => q.relatedTypes.includes(t)).length;
      expect(n, `type ${t}`).toBeGreaterThanOrEqual(12);
    }
  });

  it("spreads evidence over several types in every choice question", () => {
    for (const q of typeQs.filter(
      (x) => !["likert", "frequency", "intensity"].includes(x.kind),
    )) {
      const touched = new Set<number>();
      for (const o of q.options) {
        const positive = Object.entries(o.scores.types ?? {}).filter(
          ([, v]) => v > 0,
        );
        expect(positive.length, `${q.id}/${o.id}`).toBeGreaterThanOrEqual(2);
        for (const [k] of positive) touched.add(Number(k));
      }
      expect(touched.size, q.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps total score balance per type within tolerance", () => {
    const totals = scoreTotals(typeQs);
    const values = ENNEAGRAM_TYPES.map((t) => totals[t]);
    const ratio = Math.max(...values) / Math.min(...values);
    console.info(
      "type-module score totals:",
      JSON.stringify(totals),
      "max/min =",
      ratio.toFixed(3),
    );
    expect(ratio).toBeLessThanOrEqual(1.15);
  });

  it("keeps maximum-possible evidence (best option per question) balanced per type", () => {
    const best = Object.fromEntries(
      ENNEAGRAM_TYPES.map((t) => [t, 0]),
    ) as Record<EnneagramType, number>;
    for (const q of typeQs) {
      for (const t of ENNEAGRAM_TYPES) {
        best[t] += Math.max(...q.options.map((o) => o.scores.types?.[t] ?? 0));
      }
    }
    const values = ENNEAGRAM_TYPES.map((t) => best[t]);
    const ratio = Math.max(...values) / Math.min(...values);
    console.info(
      "type-module max-evidence totals:",
      JSON.stringify(best),
      "max/min =",
      ratio.toFixed(3),
    );
    expect(ratio).toBeLessThanOrEqual(1.15);
  });
});

describe("question bank: type scales acquiescence", () => {
  const SCALE_KINDS = ["likert", "frequency", "intensity"];
  const scaleQs = byModule("type").filter((q) => SCALE_KINDS.includes(q.kind));
  const mainOf = (q: Question): EnneagramType =>
    ENNEAGRAM_TYPES.reduce((best, t) =>
      Math.max(...q.options.map((o) => o.scores.types?.[t] ?? 0)) >
      Math.max(...q.options.map((o) => o.scores.types?.[best] ?? 0))
        ? t
        : best,
    );
  const isReverse = (q: Question): boolean => {
    const main = mainOf(q);
    return (
      (q.options[0]?.scores.types?.[main] ?? 0) >
      (q.options[q.options.length - 1]?.scores.types?.[main] ?? 0)
    );
  };

  it("has a reverse-keyed scale item for at least 6 types", () => {
    const reversed = new Set(scaleQs.filter(isReverse).map(mainOf));
    expect(reversed.size).toBeGreaterThanOrEqual(6);
  });

  it("keeps reverse-keyed items monotone decreasing and out of equivalence groups", () => {
    for (const q of scaleQs.filter(isReverse)) {
      const main = mainOf(q);
      const vals = q.options.map((o) => o.scores.types?.[main] ?? 0);
      for (let i = 1; i < vals.length; i++)
        expect(vals[i], q.id).toBeLessThanOrEqual(vals[i - 1] as number);
      expect(q.equivalenceGroup, q.id).toBeUndefined();
    }
  });

  it("balances the all-top-answer (acquiescent) total per type within +-10% of the mean", () => {
    const totals = Object.fromEntries(
      ENNEAGRAM_TYPES.map((t) => [t, 0]),
    ) as Record<EnneagramType, number>;
    for (const q of scaleQs) {
      const top = q.options[q.options.length - 1];
      for (const t of ENNEAGRAM_TYPES) totals[t] += top?.scores.types?.[t] ?? 0;
    }
    const mean =
      ENNEAGRAM_TYPES.reduce((a, t) => a + totals[t], 0) / ENNEAGRAM_TYPES.length;
    console.info("acquiescent totals:", JSON.stringify(totals), "mean", mean.toFixed(2));
    for (const t of ENNEAGRAM_TYPES)
      expect(Math.abs(totals[t] - mean) / mean, `type ${t}`).toBeLessThanOrEqual(0.1);
  });
});

function scoreTotals(qs: Question[]): Record<EnneagramType, number> {
  const totals = Object.fromEntries(
    ENNEAGRAM_TYPES.map((t) => [t, 0]),
  ) as Record<EnneagramType, number>;
  for (const q of qs) {
    for (const o of q.options) {
      for (const t of ENNEAGRAM_TYPES) totals[t] += o.scores.types?.[t] ?? 0;
    }
  }
  for (const t of ENNEAGRAM_TYPES)
    totals[t] = Math.round(totals[t] * 100) / 100;
  return totals;
}

describe("question bank: wing module", () => {
  const wingQs = byModule("wing");

  it("follows the relatedTypes convention [main, lowerWing, upperWing]", () => {
    for (const q of wingQs) {
      expect(q.relatedTypes).toHaveLength(3);
      const [main, a, b] = q.relatedTypes as [
        EnneagramType,
        EnneagramType,
        EnneagramType,
      ];
      expect([a, b]).toEqual(wingsOf(main));
    }
  });

  it("scores only the two neighbour types and never the main type", () => {
    for (const q of wingQs) {
      const [main, a, b] = q.relatedTypes as [
        EnneagramType,
        EnneagramType,
        EnneagramType,
      ];
      for (const o of q.options) {
        for (const k of Object.keys(o.scores.types ?? {})) {
          expect([a, b], `${q.id}/${o.id}`).toContain(Number(k));
          expect(Number(k)).not.toBe(main);
        }
      }
      const targeted = new Set(
        q.options.flatMap((o) => Object.keys(o.scores.types ?? {}).map(Number)),
      );
      expect(targeted.has(a) && targeted.has(b), q.id).toBe(true);
    }
  });

  it("has exactly 6 questions per main type separating its two neighbours", () => {
    expect(wingQs).toHaveLength(54);
    for (const t of ENNEAGRAM_TYPES) {
      const n = wingQs.filter((q) => q.relatedTypes[0] === t).length;
      expect(n, `main type ${t}`).toBe(6);
    }
  });

  it("numbers wing ids q-wing-001..054 without gaps", () => {
    expect(wingQs.map((q) => q.id)).toEqual(
      Array.from(
        { length: 54 },
        (_, i) => `q-wing-${String(i + 1).padStart(3, "0")}`,
      ),
    );
  });

  it("never names a wing or a main type in wing question text", () => {
    const wingWords = /\bala\s*[1-9]\b|\b[1-9]\s*w\s*[1-9]\b|eneagrama|\bnueve\b|\buno\b/i;
    for (const q of wingQs) {
      expect(q.text, q.id).not.toMatch(wingWords);
      for (const o of q.options)
        expect(o.text, `${q.id}/${o.id}`).not.toMatch(wingWords);
    }
  });

  it("mixes kinds within each main type (scenario, motivation/forced, likert/frequency)", () => {
    for (const t of ENNEAGRAM_TYPES) {
      const kinds = new Set(
        wingQs.filter((q) => q.relatedTypes[0] === t).map((q) => q.kind),
      );
      expect(kinds.has("scenario-choice"), `main ${t} scenario`).toBe(true);
      expect(
        kinds.has("motivation-comparison") || kinds.has("forced-choice"),
        `main ${t} motivation`,
      ).toBe(true);
      expect(
        kinds.has("likert") || kinds.has("frequency"),
        `main ${t} scale`,
      ).toBe(true);
    }
  });

  it("keeps lower and upper wing evidence balanced per main type", () => {
    for (const t of ENNEAGRAM_TYPES) {
      const [lo, hi] = wingsOf(t);
      let sLo = 0;
      let sHi = 0;
      let maxLo = 0;
      let maxHi = 0;
      for (const q of wingQs.filter((x) => x.relatedTypes[0] === t)) {
        for (const o of q.options) {
          sLo += o.scores.types?.[lo] ?? 0;
          sHi += o.scores.types?.[hi] ?? 0;
        }
        maxLo += Math.max(...q.options.map((o) => o.scores.types?.[lo] ?? 0));
        maxHi += Math.max(...q.options.map((o) => o.scores.types?.[hi] ?? 0));
      }
      console.info(
        `wing balance main ${t}: lower(${lo})=${sLo.toFixed(2)} upper(${hi})=${sHi.toFixed(2)} max ${maxLo.toFixed(2)}/${maxHi.toFixed(2)}`,
      );
      expect(Math.abs(sLo - sHi) / (sLo + sHi), `main ${t} totals`).toBeLessThanOrEqual(0.05);
      expect(Math.abs(maxLo - maxHi) / (maxLo + maxHi), `main ${t} max`).toBeLessThanOrEqual(0.05);
    }
  });

  it("does not always put the same wing first in the choice questions of a main type", () => {
    for (const t of ENNEAGRAM_TYPES) {
      const [lo, hi] = wingsOf(t);
      const firsts = wingQs
        .filter(
          (q) =>
            q.relatedTypes[0] === t &&
            (q.kind === "scenario-choice" ||
              q.kind === "motivation-comparison" ||
              q.kind === "forced-choice"),
        )
        .map((q) => {
          const s = q.options[0]?.scores.types ?? {};
          return (s[lo] ?? 0) > (s[hi] ?? 0) ? "lower" : "upper";
        });
      expect(firsts.filter((f) => f === "lower").length, `main ${t}`).toBe(
        firsts.filter((f) => f === "upper").length,
      );
    }
  });

  const choiceWingQs = wingQs.filter(
    (q) => q.kind === "scenario-choice" || q.kind === "motivation-comparison",
  );
  const neutralOf = (q: (typeof wingQs)[number]) =>
    q.options.filter((o) => {
      const s = o.scores.types ?? {};
      const v = Object.values(s);
      return v.length === 2 && v[0] === v[1];
    });

  it("makes the neutral option of a wing choice a genuine 'depends/neither' answer, never a concrete behaviour", () => {
    const hedge = /\bdepende\b|\bninguna\b|\ba veces\b|\bambas\b|\bsin un patr[oó]n\b/i;
    let seen = 0;
    for (const q of choiceWingQs) {
      for (const o of neutralOf(q)) {
        seen++;
        expect(o.text, `${q.id}/${o.id}`).toMatch(hedge);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it("gives each wing choice at most one neutral option and always two wing-specific options", () => {
    for (const q of choiceWingQs) {
      expect(neutralOf(q).length, q.id).toBeLessThanOrEqual(1);
      const specific = q.options.filter((o) => !neutralOf(q).includes(o));
      expect(specific.length, q.id).toBe(2);
    }
  });

  it("keeps the two wing-specific options of a choice similar in length (no warm/long vs cold/short pairs)", () => {
    for (const q of choiceWingQs) {
      const [a, b] = q.options
        .filter((o) => !neutralOf(q).includes(o))
        .map((o) => o.text.length) as [number, number];
      const ratio = Math.max(a, b) / Math.min(a, b);
      expect(ratio, q.id).toBeLessThanOrEqual(1.45);
    }
  });

  it("does not repeat option texts inside the wing module", () => {
    const texts = wingQs.flatMap((q) =>
      q.kind === "likert" || q.kind === "frequency"
        ? []
        : q.options.map((o) => o.text),
    );
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe("question bank: instinct module", () => {
  const instQs = byModule("instinct");

  it("has at least 8 questions with evidence for each instinct", () => {
    for (const inst of ["sp", "so", "sx"] as const) {
      const n = instQs.filter((q) =>
        q.options.some((o) => (o.scores.instincts?.[inst] ?? 0) >= 1),
      ).length;
      expect(n, inst).toBeGreaterThanOrEqual(8);
    }
  });

  it("spreads its evidence across all three instincts in each question", () => {
    for (const q of instQs) {
      const seen = new Set(
        q.options.flatMap((o) => Object.keys(o.scores.instincts ?? {})),
      );
      expect(seen.size, q.id).toBe(3);
    }
  });
});

describe("question bank: functioning module", () => {
  it("scores all three bands and orders scales from maladaptive to flexible or the reverse", () => {
    for (const q of byModule("functioning")) {
      const seen = new Set(
        q.options.flatMap((o) => Object.keys(o.scores.bands ?? {})),
      );
      expect(seen.has("flexible") && seen.has("maladaptive"), q.id).toBe(true);
    }
  });
});

describe("question bank: equivalence groups", () => {
  const groups = new Map<string, Question[]>();
  for (const q of QUESTION_BANK) {
    if (q.equivalenceGroup)
      groups.set(q.equivalenceGroup, [
        ...(groups.get(q.equivalenceGroup) ?? []),
        q,
      ]);
  }

  it("has at least 8 groups with at least 2 members each", () => {
    expect(groups.size).toBeGreaterThanOrEqual(8);
    for (const [name, members] of groups) {
      expect(members.length, name).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps members of a group inside one module and one response structure", () => {
    for (const [name, members] of groups) {
      expect(new Set(members.map((m) => m.module)).size, name).toBe(1);
      expect(new Set(members.map((m) => m.options.length)).size, name).toBe(1);
      expect(new Set(members.map((m) => m.text)).size, name).toBe(
        members.length,
      );
    }
  });
});

describe("question bank: instinct option order", () => {
  const CHOICE_KINDS = ["scenario-choice", "motivation-comparison", "forced-choice"];
  const leader = (scores: Record<string, number> | undefined) =>
    Object.entries(scores ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  const choices = byModule("instinct").filter((q) => CHOICE_KINDS.includes(q.kind));

  it("does not always lead with the same instinct in the same position", () => {
    for (const position of [0, 1, 2]) {
      const counts: Record<string, number> = {};
      for (const q of choices) {
        const l = leader(q.options[position]?.scores.instincts);
        counts[l ?? "none"] = (counts[l ?? "none"] ?? 0) + 1;
      }
      for (const n of Object.values(counts)) {
        expect(n, `position ${position + 1}: ${JSON.stringify(counts)}`).toBeLessThanOrEqual(Math.ceil(choices.length / 3) + 1);
      }
    }
  });
});
