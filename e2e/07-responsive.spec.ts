import { expect, test } from "./fixtures";
import { hasNoHorizontalOverflow } from "./helpers";

const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const PAGES: { ruta: string; listo: RegExp | string }[] = [
  { ruta: "/", listo: "Descubre tus patrones" },
  { ruta: "/introduccion", listo: "Antes de comenzar" },
  { ruta: "/evaluacion", listo: "Antes de empezar" }, // consentimiento
  { ruta: "/biblioteca", listo: "Biblioteca del eneagrama" },
  { ruta: "/biblioteca/tipos/4", listo: /Tipo 4/ },
];

// Botones y enlaces con forma de botón (los enlaces dentro de un párrafo quedan exentos).
const OBJETIVOS = 'main :is(button, a)[class*="min-h-"], main button, main a.inline-flex';

for (const vp of VIEWPORTS) {
  test(`sin desbordamiento horizontal y con objetivos táctiles ≥ 44px a ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp);
    for (const { ruta, listo } of PAGES) {
      await page.goto(ruta);
      await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(listo);
      // Esperar a que el diagrama/tipografías estén listas antes de medir.
      await page.evaluate(() => document.fonts.ready);

      expect(await hasNoHorizontalOverflow(page), `${ruta} desborda horizontalmente a ${vp.width}px`).toBe(true);

      const pequenos = await page.locator(OBJETIVOS).evaluateAll((els) =>
        els
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
          })
          .map((el) => ({ texto: (el.textContent ?? "").trim().slice(0, 40), alto: Math.round(el.getBoundingClientRect().height) }))
          .filter((o) => o.alto < 44),
      );
      expect(pequenos, `${ruta}: objetivos táctiles menores de 44px a ${vp.width}px`).toEqual([]);
    }
  });
}

test("la página de resultado y el cuestionario tampoco desbordan en el móvil más estrecho", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const { startAssessment } = await import("./helpers");
  await startAssessment(page);
  expect(await hasNoHorizontalOverflow(page), "pregunta desborda").toBe(true);
  const alto = await page
    .locator('section[aria-labelledby^="question-"]')
    .getByRole("button")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  expect(Math.min(...alto)).toBeGreaterThanOrEqual(44);
});
