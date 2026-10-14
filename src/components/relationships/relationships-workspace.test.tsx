// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import { ENNEAGRAM_TYPES } from "@/domain/enneagram/structure";
import { findForbidden, textOf } from "@/tests/forbidden-words";
import { RelationshipsWorkspace } from "./relationships-workspace";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => Response.json({ profile: RELATIONSHIP_PROFILES[Number(url.split("/").pop()) as 2] })),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("RelationshipsWorkspace", () => {
  it("shares one context between the guide and the pair reading", async () => {
    render(<RelationshipsWorkspace profile={RELATIONSHIP_PROFILES[4]} lenses={RELATIONSHIP_LENSES} />);
    await userEvent.click(screen.getByRole("button", { name: "Pareja" }));
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 2\b/ }));
    expect(await screen.findByRole("region", { name: /tipo 2.*pareja/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Familia" }));
    expect(screen.getByRole("region", { name: /tipo 2.*familia/i })).toBeInTheDocument();
  });

  it("has no dead buttons: every button is named", () => {
    render(<RelationshipsWorkspace profile={RELATIONSHIP_PROFILES[9]} lenses={RELATIONSHIP_LENSES} />);
    for (const b of screen.getAllByRole("button")) expect(b).toHaveAccessibleName();
  });

  it("never shows forbidden words for any type's guide", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    for (const t of ENNEAGRAM_TYPES) {
      const html = renderToStaticMarkup(<RelationshipsWorkspace profile={RELATIONSHIP_PROFILES[t]} lenses={RELATIONSHIP_LENSES} />);
      expect(findForbidden(textOf(html)), `type ${t}`).toBeNull();
    }
  });
});
