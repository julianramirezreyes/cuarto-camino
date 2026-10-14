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

/** Normalized entropy at or above this means the shares are nearly uniform: no usable signal. */
export const NO_SIGNAL_UNCERTAINTY = 0.95;

/** True when the functioning answers support suggesting a band at all. */
export function hasFunctioningSignal(functioning: FunctioningResult): boolean {
  return functioning.band !== null && functioning.uncertainty < NO_SIGNAL_UNCERTAINTY;
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
