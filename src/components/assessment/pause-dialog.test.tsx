// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PauseDialog } from "./pause-dialog";

afterEach(cleanup);

describe("PauseDialog", () => {
  it("renders nothing when closed", () => {
    render(<PauseDialog open={false} onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("confirms the pause, and focuses the safest action first", async () => {
    const onConfirm = vi.fn();
    render(<PauseDialog open onConfirm={onConfirm} onCancel={() => {}} />);
    expect(screen.getByRole("dialog", { name: /pausar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seguir respondiendo" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Pausar y guardar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cancels with Escape", async () => {
    const onCancel = vi.fn();
    render(<PauseDialog open onConfirm={() => {}} onCancel={onCancel} />);
    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
