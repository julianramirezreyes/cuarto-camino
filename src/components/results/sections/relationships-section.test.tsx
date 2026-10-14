// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import { findForbidden } from "@/tests/forbidden-words";
import { RelationshipsSection } from "./relationships-section";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (url: string) =>
    Response.json({ profile: RELATIONSHIP_PROFILES[Number(url.split("/").pop()) as 2] }),
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const main = RELATIONSHIP_PROFILES[4];

describe("RelationshipsSection", () => {
  it("shows the disclaimers, the user's guide and the pair explorer without fetching anything", () => {
    render(<RelationshipsSection type={4} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    expect(screen.getByRole("heading", { level: 2, name: "Relaciones" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Antes de leer esto" })).toBeInTheDocument();
    for (const d of RELATIONSHIP_LENSES.disclaimers) expect(screen.getByText(d)).toBeVisible();
    expect(screen.getByRole("heading", { name: /Cómo se relaciona el tipo 4/ })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /Símbolo del eneagrama/ })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("the explorer works from the results", async () => {
    render(<RelationshipsSection type={4} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eneatipo 2\b/ }));
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeInTheDocument();
  });

  it("in explorer mode uses the explored type as the perspective (fetched lazily, never the user's own)", async () => {
    render(<RelationshipsSection type={7} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    expect(screen.getByRole("status")).toHaveTextContent(/cargando el tipo 7/i);
    expect(await screen.findByRole("heading", { name: /Cómo se relaciona el tipo 7/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Cómo se relaciona el tipo 4/ })).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith("/api/content/relationships/7");
  });

  it("explorer mode: shows an error with retry when the perspective cannot load", async () => {
    fetchMock.mockImplementationOnce(async () => new Response("{}", { status: 500 }));
    render(<RelationshipsSection type={7} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    const alert = await screen.findByRole("alert");
    await userEvent.click(within(alert).getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("heading", { name: /Cómo se relaciona el tipo 7/ })).toBeInTheDocument();
  });

  it("reacts when the explored type changes and when it returns to the user's type", async () => {
    const { rerender } = render(<RelationshipsSection type={4} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    rerender(<RelationshipsSection type={2} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    expect(await screen.findByRole("heading", { name: /Cómo se relaciona el tipo 2/ })).toBeInTheDocument();
    rerender(<RelationshipsSection type={4} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    expect(screen.getByRole("heading", { name: /Cómo se relaciona el tipo 4/ })).toBeInTheDocument();
  });

  it("uses no forbidden words", () => {
    const { container } = render(<RelationshipsSection type={4} mainProfile={main} lenses={RELATIONSHIP_LENSES} />);
    expect(findForbidden(container.textContent ?? "")).toBeNull();
  });
});
