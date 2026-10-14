// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { TypePicker } from "./type-picker";

afterEach(cleanup);

describe("TypePicker", () => {
  it("prompts to choose a type initially", () => {
    render(<TypePicker />);
    expect(screen.getByText(/Elige un punto del símbolo/i)).toBeInTheDocument();
  });

  it("shows the selected type with working links", async () => {
    render(<TypePicker />);
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 7\b/ }));
    expect(screen.getByRole("heading", { name: /Tipo 7/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver perfil completo/ })).toHaveAttribute("href", "/biblioteca/tipos/7");
    expect(screen.getByRole("link", { name: /Subtipos del tipo 7/ })).toHaveAttribute("href", "/biblioteca/tipos/7/subtipos");
    expect(screen.getByRole("link", { name: /Niveles del tipo 7/ })).toHaveAttribute("href", "/biblioteca/tipos/7/niveles");
  });

  it("offers plain links to all nine types as a non-interactive fallback", () => {
    render(<TypePicker />);
    for (let n = 1; n <= 9; n++) expect(screen.getAllByRole("link", { name: new RegExp(`Tipo ${n}\\b`) })[0]).toHaveAttribute("href", `/biblioteca/tipos/${n}`);
  });

  it("toggles arrows note", async () => {
    render(<TypePicker />);
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 1\b/ }));
    const toggle = screen.getByRole("button", { name: /Mostrar flechas/ });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^Eneatipo 7\b.*integración/ })).toBeInTheDocument();
  });
});
