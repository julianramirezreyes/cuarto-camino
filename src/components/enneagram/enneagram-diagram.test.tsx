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
