/**
 * Reports are saved with the wording of the engine version that generated them and must stay immutable.
 * In October 2026 «compatibilidad relativa» became «afinidad relativa» (see docs/motor-evaluacion.md), so
 * saved explanations are normalized for DISPLAY only.
 */
export function modernizeLegacyWording(text: string): string {
  return text.replace(/compatibilidad relativa/g, "afinidad relativa").replace(/Compatibilidad relativa/g, "Afinidad relativa");
}
