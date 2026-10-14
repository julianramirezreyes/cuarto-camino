// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EnneagramDiagram } from "./enneagram-diagram";

afterEach(cleanup);

describe("EnneagramDiagram", () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])("selects type %i on click", async (n) => {
    const onSelect = vi.fn();
    render(<EnneagramDiagram selected={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: new RegExp(`^Eneatipo ${n}\\b`) }));
    expect(onSelect).toHaveBeenCalledWith(n);
  });

  it("selects with keyboard (Enter and Space)", async () => {
    const onSelect = vi.fn();
    render(<EnneagramDiagram selected={null} onSelect={onSelect} />);
    screen.getByRole("button", { name: /^Eneatipo 4\b/ }).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(4);
  });

  it("moves focus with arrow keys around the circle", async () => {
    render(<EnneagramDiagram selected={null} onSelect={() => {}} />);
    screen.getByRole("button", { name: /^Eneatipo 9\b/ }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /^Eneatipo 1\b/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("button", { name: /^Eneatipo 8\b/ })).toHaveFocus();
  });

  it("marks the selected type and exposes wings and arrows for it", () => {
    render(<EnneagramDiagram selected={1} onSelect={() => {}} arrows="both" />);
    expect(screen.getByRole("button", { name: /^Eneatipo 1\b/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^Eneatipo 2\b.*ala/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 9\b.*ala/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 7\b.*integración/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 4\b.*estrés/ })).toBeInTheDocument();
  });
});

describe("EnneagramDiagram groups", () => {
  it("shows the three centers by default: a legend that names them with their types", () => {
    render(<EnneagramDiagram selected={null} onSelect={() => {}} />);
    const legend = screen.getByRole("list", { name: /leyenda de grupos/i });
    expect(legend).toHaveTextContent(/Instintivo/);
    expect(legend).toHaveTextContent(/Emocional/);
    expect(legend).toHaveTextContent(/Mental/);
    expect(legend).toHaveTextContent(/8, 9, 1/);
    expect(legend).toHaveTextContent(/2, 3, 4/);
    expect(legend).toHaveTextContent(/5, 6, 7/);
  });

  it("draws one decorative marker per type, tagged with its group, and never exposes them to assistive tech", () => {
    const { container } = render(<EnneagramDiagram selected={null} onSelect={() => {}} />);
    const marks = container.querySelectorAll("[data-group-mark]");
    expect(marks).toHaveLength(9);
    for (const m of marks) expect(m).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-group-mark="4"]')).toHaveAttribute("data-group", "emotional");
    expect(container.querySelector('[data-group-mark="9"]')).toHaveAttribute("data-group", "instinctive");
  });

  it("names the group in each type's accessible label (color is never the only cue)", () => {
    render(<EnneagramDiagram selected={null} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /^Eneatipo 4\b.*centro emocional/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 6\b.*centro mental/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 8\b.*centro instintivo/ })).toBeInTheDocument();
  });

  it("switches the grouping system: Hornevian styles and harmonic groups", () => {
    const { container, rerender } = render(<EnneagramDiagram selected={null} onSelect={() => {}} groups="hornevian" />);
    expect(screen.getByRole("list", { name: /leyenda de grupos/i })).toHaveTextContent(/Asertivo/);
    expect(container.querySelector('[data-group-mark="7"]')).toHaveAttribute("data-group", "assertive");
    expect(screen.getByRole("button", { name: /^Eneatipo 7\b.*estilo asertivo/ })).toBeInTheDocument();

    rerender(<EnneagramDiagram selected={null} onSelect={() => {}} groups="harmonic" />);
    expect(screen.getByRole("list", { name: /leyenda de grupos/i })).toHaveTextContent(/Perspectiva positiva/);
    expect(container.querySelector('[data-group-mark="2"]')).toHaveAttribute("data-group", "positiveOutlook");
    expect(screen.getByRole("button", { name: /^Eneatipo 4\b.*grupo reactivo/ })).toBeInTheDocument();
  });

  it("can hide the grouping completely", () => {
    const { container } = render(<EnneagramDiagram selected={null} onSelect={() => {}} groups="none" />);
    expect(container.querySelectorAll("[data-group-mark]")).toHaveLength(0);
    expect(screen.queryByRole("list", { name: /leyenda de grupos/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eneatipo 4$/ })).toBeInTheDocument();
  });

  it("emphasises the group of the selected type and dims the others", () => {
    const { container } = render(<EnneagramDiagram selected={4} onSelect={() => {}} />);
    expect(container.querySelector('[data-group-mark="3"]')).toHaveAttribute("data-emphasis", "on");
    expect(container.querySelector('[data-group-mark="2"]')).toHaveAttribute("data-emphasis", "on");
    expect(container.querySelector('[data-group-mark="8"]')).toHaveAttribute("data-emphasis", "off");
  });

  it("keeps every type selectable with the groups on", async () => {
    const onSelect = vi.fn();
    render(<EnneagramDiagram selected={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 5\b/ }));
    expect(onSelect).toHaveBeenCalledWith(5);
  });
});
