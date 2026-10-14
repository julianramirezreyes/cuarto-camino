import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page, TestInfo } from "@playwright/test";
import { expect, test } from "./fixtures";
import { completeAssessment, hasNoHorizontalOverflow } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Lo que la función NUNCA debe decir: sin veredictos, puntajes, porcentajes ni lenguaje de compatibilidad. */
const PROHIBIDO = /compatib|alma gemela|media naranja|mejor(?:es)? (?:pareja|combinaci)|peor(?:es)? (?:pareja|combinaci)|puntaje|puntuaci[oó]n|%|[❤♥♡💕💘💞]/i;

const nodo = (page: Page, n: number) => page.getByRole("button", { name: new RegExp(`^Eneatipo ${n}(,|$)`) });

async function sinPalabrasProhibidas(zona: Locator, nombre: string) {
  const texto = await zona.innerText();
  expect(texto.match(PROHIBIDO)?.[0] ?? null, `texto prohibido en ${nombre}`).toBeNull();
}

/** Falla con serious/critical; los demás hallazgos se adjuntan al informe. */
async function escanear(page: Page, nombre: string, testInfo: TestInfo) {
  await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  await testInfo.attach(`axe-${nombre}.json`, { body: JSON.stringify(violations, null, 2), contentType: "application/json" });
  for (const v of violations.filter((x) => x.impact !== "serious" && x.impact !== "critical")) {
    testInfo.annotations.push({ type: `axe-${v.impact}`, description: `${nombre}: ${v.id} x${v.nodes.length}` });
  }
  const graves = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const resumen = graves.map((v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
  expect(resumen, `Violaciones graves de axe en ${nombre}`).toEqual([]);
}

async function listo(page: Page) {
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

test.describe("relaciones: biblioteca", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("el índice lista los nueve tipos y muestra siempre el marco honesto", async ({ page }) => {
    await page.goto("/biblioteca/relaciones");
    await listo(page);
    await expect(page.getByRole("heading", { level: 1, name: "Relaciones" })).toBeVisible();

    const aviso = page.getByRole("note");
    await expect(aviso.getByRole("heading", { name: "Antes de leer esto" })).toBeVisible();
    await expect(aviso.getByRole("listitem")).toHaveCount(6);
    for (const item of await aviso.getByRole("listitem").all()) await expect(item).toBeVisible();

    await expect(page.getByRole("heading", { name: "Qué es y qué no es" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Qué dice la evidencia" })).toBeVisible();
    await expect(page.locator('main a[href^="/biblioteca/relaciones/"]')).toHaveCount(9);
    await expect(page.getByRole("link", { name: /^Tipo 4 · / })).toHaveAttribute("href", "/biblioteca/relaciones/4");
    await sinPalabrasProhibidas(page.locator("main"), "/biblioteca/relaciones");
  });

  test("la guía del tipo 4 cambia de vínculo y el diagrama lee dos tipos juntos", async ({ page }) => {
    await page.goto("/biblioteca/relaciones/4");
    await listo(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tipo 4");
    await expect(page.getByRole("heading", { name: "Antes de leer esto" })).toBeVisible();

    // Cambio de vínculo: la lista «Qué suele aportar» cambia de contenido.
    const aporta = page.getByRole("list", { name: "Qué suele aportar" });
    const amistad = await aporta.innerText();
    await expect(page.getByRole("button", { name: "Amistad" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Pareja" }).click();
    await expect(page.getByRole("button", { name: "Pareja" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Amistad" })).toHaveAttribute("aria-pressed", "false");
    await expect(aporta).not.toHaveText(amistad);

    // Región expandible.
    const abrir = page.getByRole("button", { name: /Para quien se relaciona con este tipo/ });
    await expect(abrir).toHaveAttribute("aria-expanded", "false");
    await abrir.click();
    await expect(abrir).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("region", { name: /Para quien se relaciona/ })).toBeVisible();

    // Otro tipo en el diagrama.
    await expect(page.getByRole("heading", { name: "Puntos en común y diferencias" })).toHaveCount(0);
    await nodo(page, 2).click();
    await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Puntos en común y diferencias" })).toBeVisible();
    await expect(page.getByRole("region", { name: /Cómo suele vivir el tipo 2 este vínculo: Pareja/ })).toBeVisible();

    // El mismo tipo.
    await nodo(page, 4).click();
    await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 4" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dos personas del mismo tipo", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Puntos en común y diferencias" })).toHaveCount(0);

    await sinPalabrasProhibidas(page.locator("main"), "/biblioteca/relaciones/4");
  });

  test("se puede elegir el otro tipo solo con el teclado", async ({ page }) => {
    await page.goto("/biblioteca/relaciones/4");
    await listo(page);
    await nodo(page, 5).focus();
    await page.keyboard.press("ArrowRight"); // 5 → 6
    await expect(nodo(page, 6)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(nodo(page, 6)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 6" })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 5" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Flechas y ala" })).toBeVisible(); // 4 y 5 son vecinos
  });

  test("navegación anterior y siguiente entre tipos", async ({ page }) => {
    await page.goto("/biblioteca/relaciones/9");
    await listo(page);
    await expect(page.locator('a[rel="next"]')).toHaveAttribute("href", "/biblioteca/relaciones/1");
    await expect(page.locator('a[rel="prev"]')).toHaveAttribute("href", "/biblioteca/relaciones/8");
    await page.goto("/biblioteca/tipos/3");
    await page.getByRole("link", { name: "Cómo se relaciona este tipo" }).click();
    await expect(page).toHaveURL(/\/biblioteca\/relaciones\/3$/);
  });

  for (const esquema of ["light", "dark"] as const) {
    test(`axe: índice y guía (${esquema}) sin violaciones graves`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: esquema, reducedMotion: "reduce" });
      await page.goto("/biblioteca/relaciones");
      await listo(page);
      await escanear(page, `relaciones-${esquema}`, testInfo);

      await page.goto("/biblioteca/relaciones/4");
      await listo(page);
      await escanear(page, `relaciones-4-${esquema}`, testInfo);

      await page.getByRole("button", { name: /Para quien se relaciona con este tipo/ }).click();
      await nodo(page, 2).click();
      await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 2" })).toBeVisible();
      await escanear(page, `relaciones-4-par-${esquema}`, testInfo);
    });
  }

  test("en móvil no hay desbordamiento horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/biblioteca/relaciones");
    await listo(page);
    expect(await hasNoHorizontalOverflow(page), "índice desborda").toBe(true);
    await page.goto("/biblioteca/relaciones/4");
    await listo(page);
    expect(await hasNoHorizontalOverflow(page), "guía desborda").toBe(true);
    await page.getByRole("button", { name: /Para quien se relaciona con este tipo/ }).click();
    await nodo(page, 8).click();
    await expect(page.getByRole("heading", { name: "Tipo 4 con tipo 8" })).toBeVisible();
    expect(await hasNoHorizontalOverflow(page), "lectura de pareja desborda").toBe(true);
  });
});

test.describe("relaciones: resultado", () => {
  test.setTimeout(300_000);

  test("la pestaña «Relaciones» tiene el marco honesto, tu guía y un explorador que funciona", async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await completeAssessment(page, "cycle");
    await expect(page.getByText("Interpretación provisional")).toBeVisible();
    const titulo = await page.getByRole("heading", { level: 1 }).innerText();
    const tipo = Number(titulo.match(/^Tipo (\d)/)![1]);

    const tab = page.getByRole("tab", { name: "Relaciones", exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel", { name: "Relaciones" });
    await expect(panel.getByRole("heading", { name: "Antes de leer esto" })).toBeVisible();
    await expect(panel.getByRole("note").getByRole("listitem")).toHaveCount(6);
    await expect(panel.getByRole("heading", { name: new RegExp(`Cómo se relaciona el tipo ${tipo}\\b`) })).toBeVisible();

    // Explorador de pares con un tipo distinto del propio (sin afirmar cuál es el tuyo).
    const otro = tipo === 1 ? 2 : 1;
    await expect(panel.getByRole("heading", { name: "Puntos en común y diferencias" })).toHaveCount(0);
    await panel.getByRole("button", { name: new RegExp(`^Eneatipo ${otro}(,|$)`) }).click();
    await expect(panel.getByRole("heading", { name: `Tipo ${tipo} con tipo ${otro}` })).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Puntos en común y diferencias" })).toBeVisible();
    await panel.getByRole("button", { name: "Familia" }).click();
    await expect(panel.getByRole("region", { name: new RegExp(`tipo ${otro} este vínculo: Familia`) })).toBeVisible();

    // El mismo tipo.
    await panel.getByRole("button", { name: new RegExp(`^Eneatipo ${tipo}(,|$)`) }).click();
    await expect(panel.getByRole("heading", { name: "Dos personas del mismo tipo", exact: true })).toBeVisible();

    await sinPalabrasProhibidas(panel, "pestaña Relaciones");
    await panel.getByRole("button", { name: new RegExp(`^Eneatipo ${otro}(,|$)`) }).click();
    await expect(panel.getByRole("heading", { name: `Tipo ${tipo} con tipo ${otro}` })).toBeVisible();
    await escanear(page, "resultado-relaciones", testInfo);

    // Móvil: sin desbordamiento con la lectura de pareja abierta.
    await page.setViewportSize({ width: 360, height: 740 });
    expect(await hasNoHorizontalOverflow(page), "resultado/Relaciones desborda").toBe(true);
  });
});
