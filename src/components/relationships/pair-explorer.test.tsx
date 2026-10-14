// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import { PairExplorer } from "./pair-explorer";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (url: string) => {
    if (url === "/api/content/relationships/lenses") return Response.json(RELATIONSHIP_LENSES);
    const n = Number(url.split("/").pop()) as keyof typeof RELATIONSHIP_PROFILES;
    return Response.json({ profile: RELATIONSHIP_PROFILES[n] });
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const node = (n: number) => screen.getByRole("button", { name: new RegExp(`^Eneatipo ${n}\\b`) });
const self = RELATIONSHIP_PROFILES[4];

describe("PairExplorer", () => {
  it("shows the diagram with groups and asks for the other person's type, with no panel yet", () => {
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    expect(screen.getByRole("group", { name: /Símbolo del eneagrama/ })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Agrupación de los tipos" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Leyenda de grupos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Tipo 4 con tipo/ })).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("selecting a type fetches the other profile and shows the pair panel", async () => {
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    await userEvent.click(node(2));
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/content/relationships/2");
    expect(node(2)).toHaveAttribute("aria-pressed", "true");
  });

  it("works from the keyboard", async () => {
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    node(7).focus();
    await userEvent.keyboard("{Enter}");
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 7" })).toBeInTheDocument();
  });

  it("selecting the same type needs no fetch and shows the same-type text", async () => {
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    await userEvent.click(node(4));
    expect(await screen.findByText(RELATIONSHIP_LENSES.sameType)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("announces loading, then recovers from an error with a working retry", async () => {
    let fail = true;
    fetchMock.mockImplementation(async (url: string) => {
      if (fail) return new Response("{}", { status: 500 });
      return Response.json({ profile: RELATIONSHIP_PROFILES[Number(url.split("/").pop()) as 5] });
    });
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    await userEvent.click(node(5));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no pudimos cargar el tipo 5/i);
    expect(screen.queryByRole("heading", { name: "Tipo 4 con tipo 5" })).toBeNull();
    fail = false;
    await userEvent.click(within(alert).getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 5" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("caches fetched profiles: re-selecting a type does not fetch again", async () => {
    render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    await userEvent.click(node(2));
    await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" });
    await userEvent.click(node(5));
    await screen.findByRole("heading", { name: "Tipo 4 con tipo 5" });
    await userEvent.click(node(2));
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fetches the lenses lazily when they were not provided", async () => {
    render(<PairExplorer self={self} context="friendship" />);
    await userEvent.click(node(2));
    expect(await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeInTheDocument();
    const urls = fetchMock.mock.calls.map((c) => c[0]);
    expect(urls).toContain("/api/content/relationships/lenses");
    expect(urls).toContain("/api/content/relationships/2");
  });

  it("follows the context chosen by the parent", async () => {
    const { rerender } = render(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="friendship" />);
    await userEvent.click(node(2));
    await screen.findByRole("heading", { name: "Tipo 4 con tipo 2" });
    rerender(<PairExplorer self={self} lenses={RELATIONSHIP_LENSES} context="work" />);
    await waitFor(() => expect(screen.getByRole("region", { name: /tipo 2.*trabajo/i })).toBeInTheDocument());
  });
});
