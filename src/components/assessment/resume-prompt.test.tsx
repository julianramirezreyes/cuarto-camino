// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { progress } from "./fixtures";
import { ResumePrompt } from "./resume-prompt";

afterEach(cleanup);

describe("ResumePrompt", () => {
  it("offers to continue or start over", async () => {
    const onContinue = vi.fn();
    const onRestart = vi.fn();
    render(<ResumePrompt progress={progress} onContinue={onContinue} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.click(screen.getByRole("button", { name: "Empezar de nuevo" }));
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("mentions how many answers were saved", () => {
    render(<ResumePrompt progress={progress} onContinue={() => {}} onRestart={() => {}} />);
    expect(screen.getByText(/3 respuestas/)).toBeInTheDocument();
  });
});
