import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { completeAssessment } from "./helpers";

// El informe tiene dos diagramas (resumen de la cabecera y pestaña «Conexiones»): estos nodos son los de la pestaña abierta.
const nodo = (page: Page, n: number) => page.getByRole("tabpanel").getByRole("button", { name: new RegExp(`^Eneatipo ${n}(,|$)`) });
const pestana = (page: Page, nombre: string) => page.getByRole("tab", { name: nombre, exact: true });

async function abrir(page: Page, nombre: string) {
  await pestana(page, nombre).click();
  await expect(pestana(page, nombre)).toHaveAttribute("aria-selected", "true");
}

async function pulsado(boton: Locator, valor: boolean) {
  await expect(boton).toHaveAttribute("aria-pressed", String(valor));
}

test.describe("evaluación completa de extremo a extremo", () => {
  test.setTimeout(300_000);

  test("se completa por la UI y el resultado es provisional, con 13 secciones exploradas", async ({ page }) => {
    const { id, answers } = await completeAssessment(page, "cycle");
    expect(answers).toBeGreaterThan(0);
    expect(answers).toBeLessThanOrEqual(120);

    // Cabecera honesta (no se afirma ningún tipo concreto: el cuestionario no está validado).
    await expect(page.getByText("Interpretación provisional")).toBeVisible();
    const titulo = page.getByRole("heading", { level: 1 });
    await expect(titulo).toHaveText(/^Tipo [1-9] · /);
    const tipo = Number((await titulo.innerText()).match(/^Tipo (\d)/)![1]);

    const cabecera = page.locator("header", { hasText: "Interpretación provisional" });
    await expect(cabecera.getByRole("heading", { name: "Afinidad relativa" })).toBeVisible();
    await expect(cabecera).toContainText("afinidad relativa");
    await expect(cabecera).toContainText(/No es una probabilidad ni un diagnóstico/);
    await expect(cabecera).not.toContainText(/precisi[oó]n/i);
    await expect(cabecera.getByRole("meter").first()).toBeVisible();

    // Resumen del eneagrama completo en la cabecera, con tu tipo marcado y lo que el test sugiere de ti.
    const resumen = page.getByRole("region", { name: "Tu lugar en el eneagrama" });
    await expect(resumen).toBeVisible();
    await expect(resumen.getByRole("button", { name: new RegExp(`^Eneatipo ${tipo}(,|$)`) })).toHaveAttribute("aria-pressed", "true");
    await expect(resumen.getByRole("list", { name: "Leyenda de grupos" })).toBeVisible();
    await expect(resumen.getByText(/^Instinto /)).toBeVisible();

    // Selector de tus tipos más cercanos: tocar una alternativa abre todo sobre ese tipo; tocar el tuyo vuelve.
    const cercanos = cabecera.getByRole("group", { name: "Tus tipos más cercanos" });
    const botones = cercanos.getByRole("button");
    await expect(botones).toHaveCount(3);
    await expect(botones.first()).toHaveAttribute("aria-pressed", "true");
    const alternativa = botones.nth(1);
    const etiqueta = (await alternativa.innerText()).replace(/\s*›\s*$/, "").trim(); // «Tipo N · Nombre»
    const tipoAlt = Number(etiqueta.match(/^Tipo (\d)/)![1]);
    await alternativa.scrollIntoViewIfNeeded(); // Playwright ya lo haría al hacer clic; se mide después de eso.
    const scrollAntes = await page.evaluate(() => window.scrollY);
    await alternativa.click();
    const avisoExplorando = page.getByRole("status", { name: "Explorando otro eneatipo" });
    await expect(avisoExplorando).toContainText(`tipo ${tipoAlt}`);
    await expect(alternativa).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("tabpanel").first()).toContainText(`Personalidad del tipo ${tipoAlt}`);
    // Elegir un tipo en la cabecera no mueve la página: la persona se queda donde hizo clic.
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollAntes)).toBeLessThan(8);
    await expect(titulo).toHaveText(new RegExp(`^Tipo ${tipo} · `)); // tu resultado no cambia
    // Al leer otro tipo siguen visibles los datos que son de la persona (instinto y estado), no solo los del tipo.
    await pestana(page, "Tus instintos").click();
    await expect(page.getByRole("tabpanel").getByRole("meter")).toHaveCount(3);
    await expect(page.getByRole("tabpanel")).toContainText(/no depende del tipo/);
    await pestana(page, "Tu estado actual").click();
    await expect(page.getByRole("tabpanel")).toContainText(/Banda más afín|ninguna banda destaca/);
    await pestana(page, "Tu ala").click();
    await expect(page.getByRole("tabpanel")).toContainText(/preguntas de ala se hicieron para tu tipo/);
    await botones.first().click();
    await expect(avisoExplorando).toHaveCount(0);
    await expect(botones.first()).toHaveAttribute("aria-pressed", "true");

    // Trece pestañas.
    await expect(page.getByRole("tab")).toHaveCount(13);
    await expect(pestana(page, "Tu personalidad")).toHaveAttribute("aria-selected", "true");

    // Navegación por teclado entre pestañas (flechas, Fin, Inicio).
    await pestana(page, "Tu personalidad").focus();
    await page.keyboard.press("ArrowRight");
    await expect(pestana(page, "Tus alternativas")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(pestana(page, "Bibliografía")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(pestana(page, "Tu personalidad")).toHaveAttribute("aria-selected", "true");

    // Alas: elegir un ala y dejarla abierta.
    await abrir(page, "Tu ala");
    const alas = page.getByRole("group", { name: "Elegir ala" });
    await expect(alas.getByRole("button")).toHaveCount(3);
    const primeraAla = alas.getByRole("button").first();
    await primeraAla.click();
    await pulsado(primeraAla, true);
    await expect(page.getByText("Frente a la otra ala")).toBeVisible();
    const abierta = alas.getByRole("button", { name: "Dejar mi ala por explorar" });
    await abierta.click();
    await pulsado(abierta, true);
    await expect(page.getByText(/Dejar el ala abierta es una opción válida/)).toBeVisible();

    // Instintos: sp / so / sx exploráveis, y las combinaciones son material educativo.
    await abrir(page, "Tus instintos");
    const instintos = page.getByRole("group", { name: "Explorar instintos" });
    for (const sigla of ["sp", "so", "sx"]) {
      const boton = instintos.getByRole("button", { name: new RegExp(`\\(${sigla}\\)`) });
      await boton.click();
      await pulsado(boton, true);
      await expect(page.getByText("Frente a los otros dos subtipos")).toBeVisible();
    }
    await expect(page.getByText(/no es un resultado tuyo/)).toBeVisible();

    // Estado actual / niveles: seleccionar un nivel muestra su perfil y el aviso.
    await abrir(page, "Tu estado actual");
    const nivel5 = page.getByRole("button", { name: /^Nivel 5/ });
    await nivel5.click();
    await pulsado(nivel5, true);
    await expect(page.getByRole("heading", { name: /^Nivel 5 · / })).toBeVisible();
    await expect(page.getByText(/sin validación clínica/).first()).toBeVisible();
    await expect(page.getByText(/no es una medida clínica/)).toBeVisible();

    // Conexiones: alternar integración y estrés.
    await abrir(page, "Conexiones");
    const integracion = page.getByRole("button", { name: "Mostrar integración" });
    const estres = page.getByRole("button", { name: "Mostrar estrés" });
    await pulsado(integracion, true);
    await pulsado(estres, true);
    const conIntegracion = page.getByRole("tabpanel").getByRole("button", { name: /dirección de integración tradicional/ });
    const conEstres = page.getByRole("tabpanel").getByRole("button", { name: /dirección de estrés tradicional/ });
    await expect(conIntegracion).toHaveCount(1);
    await expect(conEstres).toHaveCount(1);
    await integracion.click();
    await pulsado(integracion, false);
    await expect(conIntegracion).toHaveCount(0);
    await expect(conEstres).toHaveCount(1);
    await estres.click();
    await pulsado(estres, false);
    await expect(conEstres).toHaveCount(0);
    await integracion.click();
    await estres.click();
    await expect(conIntegracion).toHaveCount(1);

    // Explorar otro eneatipo con el diagrama: no es "tu resultado", se puede volver.
    const otro = tipo === 1 ? 2 : 1;
    await nodo(page, otro).click();
    const aviso = page.getByRole("status", { name: "Explorando otro eneatipo" });
    await expect(aviso).toContainText(`Estás explorando el tipo ${otro}`);
    await expect(aviso).toContainText("Esto no es tu resultado");
    await expect(page.getByRole("tab")).toHaveCount(11); // sin "Tus alternativas" ni "Cómo se obtuvo"
    await expect(pestana(page, "Tus alternativas")).toHaveCount(0);
    await aviso.getByRole("button", { name: "Volver a mi resultado" }).click();
    await expect(aviso).toBeHidden();
    await expect(page.getByRole("tab")).toHaveCount(13);

    // Cómo se obtuvo y bibliografía existen y no hablan de precisión del test.
    await abrir(page, "Cómo se obtuvo");
    await expect(page.getByRole("tabpanel")).not.toContainText(/alta precisi[oó]n|precisi[oó]n del (test|resultado|cuestionario)/i);
    await abrir(page, "Bibliografía");
    await expect(page.getByRole("tabpanel")).toBeVisible();

    // Reiniciar: cancelar no borra; confirmar elimina.
    await page.getByRole("button", { name: "Reiniciar evaluación" }).click();
    const dialogo = page.getByRole("dialog", { name: "¿Reiniciar la evaluación?" });
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByRole("button", { name: "Cancelar" })).toBeFocused();
    await dialogo.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialogo).toBeHidden();
    expect((await page.request.get(`/api/assessments/${id}/result`)).status()).toBe(200);

    await page.getByRole("button", { name: "Reiniciar evaluación" }).click();
    await dialogo.getByRole("button", { name: "Sí, reiniciar" }).click();
    await expect(page.getByRole("heading", { name: "Evaluación eliminada" })).toBeVisible();

    // Estado eliminado: ya no hay resultado accesible ni evaluación en curso.
    expect((await page.request.get(`/api/assessments/${id}/result`)).status()).toBe(404);
    expect((await page.request.get("/api/assessments/current")).status()).toBe(404);

    // Una visita nueva a /evaluacion (carga completa) vuelve a mostrar el consentimiento.
    await page.goto("/evaluacion");
    await expect(page.getByRole("heading", { name: "Antes de empezar" })).toBeVisible({ timeout: 30_000 });
  });

  // Regresión: con cacheComponents Next conserva el estado de las rutas ya visitadas (Activity). Antes,
  // AssessmentFlow volvía a disparar `router.push("/resultado")` con su estado «done» conservado y el enlace
  // «Empezar una nueva evaluación» rebotaba al resultado. Ver src/hooks/use-redirect-on-done.ts.
  test("tras reiniciar, «Empezar una nueva evaluación» lleva al consentimiento", async ({ page }) => {
    await completeAssessment(page, "cycle");
    await page.getByRole("button", { name: "Reiniciar evaluación" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Sí, reiniciar" }).click();
    await expect(page.getByRole("heading", { name: "Evaluación eliminada" })).toBeVisible();
    await page.getByRole("link", { name: "Empezar una nueva evaluación" }).click();
    await expect(page).toHaveURL(/\/evaluacion$/, { timeout: 5_000 });
    await expect(page.getByRole("heading", { name: "Antes de empezar" })).toBeVisible({ timeout: 5_000 });
  });
});
