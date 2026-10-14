// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { progress } from "./fixtures";
import { ProgressHeader } from "./progress-header";

afterEach(cleanup);

describe("ProgressHeader", () => {
  it("shows the plain-language module label and an accessible progress bar", () => {
    render(<ProgressHeader progress={progress} />);
    expect(screen.getByText("Patrones")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "8");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("announces progress politely", () => {
    render(<ProgressHeader progress={progress} />);
    expect(screen.getByText(/Pregunta 4/).closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("uses the label of the current module", () => {
    render(<ProgressHeader progress={{ ...progress, module: "functioning", moduleIndex: 0 }} />);
    expect(screen.getByText("Momento actual")).toBeInTheDocument();
  });
});
