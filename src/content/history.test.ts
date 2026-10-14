import { describe, expect, it } from "vitest";
import { HISTORY_SECTIONS, HISTORY_INTRO, EVIDENCE_KINDS } from "./history";
import { SOURCES } from "./sources";

const claims = HISTORY_SECTIONS.flatMap((s) => s.claims);

describe("history content", () => {
  it("covers every required historical figure and the evidence section", () => {
    const ids = HISTORY_SECTIONS.map((s) => s.id);
    for (const id of ["gurdjieff-ouspensky", "ichazo", "naranjo", "riso-hudson", "chestnut", "palmer", "contemporary", "evidencia"]) {
      expect(ids).toContain(id);
    }
  });

  it("has unique section ids and non-empty claims", () => {
    const ids = HISTORY_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of HISTORY_SECTIONS) expect(s.claims.length).toBeGreaterThan(0);
  });

  it("every claim has attribution, a known evidence kind and valid source keys", () => {
    for (const c of claims) {
      expect(c.text.length).toBeGreaterThan(20);
      expect(c.attribution).toBeTruthy();
      expect(EVIDENCE_KINDS).toContain(c.kind);
      expect(c.sources.length).toBeGreaterThan(0);
      for (const key of c.sources) expect(SOURCES[key], `unknown source ${key}`).toBeDefined();
    }
  });

  it("states that the nine personality types are not Gurdjieff's", () => {
    const text = [HISTORY_INTRO, ...claims.map((c) => c.text)].join(" ");
    expect(text).toMatch(/no (son|fueron|forman|formaban)[^.]*Gurdjieff|no (son|eran) de Gurdjieff/i);
  });

  it("never claims Gurdjieff created the nine types", () => {
    const text = [HISTORY_INTRO, ...claims.map((c) => c.text)].join(" ");
    expect(text).not.toMatch(/Gurdjieff (cre[óo]|inventó|diseñó|formuló|ideó)[^.]*nueve (tipos|eneatipos)/i);
    expect(text).not.toMatch(/Gurdjieff created the nine types/i);
  });

  it("cites the scientific review in the evidence section", () => {
    const evidence = HISTORY_SECTIONS.find((s) => s.id === "evidencia")!;
    expect(evidence.claims.some((c) => c.sources.includes("hook-2021") && c.kind === "scientific-evidence")).toBe(true);
  });

  it("distinguishes the four kinds of statement", () => {
    const kinds = new Set(claims.map((c) => c.kind));
    for (const k of ["school-definition", "editorial-interpretation", "psychological-hypothesis", "scientific-evidence"]) {
      expect(kinds.has(k as never)).toBe(true);
    }
  });

  it("contains no placeholders, invented quotations or ellipses", () => {
    const text = [HISTORY_INTRO, ...HISTORY_SECTIONS.flatMap((s) => [s.title, s.summary]), ...claims.map((c) => c.text)].join("\n");
    expect(text).not.toMatch(/\b(TODO|TBD|XXX|FIXME)\b|\[\s*\.{0,3}\s*\]|\.\.\./);
    expect(text).not.toMatch(/lorem ipsum/i);
    expect(text).not.toMatch(/[«»“”"]/);
  });
});
