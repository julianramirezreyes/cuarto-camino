// Experiment (run: npx tsx scripts/sim-precision.ts). How often does the engine rank the "dominant" type first for a person who
// leans toward type B but sometimes answers like type A? Synthetic respondents only: NOT validity evidence. See docs/motor-evaluacion.md.
import { QUESTION_BANK } from "@/content/questions";
import { DEFAULT_ENGINE_CONFIG, runAssessment } from "@/domain/adaptive-engine";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { mulberry32, optionGiving } from "@/tests/fixtures/mini-bank";
import type { Question } from "@/domain/assessment/types";

function respondent(a: EnneagramType, b: EnneagramType, pB: number, seed: number) {
  const rnd = mulberry32(seed);
  return (q: Question) => {
    if (q.module === "type") {
      const target = rnd() < pB ? b : a;
      return (optionGiving(q, target) ?? q.options[Math.floor(rnd() * q.options.length)]).id;
    }
    return q.options[Math.floor(rnd() * q.options.length)].id;
  };
}

const pairs: [EnneagramType, EnneagramType][] = [[5, 9], [6, 1], [3, 7], [2, 4], [8, 6], [1, 9]];
for (const max of [28, 36, 44]) {
  const cfg = { ...DEFAULT_ENGINE_CONFIG, limits: { ...DEFAULT_ENGINE_CONFIG.limits, type: { min: 18, max } } };
  for (const pB of [0.65, 0.75]) {
    let ok = 0, amb = 0, n = 0, qs = 0;
    for (const [a, b] of pairs) for (let seed = 1; seed <= 25; seed++) {
      const { report } = runAssessment(QUESTION_BANK, respondent(a, b, pB, seed * 7919 + a * 13 + b), cfg);
      n++; qs += report.moduleCounts.type; if (report.primaryType === b) ok++; if (report.ambiguous) amb++;
    }
    console.log(`type max ${max} | leans to B with p=${pB}: top=B ${(100 * ok / n).toFixed(0)}% | flagged ambiguous ${(100 * amb / n).toFixed(0)}% | avg type questions ${(qs / n).toFixed(1)}`);
  }
}
