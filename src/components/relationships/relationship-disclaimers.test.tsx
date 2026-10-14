// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RELATIONSHIP_LENSES } from "@/content/relationships";
import { RelationshipDisclaimers } from "./relationship-disclaimers";

afterEach(cleanup);

describe("RelationshipDisclaimers", () => {
  it("shows the six lenses' disclaimers under «Antes de leer esto», never inside a collapsed region", () => {
    render(<RelationshipDisclaimers disclaimers={RELATIONSHIP_LENSES.disclaimers} />);
    expect(screen.getByRole("heading", { level: 2, name: "Antes de leer esto" })).toBeInTheDocument();
    expect(RELATIONSHIP_LENSES.disclaimers).toHaveLength(6);
    for (const text of RELATIONSHIP_LENSES.disclaimers) expect(screen.getByText(text)).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.querySelector("[hidden], details")).toBeNull();
  });

  it("is a labelled landmark-free note whose heading level can follow the page", () => {
    render(<RelationshipDisclaimers disclaimers={["uno"]} level={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Antes de leer esto" })).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
