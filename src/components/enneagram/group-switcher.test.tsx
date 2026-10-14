// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GroupSwitcher } from "./group-switcher";

afterEach(cleanup);

describe("GroupSwitcher", () => {
  it("offers the three systems plus 'sin grupos', marking the active one", () => {
    render(<GroupSwitcher value="centers" onChange={() => {}} />);
    const group = screen.getByRole("group", { name: /agrupación/i });
    expect(group).toBeInTheDocument();
    for (const name of ["Centros", "Estilos", "Armónicos", "Sin grupos"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Centros" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Estilos" })).toHaveAttribute("aria-pressed", "false");
  });

  it("reports the chosen system", async () => {
    const onChange = vi.fn();
    render(<GroupSwitcher value="centers" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Armónicos" }));
    expect(onChange).toHaveBeenCalledWith("harmonic");
    await userEvent.click(screen.getByRole("button", { name: "Sin grupos" }));
    expect(onChange).toHaveBeenLastCalledWith("none");
  });

  it("explains in one plain sentence what the active system means (and nothing when hidden)", () => {
    const { rerender } = render(<GroupSwitcher value="hornevian" onChange={() => {}} />);
    expect(screen.getByText(/cómo se actúa ante las necesidades/i)).toBeInTheDocument();
    rerender(<GroupSwitcher value="none" onChange={() => {}} />);
    expect(screen.queryByText(/cómo se actúa ante las necesidades/i)).not.toBeInTheDocument();
  });
});
