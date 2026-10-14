/**
 * Tunable constants of the scoring layer.
 *
 * IMPORTANT: every "share" produced by this engine is a RELATIVE COMPATIBILITY
 * index (how the evidence is distributed among the alternatives). It is NOT a
 * calibrated probability and must never be presented as "X% chance of being
 * type N".
 */

/**
 * Additive (Laplace-like) smoothing used when turning raw evidence into
 * shares: share_k = (shifted_k + SMOOTHING) / (sum(shifted) + n * SMOOTHING).
 * It keeps shares strictly inside (0, 1), makes "no evidence" exactly uniform
 * and avoids declaring a type "impossible" from sparse data.
 */
export const SMOOTHING = 0.5;

/** Wing: minimum |upper - lower| / (upper + lower) to name a likely wing. */
export const WING_MARGIN = 0.2;

/**
 * Wing confidence shrinkage: confidence = margin * n / (n + WING_EVIDENCE_PRIOR), where n is the
 * number of wing answers that carried evidence. A unanimous result from few answers therefore
 * reports a modest confidence instead of 1. It is a heuristic, not a calibrated probability.
 */
export const WING_EVIDENCE_PRIOR = 3;

/** Instinct: minimum (top - second) share gap to name a dominant instinct. */
export const INSTINCT_MARGIN = 0.1;

/** Functioning: minimum (top - second) share gap to consider the band decided. */
export const FUNCTIONING_MARGIN = 0.1;

/** Rounds floating-point noise so sums are stable across evaluation orders. */
export function round9(x: number): number {
  return Math.round(x * 1e9) / 1e9;
}

/**
 * Shift-and-normalize rule.
 *  1. shift: subtract min(0, min raw) so that no value is negative.
 *  2. smooth: add SMOOTHING to every shifted value.
 *  3. normalize so the shares add up to 1.
 * No evidence (all zeros) => uniform shares.
 */
export function relativeShares<K extends string | number>(
  keys: readonly K[],
  raw: Record<K, number>,
): Record<K, number> {
  const minRaw = Math.min(...keys.map((k) => raw[k]));
  const shift = Math.min(0, minRaw);
  const shifted = keys.map((k) => raw[k] - shift + SMOOTHING);
  const total = shifted.reduce((s, v) => s + v, 0);
  const out = {} as Record<K, number>;
  keys.forEach((k, i) => {
    out[k] = shifted[i] / total;
  });
  return out;
}
