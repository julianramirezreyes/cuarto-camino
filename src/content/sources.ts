import type { SourceRef } from "./schema";

/**
 * Registry of bibliographic sources. Every entry must be verified by an editor
 * (title, year, edition) before public launch. Content may only cite these keys.
 */
export const SOURCES: Record<string, SourceRef> = {
  "ouspensky-1949": { key: "ouspensky-1949", author: "P. D. Ouspensky", title: "In Search of the Miraculous", year: 1949, kind: "book", note: "Account of Gurdjieff's teaching; source of the enneagram symbol in the Fourth Way. Does not contain the nine modern personality types." },
  "ichazo-1982": { key: "ichazo-1982", author: "Oscar Ichazo", title: "Interviews with Oscar Ichazo", year: 1982, kind: "book", note: "Origin of fixations, passions and the Arica enneagram of personality." },
  "naranjo-1990": { key: "naranjo-1990", author: "Claudio Naranjo", title: "Ennea-type Structures: Self-Analysis for the Seeker", year: 1990, kind: "book", note: "Character studies and the instinctual variants / counter-types." },
  "naranjo-1994": { key: "naranjo-1994", author: "Claudio Naranjo", title: "Character and Neurosis: An Integrative View", year: 1994, kind: "book" },
  "palmer-1988": { key: "palmer-1988", author: "Helen Palmer", title: "The Enneagram: Understanding Yourself and the Others in Your Life", year: 1988, kind: "book", note: "Narrative tradition." },
  "riso-hudson-1996": { key: "riso-hudson-1996", author: "Don Richard Riso", title: "Personality Types: Using the Enneagram for Self-Discovery (revised edition)", year: 1996, kind: "book" },
  "riso-hudson-1999": { key: "riso-hudson-1999", author: "Don Richard Riso & Russ Hudson", title: "The Wisdom of the Enneagram", year: 1999, kind: "book", note: "Nine Levels of Development, wings, arrows." },
  "chestnut-2013": { key: "chestnut-2013", author: "Beatrice Chestnut", title: "The Complete Enneagram: 27 Paths to Greater Self-Knowledge", year: 2013, kind: "book", note: "The 27 instinctual subtypes." },
  "horney-1945": { key: "horney-1945", author: "Karen Horney", title: "Our Inner Conflicts", year: 1945, kind: "book", note: "Basis of the Hornevian groups (moving toward / against / away)." },
  "hook-2021": { key: "hook-2021", author: "Hook, Hall, Davis, Van Tongeren & Conner", title: "The Enneagram: A systematic review of the literature and directions for future research", year: 2021, kind: "article", note: "Journal of Clinical Psychology. Evidence review; verify citation details before publishing." },
  "palmer-1995": { key: "palmer-1995", author: "Helen Palmer", title: "The Enneagram in Love and Work: Understanding Your Intimate and Business Relationships", year: 1995, kind: "book", note: "Datos bibliográficos confirmados solo por catálogos secundarios (HarperSanFrancisco); su contenido interno no se revisó. Verificar edición antes de publicar." },
  "enneagram-institute-combinations": { key: "enneagram-institute-combinations", author: "Don Richard Riso & Russ Hudson (The Enneagram Institute)", title: "Relationship Type Combinations (páginas de combinaciones de tipos)", kind: "web", note: "https://www.enneagraminstitute.com/?p=3 — consultada 2026-10-14. Sostiene, en paráfrasis, que ningún emparejamiento de tipos es afortunado ni condenado y que el nivel de salud y los instintos de cada persona informan más que el tipo." },
  "carpenter-2015": { key: "carpenter-2015", author: "Douglas George Carpenter", title: "Resonating Personality Types for Couples: An Enneagram Application for Predicting Marital Satisfaction", year: 2015, kind: "article", note: "Tesis doctoral (Ph.D.), Walden University; https://scholarworks.waldenu.edu/dissertations/1597. 324 parejas casadas: sin diferencias significativas de satisfacción entre tipos; mayor satisfacción cuando al menos uno tenía apego seguro. No revisada por pares; estudio transversal." },
};
