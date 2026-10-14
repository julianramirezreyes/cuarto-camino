// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { RELATIONSHIP_PROFILES } from "@/content/relationships";
import { RelationshipGuide } from "./relationship-guide";

afterEach(cleanup);

const profile = RELATIONSHIP_PROFILES[4];

describe("RelationshipGuide", () => {
  it("starts in friendship with four labelled lists", () => {
    render(<RelationshipGuide profile={profile} />);
    expect(screen.getByRole("heading", { level: 2, name: /tipo 4/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Amistad" })).toHaveAttribute("aria-pressed", "true");
    for (const name of ["Qué suele aportar", "Qué suele necesitar", "Fricciones posibles", "Sugerencias"]) {
      expect(screen.getByRole("list", { name })).toBeInTheDocument();
    }
    const brings = screen.getByRole("list", { name: "Qué suele aportar" });
    for (const item of profile.contexts.friendship.brings) expect(within(brings).getByText(item)).toBeInTheDocument();
  });

  it.each([
    ["Pareja", "partner"],
    ["Familia", "family"],
    ["Trabajo y sociedad", "work"],
  ] as const)("switches to %s and shows that context's lists only", async (label, key) => {
    render(<RelationshipGuide profile={profile} />);
    await userEvent.click(screen.getByRole("button", { name: label }));
    expect(screen.getByRole("button", { name: label })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Amistad" })).toHaveAttribute("aria-pressed", "false");
    const ctx = profile.contexts[key];
    for (const [list, items] of [
      ["Qué suele aportar", ctx.brings],
      ["Qué suele necesitar", ctx.needs],
      ["Fricciones posibles", ctx.frictions],
      ["Sugerencias", ctx.tips],
    ] as const) {
      const el = screen.getByRole("list", { name: list });
      for (const item of items) expect(within(el).getByText(item)).toBeInTheDocument();
    }
    expect(screen.queryByText(profile.contexts.friendship.brings[0])).toBeNull();
  });

  it("can be controlled by its parent", async () => {
    const seen: string[] = [];
    render(<RelationshipGuide profile={profile} context="family" onContextChange={(c) => seen.push(c)} />);
    expect(screen.getByRole("button", { name: "Familia" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Pareja" }));
    expect(seen).toEqual(["partner"]);
  });

  it("keeps «para otros», reflection questions and same-type note in a collapsed region", async () => {
    render(<RelationshipGuide profile={profile} />);
    const toggle = screen.getByRole("button", { expanded: false, name: /para quien|conversar|reflex/i });
    expect(screen.queryByRole("region", { name: /para quien/i })).toBeNull();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const region = screen.getByRole("region", { name: /para quien/i });
    for (const t of [...profile.forOthers, ...profile.reflectionQuestions, profile.sameTypeNote]) {
      expect(within(region).getByText(t)).toBeInTheDocument();
    }
  });

  it("always shows the caveats and the draft notice", () => {
    render(<RelationshipGuide profile={profile} />);
    expect(screen.getByText(profile.caveats)).toBeVisible();
    expect(screen.getByText(/borrador editorial/i)).toBeInTheDocument();
  });
});
