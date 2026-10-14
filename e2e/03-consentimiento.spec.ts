import { expect, test } from "./fixtures";

test.describe("consentimiento", () => {
  test("no se puede empezar sin aceptar el consentimiento", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (r) => r.method() === "POST" && posts.push(new URL(r.url()).pathname));

    await page.goto("/evaluacion");
    await expect(page.getByRole("heading", { name: "Antes de empezar" })).toBeVisible();

    const comenzar = page.getByRole("button", { name: "Comenzar" });
    const casilla = page.getByRole("checkbox", { name: /autorizo el tratamiento/i });
    await expect(casilla).not.toBeChecked();
    await expect(comenzar).toBeDisabled();

    // Enter dentro del formulario tampoco envía sin consentimiento.
    await casilla.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Antes de empezar" })).toBeVisible();

    await casilla.check();
    await expect(comenzar).toBeEnabled();
    await casilla.uncheck();
    await expect(comenzar).toBeDisabled();

    expect(posts, "no debe haberse creado ninguna evaluación").toEqual([]);
  });

  test("el texto de consentimiento explica qué se guarda y que el resultado es provisional", async ({ page }) => {
    await page.goto("/evaluacion");
    for (const t of ["Qué guardamos", "Por qué", "Puedes eliminarlo", "Un resultado provisional"]) {
      await expect(page.getByRole("heading", { name: t })).toBeVisible();
    }
    await expect(page.getByText(/Ley 1581 de 2012/)).toBeVisible();
  });
});
