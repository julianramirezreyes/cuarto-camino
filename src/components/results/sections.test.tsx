// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildTypeBundle, makeProps, makeReport } from "./fixtures";
import { AlternativesSection } from "./sections/alternatives-section";
import { BibliographySection } from "./sections/bibliography-section";
import { ConnectionsSection } from "./sections/connections-section";
import { DifficultiesSection, GrowthSection, PatternsSection, StrengthsSection } from "./sections/simple-sections";
import { HowSection } from "./sections/how-section";
import { InstinctSection } from "./sections/instinct-section";
import { LevelsSection } from "./sections/levels-section";
import { PersonalitySection } from "./sections/personality-section";
import { WingSection } from "./sections/wing-section";

afterEach(cleanup);
const bundle = buildTypeBundle(4);
const report = makeReport();

describe("PersonalitySection", () => {
  it("shows the profile slice with attribution for passion and fixation", () => {
    render(<PersonalitySection bundle={bundle} />);
    const p = bundle.profile;
    expect(screen.getByText(p.summary)).toBeInTheDocument();
    expect(screen.getByText(p.coreMotivation)).toBeInTheDocument();
    expect(screen.getByText(p.basicDesire)).toBeInTheDocument();
    expect(screen.getByText(p.basicFear)).toBeInTheDocument();
    expect(screen.getByText(p.passion.text)).toBeInTheDocument();
    expect(screen.getByText(p.fixation.text)).toBeInTheDocument();
    expect(screen.getAllByText(/Según /).length).toBeGreaterThanOrEqual(2);
  });
});

describe("AlternativesSection", () => {
  it("compares the two closest types with differences and relative-compatibility bars", () => {
    const props = makeProps();
    render(<AlternativesSection bundle={props.primary} report={props.report} alternatives={props.alternatives} />);
    for (const a of props.alternatives) {
      expect(screen.getAllByText(new RegExp(a.name)).length).toBeGreaterThan(0);
      if (a.difference) expect(screen.getByText(a.difference)).toBeInTheDocument();
    }
    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(3);
    expect(meters[0]).toHaveAccessibleName(/compatibilidad relativa/i);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });
});

describe("WingSection", () => {
  it("preselects the likely wing and lets the user switch", async () => {
    render(<WingSection bundle={bundle} wing={report.wing} />);
    const [w3, w5] = bundle.wings.slice().sort((a, b) => a.wing - b.wing);
    expect(screen.getByRole("button", { name: new RegExp(w5.label) })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(w5.explanation)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: new RegExp(w3.label) }));
    expect(screen.getByText(w3.explanation)).toBeInTheDocument();
    expect(screen.queryByText(w5.explanation)).not.toBeInTheDocument();
  });

  it("offers an explicit 'Dejar mi ala por explorar' state comparing both wings", async () => {
    render(<WingSection bundle={bundle} wing={report.wing} />);
    await userEvent.click(screen.getByRole("button", { name: "Dejar mi ala por explorar" }));
    expect(screen.getByRole("button", { name: "Dejar mi ala por explorar" })).toHaveAttribute("aria-pressed", "true");
    for (const w of bundle.wings) expect(screen.getByText(w.explanation)).toBeInTheDocument();
  });

  it("starts unexplored when the data does not suggest a wing", () => {
    render(<WingSection bundle={bundle} wing={{ ...report.wing, likelyWing: null }} />);
    expect(screen.getByRole("button", { name: "Dejar mi ala por explorar" })).toHaveAttribute("aria-pressed", "true");
  });

  it("works as an explorer without report data", () => {
    render(<WingSection bundle={bundle} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});

describe("InstinctSection", () => {
  it("keeps all three instincts explorable and marks only the dominant suggestion", async () => {
    render(<InstinctSection bundle={bundle} instinct={report.instinct} />);
    for (const s of bundle.subtypes) {
      await userEvent.click(screen.getByRole("button", { name: new RegExp(`\\(${s.instinct}\\)`) }));
      expect(screen.getByText(s.description)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/instinto dominante/i).length).toBeGreaterThan(0);
  });

  it("never claims a complete stack and lists the six theoretical stackings as educational", () => {
    render(<InstinctSection bundle={bundle} instinct={report.instinct} />);
    const list = screen.getByRole("list", { name: /combinaciones teóricas/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByText(bundle.stackingsNote)).toBeInTheDocument();
    expect(screen.queryByText(/tu orden de instintos es/i)).not.toBeInTheDocument();
  });

  it("says so when no dominant instinct is clear", () => {
    render(<InstinctSection bundle={bundle} instinct={{ ...report.instinct, dominant: null }} />);
    expect(screen.getByText(/no hay un instinto dominante claro/i)).toBeInTheDocument();
  });
});

describe("LevelsSection", () => {
  it("shows nine selectable levels and the plausible ones from the band", async () => {
    render(<LevelsSection bundle={bundle} functioning={report.functioning} />);
    const strip = screen.getByRole("group", { name: /nueve niveles/i });
    const buttons = within(strip).getAllByRole("button");
    expect(buttons).toHaveLength(9);
    // decided intermediate band -> only level 5 is plausible and preselected
    expect(buttons[4]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Banda más compatible/)).toHaveTextContent(/intermedio/);
    expect(screen.getByText(/42%/)).toBeInTheDocument();
    await userEvent.click(buttons[0]);
    const l1 = bundle.levels[0];
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(l1.description)).toBeInTheDocument();
    expect(screen.getByText(l1.disclaimer)).toBeInTheDocument();
  });

  it("shows the interpretative-model disclaimer and no clinical claim", () => {
    render(<LevelsSection bundle={bundle} functioning={report.functioning} />);
    expect(screen.getAllByText(/no es una medida clínica|sin validación clínica/i).length).toBeGreaterThan(0);
  });

  it("with no functioning data (explorer) nothing is preselected", () => {
    render(<LevelsSection bundle={bundle} />);
    for (const b of within(screen.getByRole("group", { name: /nueve niveles/i })).getAllByRole("button")) {
      expect(b).toHaveAttribute("aria-pressed", "false");
    }
  });
});

