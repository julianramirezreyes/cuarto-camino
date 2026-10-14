// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RELATIONSHIP_PROFILES } from "@/content/relationships";
import { findForbidden } from "@/tests/forbidden-words";
import { buildTypeBundle, makeProps } from "./fixtures";
import { ResultsView } from "./results-view";

const useSession = vi.fn(() => ({ data: null, isPending: false }));
vi.mock("@/lib/auth/auth-client", () => ({ authClient: { useSession: () => useSession() } }));

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("header", () => {
  it("shows type name and number, motivations, provisional badge, 2 alternatives and the explainer", () => {
    const props = makeProps();
    render(<ResultsView {...props} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(`Tipo ${props.primary.type}`);
    expect(h1).toHaveTextContent(props.primary.profile.name);
    expect(screen.getAllByText(props.primary.profile.summary).length).toBeGreaterThan(0);
    expect(screen.getAllByText(props.primary.profile.coreMotivation).length).toBeGreaterThan(0);
    expect(screen.getByText("Interpretación provisional")).toBeInTheDocument();
    for (const a of props.alternatives) expect(screen.getAllByText(new RegExp(`Tipo ${a.type}`)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/compatibilidad relativa/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/no es una probabilidad/i)).toBeInTheDocument();
  });

  it("shows the ambiguity notice only when the report is ambiguous", () => {
    const { unmount } = render(<ResultsView {...makeProps({ ambiguous: true })} />);
    expect(screen.getByRole("status")).toHaveTextContent(/ambiguo/i);
    unmount();
    render(<ResultsView {...makeProps({ ambiguous: false })} />);
    expect(screen.queryByText(/resultado es ambiguo/i)).not.toBeInTheDocument();
  });

  it("never uses the word 'precisión' in any section", async () => {
    render(<ResultsView {...makeProps({ ambiguous: true })} />);
    const tabs = screen.getAllByRole("tab");
    for (const tab of tabs) {
      await userEvent.click(tab);
      await screen.findByRole("tabpanel");
      await waitFor(() => expect(screen.queryByText(/Cargando/)).not.toBeInTheDocument());
      expect(document.body.textContent).not.toMatch(/precisi[oó]n/i);
    }
  });

  it("offers a real account link (visitors only) and no dead PDF/review buttons", () => {
    render(<ResultsView {...makeProps()} />);
    expect(screen.getByRole("link", { name: /crear cuenta para conservar tu resultado/i })).toHaveAttribute(
      "href",
      "/cuenta/registro?next=/resultado",
    );
    expect(screen.queryByRole("button", { name: /crear cuenta/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /descargar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /revisar mis respuestas/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/cuentas aún no están disponibles/i)).not.toBeInTheDocument();
  });

  it("hides the account call to action when signed in", () => {
    useSession.mockReturnValueOnce({ data: { user: { name: "Ana" } } as never, isPending: false } as never);
    render(<ResultsView {...makeProps()} />);
    expect(screen.queryByRole("link", { name: /crear cuenta/i })).not.toBeInTheDocument();
  });
});

describe("tabs", () => {
  it("is an accessible tablist with one selected tab and a visible panel", async () => {
    render(<ResultsView {...makeProps()} />);
    const list = screen.getByRole("tablist");
    const tabs = within(list).getAllByRole("tab");
    expect(tabs).toHaveLength(13);
    expect(tabs.filter((t) => t.getAttribute("aria-selected") === "true")).toHaveLength(1);
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName(tabs[0].textContent!);
  });

  it("moves with arrow keys, Home and End, wrapping around", async () => {
    render(<ResultsView {...makeProps()} />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{End}");
    expect(tabs[12]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(tabs[12]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("has a «Relaciones» tab right after «Conexiones»", () => {
    render(<ResultsView {...makeProps()} />);
    const names = screen.getAllByRole("tab").map((t) => t.textContent);
    expect(names.indexOf("Relaciones")).toBe(names.indexOf("Conexiones") + 1);
  });

  it("lazy sections load when their tab is opened", async () => {
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("tab", { name: /Tu estado actual/ }));
    expect(await screen.findByRole("group", { name: /nueve niveles/i })).toBeInTheDocument();
  });
});

describe("Relaciones tab", () => {
  it("shows the disclaimers, the user's type guide and the explorer, with no network and no forbidden words", async () => {
    const props = makeProps();
    render(<ResultsView {...props} />);
    await userEvent.click(screen.getByRole("tab", { name: "Relaciones" }));
    const panel = await screen.findByRole("tabpanel", { name: "Relaciones" });
    expect(await within(panel).findByRole("heading", { name: "Antes de leer esto" })).toBeInTheDocument();
    expect(within(panel).getByRole("heading", { name: new RegExp(`Cómo se relaciona el tipo ${props.primary.type}\\b`) })).toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: /Símbolo del eneagrama/ })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(findForbidden(panel.textContent ?? "")).toBeNull();
  });

  it("uses the explored type as the perspective while exploring", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === "/api/content/type/8") return json(buildTypeBundle(8));
      return json({ profile: RELATIONSHIP_PROFILES[Number(url.split("/").pop()) as 8] });
    });
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Explorar otros eneatipos" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Eneatipo 8\b/ }));
    await screen.findByRole("status", { name: /explorando/i });
    await userEvent.click(screen.getByRole("tab", { name: "Relaciones" }));
    expect(await screen.findByRole("heading", { name: /Cómo se relaciona el tipo 8/ })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/content/relationships/8");
  });
});

describe("actions", () => {
  it("'Explorar otros eneatipos' opens the diagram tab", async () => {
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Explorar otros eneatipos" }));
    expect(screen.getByRole("tab", { name: /Conexiones/ })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByRole("button", { name: /^Eneatipo 8\b/ })).toBeInTheDocument();
  });

  it("explores any other type through the lazy endpoint and can go back", async () => {
    fetchMock.mockResolvedValue(json(buildTypeBundle(8)));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Explorar otros eneatipos" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Eneatipo 8\b/ }));
    await waitFor(() => expect(screen.getByRole("status", { name: /explorando/i })).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith("/api/content/type/8");
    expect(screen.getByRole("status", { name: /explorando/i })).toHaveTextContent(buildTypeBundle(8).profile.name);
    // result-only tabs are hidden while exploring
    expect(screen.queryByRole("tab", { name: /Tus alternativas/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: /Tu personalidad/ }));
    expect(screen.getByText(buildTypeBundle(8).profile.summary)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Volver a mi resultado" }));
    expect(screen.queryByRole("status", { name: /explorando/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(13);
  });

  it("reuses an already loaded type without fetching again", async () => {
    fetchMock.mockResolvedValue(json(buildTypeBundle(8)));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Explorar otros eneatipos" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Eneatipo 8\b/ }));
    await screen.findByRole("status", { name: /explorando/i });
    await userEvent.click(screen.getByRole("button", { name: "Volver a mi resultado" }));
    await userEvent.click(screen.getByRole("tab", { name: /Conexiones/ }));
    await userEvent.click(await screen.findByRole("button", { name: /^Eneatipo 8\b/ }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reports a failed load and keeps the user's result", async () => {
    fetchMock.mockResolvedValue(json({ error: "not_found" }, 404));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Explorar otros eneatipos" }));
    await userEvent.click(await screen.findByRole("button", { name: /^Eneatipo 8\b/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/no pudimos cargar/i);
    expect(screen.queryByRole("status", { name: /explorando/i })).not.toBeInTheDocument();
  });
});

describe("reset flow", () => {
  const id = "11111111-1111-4111-8111-111111111111";

  it("asks for confirmation and does nothing on cancel", async () => {
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar evaluación" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("closes the dialog with Escape", async () => {
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar evaluación" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls DELETE on the assessment and then links to /evaluacion", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar evaluación" }));
    await userEvent.click(screen.getByRole("button", { name: "Sí, reiniciar" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(`/api/assessments/${id}`, expect.objectContaining({ method: "DELETE" })));
    const link = await screen.findByRole("link", { name: /nueva evaluación/i });
    expect(link).toHaveAttribute("href", "/evaluacion");
    expect(screen.queryByRole("heading", { level: 1, name: /Tipo/ })).not.toBeInTheDocument();
  });

  it("shows an error and keeps the result when DELETE fails", async () => {
    fetchMock.mockResolvedValue(json({ error: "internal_error" }, 500));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar evaluación" }));
    await userEvent.click(screen.getByRole("button", { name: "Sí, reiniciar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/no pudimos reiniciar/i);
    expect(screen.queryByRole("link", { name: /nueva evaluación/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("treats a network error like a failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"));
    render(<ResultsView {...makeProps()} />);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar evaluación" }));
    await userEvent.click(screen.getByRole("button", { name: "Sí, reiniciar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/no pudimos reiniciar/i);
  });
});
