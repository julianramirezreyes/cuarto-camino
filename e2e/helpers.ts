import { expect, type Page } from "@playwright/test";

/** Sección de la pregunta visible (`aria-labelledby="question-<id>"`). */
export const QUESTION = 'section[aria-labelledby^="question-"]';

/** Estrategias deterministas de respuesta (a través de la UI no se puede forzar un tipo). */
export type Strategy = "first" | "last" | "cycle" | "zigzag" | ((index: number, options: number) => number);

function pick(strategy: Strategy, i: number, n: number) {
  if (typeof strategy === "function") return strategy(i, n) % n;
  switch (strategy) {
    case "first":
      return 0;
    case "last":
      return n - 1;
    case "cycle":
      return i % n;
    case "zigzag":
      return i % 2 === 0 ? 0 : n - 1;
  }
}

export interface StartedAssessment {
  id: string;
  policyVersion: string;
}

/** Abre /evaluacion, acepta el consentimiento y empieza. Devuelve el id capturado de la red. */
export async function startAssessment(page: Page): Promise<StartedAssessment> {
  await page.goto("/evaluacion");
  // La primera consulta a la base (Neon) puede tardar si el proyecto estaba dormido o la máquina va cargada.
  await expect(page.getByRole("heading", { name: "Antes de empezar" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("checkbox", { name: /autorizo el tratamiento/i }).check();
  const [response] = await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).pathname === "/api/assessments" && r.request().method() === "POST"),
    page.getByRole("button", { name: "Comenzar" }).click(),
  ]);
  expect(response.status()).toBe(201);
  const body = (await response.json()) as { assessment: { id: string } };
  await expect(page.locator(QUESTION)).toBeVisible();
  return { id: body.assessment.id, policyVersion: response.request().postDataJSON().policyVersion };
}

/** Id de la pregunta mostrada (parte final de `aria-labelledby`). */
export async function currentQuestionId(page: Page) {
  const label = await page.locator(QUESTION).getAttribute("aria-labelledby");
  return label!.replace(/^question-/, "");
}

/** Elige la opción `index` (base 0) de la pregunta visible y espera a que cambie la pregunta (o el resultado). */
export async function answerCurrent(page: Page, index: number) {
  const before = await currentQuestionId(page);
  const options = page.locator(QUESTION).getByRole("button");
  await expect(options.first()).toBeEnabled();
  await options.nth(index).click();
  await waitForNext(page, before);
}

/** Espera a que la pregunta mostrada deje de ser `previousId`, o a que se llegue al resultado. */
export async function waitForNext(page: Page, previousId: string) {
  await page.waitForFunction(
    ([sel, prev]) => {
      if (location.pathname === "/resultado") return true;
      if (document.querySelector('[role="alert"]')) return true;
      const section = document.querySelector(sel);
      return section ? section.getAttribute("aria-labelledby") !== `question-${prev}` : false;
    },
    [QUESTION, previousId] as const,
  );
}

/**
 * Responde por la UI hasta llegar a /resultado. Tope de seguridad: 120 respuestas.
 * Devuelve cuántas respuestas dio.
 */
export async function answerUntilDone(page: Page, strategy: Strategy = "cycle", max = 120): Promise<number> {
  let answered = 0;
  let retries = 0;
  while (answered < max) {
    await page.waitForFunction(
      (sel) => location.pathname === "/resultado" || !!document.querySelector(sel) || !!document.querySelector('[role="alert"]'),
      QUESTION,
    );
    if (new URL(page.url()).pathname === "/resultado") return answered;

    const retry = page.getByRole("button", { name: "Reintentar" });
    if (await retry.isVisible()) {
      expect(++retries, "demasiados errores consecutivos al responder").toBeLessThan(4);
      await retry.click();
      await expect(retry).toBeHidden();
      continue;
    }

    const before = await currentQuestionId(page);
    const options = page.locator(QUESTION).getByRole("button");
    await expect(options.first()).toBeEnabled();
    const count = await options.count();
    await options.nth(pick(strategy, answered, count)).click();
    answered++;
    await waitForNext(page, before);
  }
  await expect(page, `no se llegó al resultado en ${max} respuestas`).toHaveURL(/\/resultado$/, { timeout: 100 });
  return answered;
}

/** Consentimiento + inicio + respuestas hasta el resultado. */
export async function completeAssessment(page: Page, strategy: Strategy = "cycle") {
  const started = await startAssessment(page);
  const answers = await answerUntilDone(page, strategy);
  await expect(page).toHaveURL(/\/resultado$/);
  return { ...started, answers };
}

/** `true` si la página no desborda horizontalmente. */
export const hasNoHorizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
