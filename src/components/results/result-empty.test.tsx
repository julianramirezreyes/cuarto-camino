// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ResultEmpty } from "./result-empty";

afterEach(cleanup);

describe("ResultEmpty", () => {
  it("invites to take the assessment when there is no result", () => {
    render(<ResultEmpty reason="empty" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/todavía no tienes un resultado/i);
    expect(screen.getByRole("link", { name: /hacer la evaluación/i })).toHaveAttribute("href", "/evaluacion");
  });

  it("explains insufficient evidence without inventing a type", () => {
    render(<ResultEmpty reason="insufficient" />);
    expect(screen.getByText(/no hubo evidencia suficiente/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tipo \d/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nueva evaluación/i })).toHaveAttribute("href", "/evaluacion");
  });
});
