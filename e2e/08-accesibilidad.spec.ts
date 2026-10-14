import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";
import { expect, test } from "./fixtures";
import { answerCurrent, completeAssessment, startAssessment } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Falla con serious/critical; los moderate/minor se adjuntan al informe sin fallar. */
async function escanear(page: Page, nombre: string, testInfo: TestInfo) {
  // Se mide el estado final: sin transiciones ni animaciones a medias (axe leería colores intermedios).
  await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  await testInfo.attach(`axe-${nombre}.json`, { body: JSON.stringify(violations, null, 2), contentType: "application/json" });
  // Los hallazgos moderate/minor no fallan el test pero quedan anotados en el informe HTML.
  for (const v of violations.filter((x) => x.impact !== "serious" && x.impact !== "critical")) {
    testInfo.annotations.push({ type: `axe-${v.impact}`, description: `${nombre}: ${v.id} x${v.nodes.length}` });
  }
  const graves = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const resumen = graves.map((v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
  expect(resumen, `Violaciones graves de axe en ${nombre}`).toEqual([]);
}

const ESTATICAS: [string, string][] = [
  ["/", "portada"],
  ["/introduccion", "introduccion"],
  ["/evaluacion", "consentimiento"],
  ["/biblioteca", "biblioteca"],
  ["/biblioteca/tipos/4", "tipo-4"],
  ["/cuenta/entrar", "cuenta-entrar"],
  ["/cuenta/registro", "cuenta-registro"],
];

test.describe("accesibilidad (axe, WCAG 2.2 AA)", () => {
  // Sin animaciones de entrada: axe debe leer el estado final (la app respeta prefers-reduced-motion).
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const esquema of ["light", "dark"] as const) {
    for (const [ruta, nombre] of ESTATICAS) {
      test(`${nombre} (${esquema}) no tiene violaciones graves`, async ({ page }, testInfo) => {
        await page.emulateMedia({ colorScheme: esquema, reducedMotion: "reduce" });
        await page.goto(ruta);
        await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await escanear(page, `${nombre}-${esquema}`, testInfo);
      });
    }
  }

  test("la pantalla de pregunta no tiene violaciones graves", async ({ page }, testInfo) => {
    await startAssessment(page);
    await answerCurrent(page, 0);
    await expect(page.locator('section[aria-labelledby^="question-"]')).toBeVisible();
    await escanear(page, "pregunta", testInfo);

    await page.getByRole("button", { name: "Pausar" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await escanear(page, "dialogo-pausa", testInfo);
  });

  test("el resultado (y sus pestañas principales) no tiene violaciones graves", async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    await completeAssessment(page, "cycle");
    await expect(page.getByText("Interpretación provisional")).toBeVisible();
    await escanear(page, "resultado", testInfo);

    for (const pestana of ["Tu ala", "Tus instintos", "Tu estado actual", "Conexiones", "Fortalezas"]) {
      await page.getByRole("tab", { name: pestana, exact: true }).click();
      await expect(page.getByRole("tab", { name: pestana, exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toBeVisible();
      await escanear(page, `resultado-${pestana.toLowerCase().replace(/\s+/g, "-")}`, testInfo);
    }

    await page.getByRole("button", { name: "Reiniciar evaluación" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await escanear(page, "dialogo-reiniciar", testInfo);
  });
});
