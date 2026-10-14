// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Breadcrumbs } from "./breadcrumbs";
import { TypeNav } from "./type-nav";
import { DraftNotice } from "./draft-notice";

afterEach(cleanup);

describe("Breadcrumbs", () => {
  it("renders a labelled nav with the last item as current page", () => {
    render(<Breadcrumbs items={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Historia" }]} />);
    expect(screen.getByRole("navigation", { name: /migas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Biblioteca" })).toHaveAttribute("href", "/biblioteca");
    expect(screen.getByText("Historia")).toHaveAttribute("aria-current", "page");
  });
});

describe("TypeNav", () => {
  it("links to previous and next, wrapping around", () => {
    render(<TypeNav type={9} section="" />);
    expect(screen.getByRole("link", { name: /Tipo 8/ })).toHaveAttribute("href", "/biblioteca/tipos/8");
    expect(screen.getByRole("link", { name: /Tipo 1/ })).toHaveAttribute("href", "/biblioteca/tipos/1");
  });
  it("keeps the current section", () => {
    render(<TypeNav type={1} section="/niveles" />);
    expect(screen.getByRole("link", { name: /Tipo 2/ })).toHaveAttribute("href", "/biblioteca/tipos/2/niveles");
  });
});

describe("DraftNotice", () => {
  it("shows only for draft", () => {
    const { rerender } = render(<DraftNotice status="draft" />);
    expect(screen.getByText(/borrador editorial/i)).toBeInTheDocument();
    rerender(<DraftNotice status="reviewed" />);
    expect(screen.queryByText(/borrador editorial/i)).toBeNull();
  });
});
