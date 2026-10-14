import { expect, test } from "./fixtures";

test.describe("humo", () => {
  test("la portada carga, tiene título y el CTA lleva a la evaluación", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      // Un visitante nuevo no tiene evaluación: GET /api/assessments/current responde 404 (esperado).
      if (m.location().url.includes("/api/assessments/current")) return;
      errors.push(`console: ${m.text()}`);
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/Cuarto Camino/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Descubre tus patrones");

    await page.getByRole("link", { name: "Comenzar mi descubrimiento" }).click();
    await expect(page).toHaveURL(/\/introduccion$/);
    await expect(page.getByRole("heading", { level: 1, name: "Antes de comenzar" })).toBeVisible();

    await page.getByRole("link", { name: "Entiendo, continuar" }).click();
    await expect(page).toHaveURL(/\/evaluacion$/);
    await expect(page.getByRole("heading", { level: 1, name: "Antes de empezar" })).toBeVisible();

    expect(errors, "errores de consola inesperados").toEqual([]);
  });

  test("la biblioteca y la página de un tipo se muestran sin errores", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/biblioteca");
    await expect(page).toHaveTitle(/Biblioteca/);
    await expect(page.getByRole("heading", { level: 1, name: "Biblioteca del eneagrama" })).toBeVisible();

    await page.goto("/biblioteca/tipos/4");
    await expect(page).toHaveTitle(/Tipo 4/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("/offline se muestra y es honesta sobre la conexión", async ({ page }) => {
    const response = await page.goto("/offline");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Sin conexión" })).toBeVisible();
    await expect(page.getByText(/necesita conexión a internet/)).toBeVisible();
  });

  test("el manifiesto es JSON válido con nombre e iconos", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toBe("Cuarto Camino");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
  });
});
