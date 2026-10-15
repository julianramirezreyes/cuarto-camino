// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IntroductionPage from "./page";

describe("introduction page", () => {
  it("says the app name implies no affiliation with the Fourth Way school", () => {
    render(<IntroductionPage />);
    const name = screen.getByText("Sobre el nombre");
    const text = name.closest("div")?.textContent ?? "";
    expect(text).toMatch(/no está afiliada/i);
    expect(text).toMatch(/Gurdjieff/);
    expect(text).toMatch(/los nueve tipos no son de Gurdjieff/i);
  });
});