describe("content sections", () => {
  it("Patterns shows behaviours, thoughts and self-observation questions", () => {
    render(<PatternsSection bundle={bundle} />);
    const p = bundle.profile;
    expect(screen.getByText(p.habitualBehaviors[0])).toBeInTheDocument();
    expect(screen.getByText(p.recurringThoughts[0])).toBeInTheDocument();
    expect(screen.getByText(p.selfObservationQuestions[0])).toBeInTheDocument();
  });
  it("Strengths, Difficulties, Growth show their slices", () => {
    const p = bundle.profile;
    const { unmount } = render(<StrengthsSection bundle={bundle} />);
    expect(screen.getByText(p.strengths[0])).toBeInTheDocument();
    unmount();
    const d = render(<DifficultiesSection bundle={bundle} />);
    expect(screen.getByText(p.limitations[0])).toBeInTheDocument();
    expect(screen.getByText(/no son defectos/i)).toBeInTheDocument();
    d.unmount();
    render(<GrowthSection bundle={bundle} />);
    expect(screen.getByText(p.developmentPractices[0])).toBeInTheDocument();
  });
});

describe("ConnectionsSection", () => {
  it("toggles integration and stress arrows and says interpretations vary by school", async () => {
    render(<ConnectionsSection bundle={bundle} onSelectType={() => {}} />);
    const integ = screen.getByRole("button", { name: /^Mostrar integración/ });
    const stress = screen.getByRole("button", { name: /^Mostrar estrés/ });
    expect(integ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(integ);
    expect(integ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Eneatipo 1" })).toBeInTheDocument();
    await userEvent.click(stress);
    expect(stress).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(/varían según la escuela/i)).toBeInTheDocument();
    expect(screen.getByText(/emocional/i)).toBeInTheDocument();
    expect(screen.getByText(/retraído|retraídos/i)).toBeInTheDocument();
    expect(screen.getByText(/reactiv/i)).toBeInTheDocument();
  });

  it("selecting a diagram point calls onSelectType", async () => {
    const onSelectType = vi.fn();
    render(<ConnectionsSection bundle={bundle} onSelectType={onSelectType} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 8\b/ }));
    expect(onSelectType).toHaveBeenCalledWith(8);
  });
});

describe("HowSection", () => {
  it("renders explanation, counts, inconsistencies, limitations and the not-a-probability statement", () => {
    const r = makeReport({ inconsistencies: [{ groupId: "g1", questionIds: ["a", "b"], note: "Respuestas casi opuestas en un mismo tema." }] });
    render(<HowSection report={r} meta={{ engineVersion: "e1", bankVersion: "b1", completedAt: "2026-01-02T10:00:00.000Z" }} />);
    for (const line of r.explanation) expect(screen.getByText(line)).toBeInTheDocument();
    expect(screen.getByText(/Respuestas casi opuestas/)).toBeInTheDocument();
    expect(screen.getByText(/no son probabilidades calibradas/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /limitaciones/i })).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});

describe("BibliographySection", () => {
  it("lists each source once and flags the need for editorial verification", () => {
    render(<BibliographySection sources={bundle.sources} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(bundle.sources.length);
    expect(screen.getByText(/verificación editorial/i)).toBeInTheDocument();
  });
});
