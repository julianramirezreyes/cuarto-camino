// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import type { RelationshipContext } from "@/content/schema";
import { ENNEAGRAM_TYPES, type EnneagramType } from "@/domain/enneagram/structure";
import { findForbidden } from "@/tests/forbidden-words";
import { PairPanel } from "./pair-panel";

afterEach(cleanup);

function panel(a: EnneagramType, b: EnneagramType, context: RelationshipContext = "friendship") {
  return render(
    <PairPanel self={RELATIONSHIP_PROFILES[a]} other={RELATIONSHIP_PROFILES[b]} lenses={RELATIONSHIP_LENSES} context={context} />,
  );
}

describe("PairPanel", () => {
  it("titles the pair neutrally", () => {
    panel(4, 2);
    expect(screen.getByRole("heading", { level: 3, name: "Tipo 4 con tipo 2" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Puntos en común y diferencias" })).toBeInTheDocument();
  });

  it("same type: shows the profile's note and the same-type lens, no shared/different sections", () => {
    panel(4, 4);
    expect(screen.getByRole("heading", { name: "Tipo 4 con tipo 4" })).toBeInTheDocument();
    expect(screen.getByText(RELATIONSHIP_PROFILES[4].sameTypeNote)).toBeInTheDocument();
    expect(screen.getByText(RELATIONSHIP_LENSES.sameType)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Puntos en común" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Dónde pueden diferir" })).toBeNull();
  });

  it("names every shared group with the shared lens", () => {
    panel(4, 2); // both emotional centre
    const shared = screen.getByRole("region", { name: "Puntos en común" });
    expect(within(shared).getByText(RELATIONSHIP_LENSES.shared.centers.emotional)).toBeInTheDocument();
    expect(within(shared).getByText(/^Centros:/)).toBeInTheDocument();
    expect(within(shared).getByText(/grupo «Emocional»/)).toBeInTheDocument();
    expect(within(shared).queryByText(RELATIONSHIP_LENSES.shared.hornevian.assertive)).toBeNull();
  });

  it("explains every system where they differ", () => {
    panel(4, 2); // hornevian withdrawn/compliant, harmonic reactive/positiveOutlook
    const diff = screen.getByRole("region", { name: "Dónde pueden diferir" });
    expect(within(diff).getByText(RELATIONSHIP_LENSES.different.hornevian["compliant|withdrawn"])).toBeInTheDocument();
    expect(within(diff).getByText(RELATIONSHIP_LENSES.different.harmonic["positiveOutlook|reactive"])).toBeInTheDocument();
    expect(within(diff).queryByText(RELATIONSHIP_LENSES.different.centers["emotional|mental"])).toBeNull();
  });

  it("shows arrows in each direction only when present, each with the limited-support text", () => {
    panel(4, 1); // 4 -> 1 integration, 1 -> 4 stress
    const arrows = screen.getByRole("region", { name: "Flechas y ala" });
    expect(within(arrows).getByText(RELATIONSHIP_LENSES.arrows.integration)).toBeInTheDocument();
    expect(within(arrows).getByText(RELATIONSHIP_LENSES.arrows.stress)).toBeInTheDocument();
    expect(within(arrows).queryByText(RELATIONSHIP_LENSES.adjacent)).toBeNull();
  });

  it("shows only the adjacent text for neighbours without arrows", () => {
    panel(4, 5);
    const arrows = screen.getByRole("region", { name: "Flechas y ala" });
    expect(within(arrows).getByText(RELATIONSHIP_LENSES.adjacent)).toBeInTheDocument();
    expect(within(arrows).queryByText(RELATIONSHIP_LENSES.arrows.integration)).toBeNull();
    expect(within(arrows).queryByText(RELATIONSHIP_LENSES.arrows.stress)).toBeNull();
  });

  it("omits «Flechas y ala» when there is no arrow and they are not neighbours", () => {
    panel(4, 6);
    expect(screen.queryByRole("region", { name: "Flechas y ala" })).toBeNull();
  });

  it("shows what the other type brings in the selected context, and follows context changes", () => {
    const { rerender } = panel(4, 2, "partner");
    const other = RELATIONSHIP_PROFILES[2];
    const section = screen.getByRole("region", { name: /tipo 2.*pareja/i });
    for (const item of other.contexts.partner.brings) expect(within(section).getByText(item)).toBeInTheDocument();
    for (const item of other.contexts.partner.needs) expect(within(section).getByText(item)).toBeInTheDocument();
    for (const item of other.contexts.partner.frictions) expect(within(section).getByText(item)).toBeInTheDocument();
    for (const item of other.contexts.partner.tips) expect(within(section).getByText(item)).toBeInTheDocument();
    rerender(<PairPanel self={RELATIONSHIP_PROFILES[4]} other={other} lenses={RELATIONSHIP_LENSES} context="work" />);
    expect(screen.getByRole("region", { name: /tipo 2.*trabajo/i })).toBeInTheDocument();
    expect(screen.queryByText(other.contexts.partner.brings[0])).toBeNull();
  });

  it("offers three reflection questions from each profile", () => {
    panel(4, 2);
    for (const t of [4, 2] as const) {
      const region = screen.getByRole("region", { name: `Preguntas del tipo ${t}` });
      expect(within(region).getAllByRole("listitem")).toHaveLength(3);
      for (const q of RELATIONSHIP_PROFILES[t].reflectionQuestions.slice(0, 3)) expect(within(region).getByText(q)).toBeInTheDocument();
    }
  });

  it("never renders numbers as scores, percentages or forbidden words, for every pair and context", () => {
    for (const a of ENNEAGRAM_TYPES) {
      for (const b of ENNEAGRAM_TYPES) {
        for (const context of ["friendship", "partner", "family", "work"] as const) {
          const { container, unmount } = panel(a, b, context);
          const text = container.textContent ?? "";
          expect(findForbidden(text), `${a}-${b}-${context}`).toBeNull();
          expect(container.querySelector('[role="meter"], [role="progressbar"], meter, progress')).toBeNull();
          unmount();
        }
      }
    }
  });
});
