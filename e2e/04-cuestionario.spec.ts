import type { Page } from "@playwright/test";
import { answerCurrent, currentQuestionId, QUESTION, startAssessment, waitForNext } from "./helpers";
import { expect, test } from "./fixtures";

const posicion = (page: import("@playwright/test").Page) => page.getByText(/^Pregunta \d+$/);
const numero = async (page: import("@playwright/test").Page) =>
  Number((await posicion(page).innerText()).replace("Pregunta ", ""));

test.describe("cuestionario", () => {
  test("al retroceder la etiqueta muestra la posición correcta y se puede cambiar una respuesta", async ({ page }) => {
    await startAssessment(page);
    await expect(posicion(page)).toHaveText("Pregunta 1");
    await expect(page.getByRole("button", { name: "Anterior" })).toBeDisabled();

    const ids: string[] = [await currentQuestionId(page)];
    for (let i = 0; i < 3; i++) {
      await answerCurrent(page, 0);
      ids.push(await currentQuestionId(page));
    }
    await expect(posicion(page)).toHaveText("Pregunta 4");

    // Regresión: al retroceder, la posición baja de uno en uno (4 → 3 → 2) y no se queda atascada.
    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(posicion(page)).toHaveText("Pregunta 3");
    expect(await currentQuestionId(page)).toBe(ids[2]);

    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(posicion(page)).toHaveText("Pregunta 2");
    expect(await currentQuestionId(page)).toBe(ids[1]);

    // La respuesta previa aparece marcada.
    await expect(page.locator(QUESTION).locator('button[aria-pressed="true"]')).toHaveCount(1);

    // Cambiar la respuesta: otra opción distinta de la marcada. El camino se vuelve a derivar y sigue adelante.
    const opciones = page.locator(QUESTION).getByRole("button");
    const marcada = await opciones.evaluateAll((els) => els.findIndex((e) => e.getAttribute("aria-pressed") === "true"));
    const otra = marcada === 0 ? 1 : 0;
    await answerCurrent(page, otra);
    expect(await numero(page)).toBeGreaterThanOrEqual(3);
    await expect(page.getByRole("button", { name: "Anterior" })).toBeEnabled();
  });

  test("las teclas de dígito eligen la opción correspondiente", async ({ page }) => {
    await startAssessment(page);
    const before = await currentQuestionId(page);
    const dos = page.locator(QUESTION).getByRole("button").nth(1);
    await expect(dos).toHaveAttribute("aria-keyshortcuts", "2");

    await page.keyboard.press("2");
    await waitForNext(page, before);
    await expect(posicion(page)).toHaveText("Pregunta 2");

    // Volvemos: la opción 2 quedó guardada.
    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(page.locator(QUESTION).getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
  });

  test("pausar y retomar: tras recargar se ofrece continuar donde se dejó", async ({ page }) => {
    await startAssessment(page);
    await answerCurrent(page, 0);
    await answerCurrent(page, 0);
    await expect(posicion(page)).toHaveText("Pregunta 3");
    const pendiente = await currentQuestionId(page);

    await page.getByRole("button", { name: "Pausar" }).click();
    const dialogo = page.getByRole("dialog", { name: "¿Quieres pausar?" });
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByRole("button", { name: "Seguir respondiendo" })).toBeFocused();

    // Escape cierra sin pausar.
    await page.keyboard.press("Escape");
    await expect(dialogo).toBeHidden();
    await expect(page.locator(QUESTION)).toBeVisible();

    await page.getByRole("button", { name: "Pausar" }).click();
    await dialogo.getByRole("button", { name: "Pausar y guardar" }).click();
    await expect(page.getByRole("heading", { name: "Pausa guardada" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Tienes una evaluación en curso" })).toBeVisible();
    await expect(page.getByText(/Guardamos 2 respuestas/)).toBeVisible();

    await page.getByRole("button", { name: "Continuar donde lo dejaste" }).click();
    await expect(page.locator(QUESTION)).toBeVisible();
    expect(await currentQuestionId(page)).toBe(pendiente);
    await expect(posicion(page)).toHaveText("Pregunta 3");
  });

  async function pausarEnLaPregunta3(page: Page) {
    await startAssessment(page);
    await answerCurrent(page, 0);
    await answerCurrent(page, 0);
    await expect(posicion(page)).toHaveText("Pregunta 3");
    await page.getByRole("button", { name: "Pausar" }).click();
    await page.getByRole("dialog", { name: "¿Quieres pausar?" }).getByRole("button", { name: "Pausar y guardar" }).click();
    await expect(page.getByRole("heading", { name: "Pausa guardada" })).toBeVisible();
  }

  // Regresión: el botón de la pausa antes era un enlace a /evaluacion (la misma página) y no hacía nada.
  test("en la pausa, «Seguir ahora» vuelve de inmediato a la misma pregunta y se puede seguir respondiendo", async ({ page }) => {
    await pausarEnLaPregunta3(page);
    await page.getByRole("button", { name: "Seguir ahora" }).click();
    await expect(page.locator(QUESTION)).toBeVisible();
    await expect(posicion(page)).toHaveText("Pregunta 3");
    await answerCurrent(page, 0);
    await expect(posicion(page)).toHaveText("Pregunta 4");
  });

  test("en la pausa, «Salir y seguir más tarde» lleva al inicio y al volver se ofrece continuar", async ({ page }) => {
    await pausarEnLaPregunta3(page);
    await page.getByRole("link", { name: "Salir y seguir más tarde" }).click();
    await expect(page).toHaveURL(/\/$/);
    // Volver por navegación normal (sin recargar): inicio → introducción → evaluación.
    await page.getByRole("link", { name: "Comenzar mi descubrimiento" }).click();
    await page.getByRole("link", { name: "Entiendo, continuar" }).click();
    await expect(page.getByRole("heading", { name: "Tienes una evaluación en curso" })).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: "Continuar donde lo dejaste" }).click();
    await expect(posicion(page)).toHaveText("Pregunta 3");
  });

  test("'Empezar de nuevo' descarta lo respondido y vuelve a la primera pregunta", async ({ page }) => {
    await startAssessment(page);
    await answerCurrent(page, 0);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Tienes una evaluación en curso" })).toBeVisible();
    await page.getByRole("button", { name: "Empezar de nuevo" }).click();
    await expect(page.locator(QUESTION)).toBeVisible();
    await expect(posicion(page)).toHaveText("Pregunta 1");
  });
});
