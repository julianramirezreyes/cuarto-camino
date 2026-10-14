// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { LEVEL_PROFILES } from "@/content/levels";
import { LevelStrip } from "./level-strip";

afterEach(cleanup);

const levels = LEVEL_PROFILES.filter((l) => l.type === 4);

describe("LevelStrip", () => {
  it("renders nine selectable levels and shows the disclaimer", () => {
    render(<LevelStrip levels={levels} />);
    for (let n = 1; n <= 9; n++) expect(screen.getByRole("button", { name: new RegExp(`^Nivel ${n}\\b`) })).toBeInTheDocument();
    expect(screen.getByText(/sin validación clínica/i)).toBeInTheDocument();
  });

  it("selects a level on click and shows its content", async () => {
    render(<LevelStrip levels={levels} />);
    const btn = screen.getByRole("button", { name: /^Nivel 6\b/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: new RegExp(levels[5].editorialLabel) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Nivel 1\b/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("selects with keyboard", async () => {
    render(<LevelStrip levels={levels} />);
    screen.getByRole("button", { name: /^Nivel 3\b/ }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /^Nivel 3\b/ })).toHaveAttribute("aria-pressed", "true");
  });
});
