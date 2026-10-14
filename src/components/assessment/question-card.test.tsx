// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { forcedChoice, likert } from "./fixtures";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("motion/react", async (orig) => ({
  ...(await orig<typeof import("motion/react")>()),
  useReducedMotion: () => reduced.value,
}));

import { QuestionCard } from "./question-card";

afterEach(cleanup);

beforeEach(() => {
  reduced.value = false;
});

describe("QuestionCard", () => {
  it("renders the question as a heading and each option exactly once", () => {
    render(<QuestionCard question={forcedChoice} onSelect={() => {}} />);
    expect(screen.getByRole("heading", { name: forcedChoice.text })).toBeInTheDocument();
    for (const o of forcedChoice.options) {
      expect(screen.getAllByText(o.text)).toHaveLength(1);
    }
    expect(screen.getAllByRole("button")).toHaveLength(forcedChoice.options.length);
  });

  it("selects an option on click", async () => {
    const onSelect = vi.fn();
    render(<QuestionCard question={forcedChoice} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /Busco que todos/ }));
    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("selects with digit keys 1-9", async () => {
    const onSelect = vi.fn();
    render(<QuestionCard question={forcedChoice} onSelect={onSelect} />);
    await userEvent.keyboard("3");
    expect(onSelect).toHaveBeenCalledWith("c");
    await userEvent.keyboard("1");
    expect(onSelect).toHaveBeenLastCalledWith("a");
  });

  it("ignores digits without an option, with modifiers, or while disabled", async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<QuestionCard question={forcedChoice} onSelect={onSelect} />);
    await userEvent.keyboard("7");
    await userEvent.keyboard("{Control>}1{/Control}");
    expect(onSelect).not.toHaveBeenCalled();
    rerender(<QuestionCard question={forcedChoice} onSelect={onSelect} disabled />);
    await userEvent.keyboard("1");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("marks the selected option (restored answer or pending)", () => {
    const { rerender } = render(
      <QuestionCard question={{ ...forcedChoice, selectedOptionId: "a" }} onSelect={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /Me anticipo/ })).toHaveAttribute("aria-pressed", "true");
    rerender(<QuestionCard question={forcedChoice} pendingOptionId="c" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /Voy directo/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Me anticipo/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("renders likert-style kinds as an ordered scale", () => {
    render(<QuestionCard question={likert} onSelect={() => {}} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("focuses the question heading when the question changes", () => {
    const { rerender } = render(<QuestionCard question={forcedChoice} onSelect={() => {}} />);
    expect(screen.getByRole("heading")).toHaveFocus();
    rerender(<QuestionCard question={likert} onSelect={() => {}} />);
    expect(screen.getByRole("heading", { name: likert.text })).toHaveFocus();
  });

  it("flags the reduced-motion path", () => {
    reduced.value = true;
    const { container } = render(<QuestionCard question={forcedChoice} onSelect={() => {}} />);
    expect(container.querySelector("[data-reduced-motion='true']")).not.toBeNull();
  });

  it("flags the animated path by default", () => {
    const { container } = render(<QuestionCard question={forcedChoice} onSelect={() => {}} />);
    expect(container.querySelector("[data-reduced-motion='false']")).not.toBeNull();
  });
});
