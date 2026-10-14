// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ExpandableCard } from "./expandable-card";

afterEach(cleanup);

describe("ExpandableCard", () => {
  it("starts collapsed and toggles with click", async () => {
    render(<ExpandableCard title="Subtipo A"><p>Contenido interno</p></ExpandableCard>);
    const btn = screen.getByRole("button", { name: /Subtipo A/ });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Contenido interno")).not.toBeVisible();
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Contenido interno")).toBeVisible();
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles with keyboard and links the button to its region", async () => {
    render(<ExpandableCard title="Subtipo B"><p>Detalle</p></ExpandableCard>);
    const btn = screen.getByRole("button", { name: /Subtipo B/ });
    btn.focus();
    await userEvent.keyboard("{Enter}");
    expect(btn).toHaveAttribute("aria-expanded", "true");
    const region = screen.getByRole("region", { name: /Subtipo B/ });
    expect(btn.getAttribute("aria-controls")).toBe(region.id);
    await userEvent.keyboard(" ");
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("can start open", () => {
    render(<ExpandableCard title="X" defaultOpen><p>Visible</p></ExpandableCard>);
    expect(screen.getByRole("button", { name: /X/ })).toHaveAttribute("aria-expanded", "true");
  });
});
