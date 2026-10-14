/**
 * Words and symbols the relationships feature must never show: it is descriptive, so there are no verdicts,
 * scores, percentages, "best partner" claims or compatibility language (see docs/relaciones.md).
 * Negated mentions such as "no hace un ranking" are fine, so "ranking" is deliberately not listed.
 */
export const FORBIDDEN_WORDS =
  /compatib|alma gemela|media naranja|mejor(?:es)? (?:pareja|combinaci)|peor(?:es)? (?:pareja|combinaci)|puntaje|puntuaci[oó]n|\d\s?%|%|[❤♥♡💕💘💞]/i;

/** Plain text of an HTML string (tags removed, entities left as they are). */
export function textOf(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

/** The forbidden fragment found in `text`, or null. */
export function findForbidden(text: string): string | null {
  return FORBIDDEN_WORDS.exec(text)?.[0] ?? null;
}
