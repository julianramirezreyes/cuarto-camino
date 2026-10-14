// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SectionTabs } from "./section-tabs";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const tabs = [
  { id: "a", label: "Primera" },
  { id: "b", label: "Segunda" },
  { id: "c", label: "Tercera" },
];

describe("SectionTabs", () => {
  it("scrolls the active tab into view inside the tab bar when it changes", () => {
    const calls: string[] = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      calls.push(this.textContent ?? "");
    };
    const { rerender } = render(<SectionTabs tabs={tabs} active="a" onChange={() => {}} renderPanel={(id) => id} />);
    rerender(<SectionTabs tabs={tabs} active="c" onChange={() => {}} renderPanel={(id) => id} />);
    expect(calls).toContain("Tercera");
    expect(screen.getByRole("tab", { name: "Tercera" })).toHaveAttribute("aria-selected", "true");
  });

  it("scrolls without vertical movement so the page does not jump", () => {
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;
    render(<SectionTabs tabs={tabs} active="b" onChange={() => {}} renderPanel={(id) => id} />);
    expect(spy).toHaveBeenCalledWith({ block: "nearest", inline: "center" });
  });

  it("renders only the active panel's content", () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<SectionTabs tabs={tabs} active="b" onChange={() => {}} renderPanel={(id) => `contenido-${id}`} />);
    expect(screen.getByText("contenido-b")).toBeInTheDocument();
    expect(screen.queryByText("contenido-a")).not.toBeInTheDocument();
  });
});
