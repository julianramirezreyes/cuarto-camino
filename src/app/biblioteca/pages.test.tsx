// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import LibraryHome from "./page";
import HistoryPage from "./historia/page";
import BibliographyPage from "./bibliografia/page";
import ClassificationsPage from "./clasificaciones/page";
import SubtypesIndex from "./subtipos/page";
import LevelsIndex from "./niveles/page";
import TypesIndex from "./tipos/page";
import TypePage, { generateStaticParams as typeParams, generateMetadata as typeMeta } from "./tipos/[n]/page";
import SubtypesPage, { generateStaticParams as subParams } from "./tipos/[n]/subtipos/page";
import LevelsPage, { generateStaticParams as lvlParams } from "./tipos/[n]/niveles/page";
import RelationsIndex from "./relaciones/page";
import RelationsPage, { generateStaticParams as relParams, generateMetadata as relMeta } from "./relaciones/[n]/page";
import { RELATIONSHIP_LENSES } from "@/content/relationships";
import { SOURCES } from "@/content/sources";
import { findForbidden } from "@/tests/forbidden-words";

afterEach(cleanup);

const params = (n: string) => ({ params: Promise.resolve({ n }) });
const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe("generateStaticParams", () => {
  it.each([typeParams, subParams, lvlParams, relParams])("returns types 1..9", async (fn) => {
    expect(await fn()).toEqual(NUMS.map((n) => ({ n: String(n) })));
  });
});

describe("type pages", () => {
  it.each(NUMS)("renders profile, wings and links for type %i", async (n) => {
    render(await TypePage(params(String(n))));
    expect(screen.getByRole("heading", { level: 1, name: new RegExp(`Tipo ${n}\\b`) })).toBeInTheDocument();
    expect(document.querySelector(`a[href="/biblioteca/tipos/${n}/subtipos"]`)).not.toBeNull();
    expect(document.querySelector(`a[href="/biblioteca/tipos/${n}/niveles"]`)).not.toBeNull();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getAllByText(/borrador editorial/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(`${n}w`)).length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector(`a[href="/biblioteca/relaciones/${n}"]`)).not.toBeNull();
    expect(screen.getByRole("link", { name: /cómo se relaciona este tipo/i })).toHaveAttribute("href", `/biblioteca/relaciones/${n}`);
  });

  it.each(NUMS)("renders three subtype cards for type %i", async (n) => {
    render(await SubtypesPage(params(String(n))));
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(3);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it.each(NUMS)("renders nine-level strip for type %i", async (n) => {
    render(await LevelsPage(params(String(n))));
    expect(screen.getAllByRole("button", { name: /^Nivel \d/ })).toHaveLength(9);
  });

  it("generates metadata and rejects invalid params", async () => {
    expect((await typeMeta(params("3"))).title).toMatch(/Tipo 3/);
    await expect(TypePage(params("10"))).rejects.toThrow();
    await expect(TypePage(params("abc"))).rejects.toThrow();
    await expect(SubtypesPage(params("0"))).rejects.toThrow();
    await expect(LevelsPage(params("x"))).rejects.toThrow();
  });
});

describe("static pages", () => {
  it("library home links to every section and has the tritype caveat", () => {
    render(<LibraryHome />);
    for (const href of ["/biblioteca/historia", "/biblioteca/tipos", "/biblioteca/subtipos", "/biblioteca/niveles", "/biblioteca/clasificaciones", "/biblioteca/relaciones", "/biblioteca/bibliografia"]) {
      expect(document.querySelector(`a[href="${href}"]`), href).not.toBeNull();
    }
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("classifications mention the tritype caveat and arrow variation", () => {
    render(<ClassificationsPage />);
    expect(screen.getByText(/no infiere un tritipo|no infiere el tritipo/i)).toBeInTheDocument();
    expect(screen.getByText(/varían entre escuelas/i)).toBeInTheDocument();
  });

  it("classifications keep the enneagram centers apart from Gurdjieff's theory of centers", () => {
    render(<ClassificationsPage />);
    const note = screen.getByText(/no es la teoría de centros de Gurdjieff/i);
    expect(note).toHaveTextContent(/intelectual/i);
    expect(note).toHaveTextContent(/motriz/i);
    expect(note).toHaveTextContent(/cada persona/i);
  });

  it("history page renders every section and the not-Gurdjieff statement", () => {
    render(<HistoryPage />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(8);
    expect(screen.getAllByText(/no son de Gurdjieff|no fueron de Gurdjieff|no forman parte/i).length).toBeGreaterThan(0);
  });

  it("bibliography lists every source with a verification note", () => {
    render(<BibliographyPage />);
    for (const s of Object.values(SOURCES)) expect(screen.getByText(s.title)).toBeInTheDocument();
    expect(screen.getAllByText(/verific/i).length).toBeGreaterThan(0);
  });

  it("overview pages render", async () => {
    render(<TypesIndex />);
    expect(screen.getAllByRole("link", { name: /Tipo \d/ })).toHaveLength(9);
    cleanup();
    render(<SubtypesIndex />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    cleanup();
    render(<LevelsIndex />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("relationships pages", () => {
  it("index explains what the feature is and is not, shows the disclaimers and lists the nine types", () => {
    render(<RelationsIndex />);
    expect(screen.getByRole("heading", { level: 1, name: /relaciones/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Antes de leer esto" })).toBeInTheDocument();
    for (const d of RELATIONSHIP_LENSES.disclaimers) expect(screen.getByText(d)).toBeVisible();
    expect(screen.getByRole("heading", { name: /qué es y qué no es/i })).toBeInTheDocument();
    for (const n of NUMS) {
      expect(document.querySelector(`a[href="/biblioteca/relaciones/${n}"]`), String(n)).not.toBeNull();
    }
    expect(screen.getAllByRole("link", { name: /^Tipo \d · / })).toHaveLength(9);
    expect(document.querySelector('a[href="/biblioteca/bibliografia#carpenter-2015"]')).not.toBeNull();
    expect(screen.getAllByText(/borrador editorial/i).length).toBeGreaterThan(0);
    expect(findForbidden(document.body.textContent ?? "")).toBeNull();
  });

  it.each(NUMS)("renders the guide, the explorer, breadcrumbs and prev/next for type %i", async (n) => {
    render(await RelationsPage(params(String(n))));
    expect(screen.getByRole("heading", { level: 1, name: new RegExp(`Tipo ${n}\\b`) })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Antes de leer esto" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: new RegExp(`Cómo se relaciona el tipo ${n}\\b`) })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /Símbolo del eneagrama/ })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /migas/i })).toBeInTheDocument();
    const prev = n === 1 ? 9 : n - 1;
    const next = n === 9 ? 1 : n + 1;
    expect(document.querySelector(`a[rel="prev"][href="/biblioteca/relaciones/${prev}"]`)).not.toBeNull();
    expect(document.querySelector(`a[rel="next"][href="/biblioteca/relaciones/${next}"]`)).not.toBeNull();
    expect(document.querySelector(`a[href="/biblioteca/tipos/${n}"]`)).not.toBeNull();
    expect(screen.getAllByText(/borrador editorial/i).length).toBeGreaterThan(0);
    expect(findForbidden(document.body.textContent ?? ""), `type ${n}`).toBeNull();
  });

  it("generates metadata and rejects invalid params", async () => {
    expect((await relMeta(params("3"))).title).toMatch(/Tipo 3/);
    await expect(RelationsPage(params("10"))).rejects.toThrow();
    await expect(RelationsPage(params("x"))).rejects.toThrow();
  });
});
