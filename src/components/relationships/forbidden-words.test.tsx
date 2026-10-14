import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import { FORBIDDEN_WORDS, findForbidden, textOf } from "@/tests/forbidden-words";
import { CONTEXTS } from "./labels";
import { PairExplorer } from "./pair-explorer";
import { RelationshipDisclaimers } from "./relationship-disclaimers";
import { RelationshipGuide } from "./relationship-guide";

describe("forbidden words", () => {
  it("the detector catches what the feature must never say", () => {
    for (const bad of ["compatibilidad", "Incompatible", "tu alma gemela", "la media naranja", "75%", "mejor pareja", "❤"]) {
      expect(FORBIDDEN_WORDS.test(bad), bad).toBe(true);
    }
    expect(findForbidden("esta herramienta no hace un ranking ni puntúa parejas")).toBeNull();
  });

  it("no guide (any type, any kind of bond), explorer or disclaimer uses them", () => {
    for (const t of ENNEAGRAM_TYPES) {
      for (const context of CONTEXTS) {
        const html = renderToStaticMarkup(<RelationshipGuide profile={RELATIONSHIP_PROFILES[t]} context={context} />);
        expect(findForbidden(textOf(html)), `guide ${t} ${context}`).toBeNull();
      }
      const explorer = renderToStaticMarkup(<PairExplorer self={RELATIONSHIP_PROFILES[t]} lenses={RELATIONSHIP_LENSES} context="partner" />);
      expect(findForbidden(textOf(explorer)), `explorer ${t}`).toBeNull();
    }
    expect(findForbidden(textOf(renderToStaticMarkup(<RelationshipDisclaimers disclaimers={RELATIONSHIP_LENSES.disclaimers} />)))).toBeNull();
  });
});
