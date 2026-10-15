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
  it("centres the active tab by scrolling the tab bar sideways when it changes", () => {
    const define = (el: HTMLElement, props: Record<string, number>) =>
      Object.entries(props).forEach(([k, v]) => Object.defineProperty(el, k, { value: v, configurable: true }));
    const { rerender, container } = render(<SectionTabs tabs={tabs} active="a" onChange={() => {}} renderPanel={(id) => id} />);
    const bar = screen.getByRole("tablist").parentElement as HTMLElement;
    define(bar, { clientWidth: 200 });
    define(screen.getByRole("tab", { name: "Tercera" }), { offsetLeft: 500, offsetWidth: 80 });
    rerender(<SectionTabs tabs={tabs} active="c" onChange={() => {}} renderPanel={(id) => id} />);
    expect(container).toBeTruthy();
    expect(bar.scrollLeft).toBe(500 - (200 - 80) / 2);
    expect(screen.getByRole("tab", { name: "Tercera" })).toHaveAttribute("aria-selected", "true");
  });

  it("never uses scrollIntoView, which can move the page vertically", () => {
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;
    const { rerender } = render(<SectionTabs tabs={tabs} active="a" onChange={() => {}} renderPanel={(id) => id} />);
    rerender(<SectionTabs tabs={tabs} active="b" onChange={() => {}} renderPanel={(id) => id} />);
    expect(spy).not.toHaveBeenCalled();
  });

  it("renders only the active panel's content", () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<SectionTabs tabs={tabs} active="b" onChange={() => {}} renderPanel={(id) => `contenido-${id}`} />);
    expect(screen.getByText("contenido-b")).toBeInTheDocument();
    expect(screen.queryByText("contenido-a")).not.toBeInTheDocument();
  });
});
