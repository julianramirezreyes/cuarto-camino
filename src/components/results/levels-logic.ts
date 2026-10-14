import type { FunctioningBand } from "@/domain/assessment/types";
import type { FunctioningResult } from "@/domain/scoring/functioning";

const ORDER: readonly FunctioningBand[] = ["flexible", "intermediate", "maladaptive"];
/** Middle level of each band. */
const MIDDLE: Record<FunctioningBand, number> = { flexible: 2, intermediate: 5, maladaptive: 8 };

export const BAND_LABEL: Record<FunctioningBand, string> = {
  flexible: "flexible",
  intermediate: "intermedio",
  maladaptive: "rígido o poco adaptativo",
};

/**
 * The top band must lead the runner-up by at least this much of the share for the band to be suggested.
 * (Entropy alone is a poor gate: an ordinary mixed pattern such as 30/48/22 already has normalized entropy
 * ~0.95 although one band clearly leads, so it used to hide the band for most people.)
 */
export const MIN_FUNCTIONING_MARGIN = 0.06;

/** True when the functioning answers support suggesting a band at all. */
export function hasFunctioningSignal(functioning: FunctioningResult): boolean {
  return functioning.band !== null && functioning.margin >= MIN_FUNCTIONING_MARGIN;
}

export function bandOfLevel(level: number): FunctioningBand {
  return level <= 3 ? "flexible" : level <= 6 ? "intermediate" : "maladaptive";
}

/**
 * At most two plausible levels, always inside the supported band: its middle level and,
 * when the band is not clearly decided, the adjacent level that points toward the
 * second most supported band. The data cannot support a finer reading.
 */
export function plausibleLevels(functioning: FunctioningResult): number[] {
  const { band, decided, shares } = functioning;
  if (band === null || !hasFunctioningSignal(functioning)) return [];
  const mid = MIDDLE[band];
  if (decided) return [mid];
  const second = ORDER.filter((b) => b !== band).sort((a, b) => shares[b] - shares[a])[0];
  return [mid, ORDER.indexOf(second) < ORDER.indexOf(band) ? mid - 1 : mid + 1];
}
