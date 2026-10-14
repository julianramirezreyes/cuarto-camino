import { expect, test } from "./fixtures";

const TIPOS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const nodo = (page: import("@playwright/test").Page, n: number) =>
  page.getByRole("button", { name: new RegExp(`^Eneatipo ${n}(,|$)`) });

test.describe("diagrama del eneagrama (portada)", () => {
  test("los nueve números se pueden seleccionar con clic y actualizan aria-pressed y el texto en vivo", async ({ page }) => {
    await page.goto("/");
    const live = page.getByText(/Toca un número para explorar el símbolo|^Tipo \d:/);
    await expect(live).toContainText("Toca un número");

    for (const n of TIPOS) {
      await nodo(page, n).click();
      await expect(nodo(page, n)).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByText(new RegExp(`^Tipo ${n}: `))).toBeVisible();
      // Solo uno seleccionado a la vez.
      await expect(page.locator('[role="button"][aria-pressed="true"]')).toHaveCount(1);
    }
  });

  test("se puede recorrer y seleccionar solo con el teclado (Tab, flechas, Enter y Espacio)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Explorar la biblioteca" }).focus();

    // Tab hasta el primer punto del diagrama (orden del DOM: 1, 2, ... 9).
    for (let i = 0; i < 6 && !(await nodo(page, 1).evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press("Tab");
    }
    await expect(nodo(page, 1)).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(nodo(page, 1)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/^Tipo 1: /)).toBeVisible();

    // Flechas siguen el anillo del símbolo (9, 1, 2, ... 8); Espacio selecciona.
    await page.keyboard.press("ArrowRight");
    await expect(nodo(page, 2)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(nodo(page, 2)).toHaveAttribute("aria-pressed", "true");
    await expect(nodo(page, 1)).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText(/^Tipo 2: /)).toBeVisible();

    // Hacia atrás da la vuelta: 2 → 1 → 9 → 8.
    await page.keyboard.press("ArrowLeft");
    await expect(nodo(page, 1)).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(nodo(page, 9)).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(nodo(page, 8)).toBeFocused();
    // Y hacia delante cierra el círculo: 8 → 9.
    await page.keyboard.press("ArrowDown");
    await expect(nodo(page, 9)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/^Tipo 9: /)).toBeVisible();
  });
});

const CENTRO: Record<number, string> = {
  1: "instintivo", 2: "emocional", 3: "emocional", 4: "emocional", 5: "mental", 6: "mental", 7: "mental", 8: "instintivo", 9: "instintivo",
};

test.describe("grupos en el diagrama", () => {
  test("la portada muestra los tres centros con leyenda y cada punto nombra el suyo (el color no es la única pista)", async ({ page }) => {
    await page.goto("/");
    const leyenda = page.getByRole("list", { name: "Leyenda de grupos" });
    await expect(leyenda).toContainText("Instintivo · 8, 9, 1");
    await expect(leyenda).toContainText("Emocional · 2, 3, 4");
    await expect(leyenda).toContainText("Mental · 5, 6, 7");
    await expect(page.locator("[data-group-mark]")).toHaveCount(9);
    for (const n of TIPOS) {
      await expect(page.getByRole("button", { name: new RegExp(`^Eneatipo ${n}, centro ${CENTRO[n]}`) })).toBeVisible();
    }
  });

  test("seleccionar un tipo resalta su grupo y atenúa los demás", async ({ page }) => {
    await page.goto("/");
    await nodo(page, 4).click();
    await expect(page.locator('[data-group-mark="3"]')).toHaveAttribute("data-emphasis", "on");
    await expect(page.locator('[data-group-mark="2"]')).toHaveAttribute("data-emphasis", "on");
    await expect(page.locator('[data-group-mark="8"]')).toHaveAttribute("data-emphasis", "off");
  });

  test("en la biblioteca se puede cambiar entre centros, estilos, armónicos y sin grupos", async ({ page }) => {
    await page.goto("/biblioteca");
    const leyenda = page.getByRole("list", { name: "Leyenda de grupos" });
    await expect(leyenda).toContainText("Instintivo");

    await page.getByRole("button", { name: "Estilos" }).click();
    await expect(leyenda).toContainText("Asertivo · 3, 7, 8");
    await expect(page.getByRole("button", { name: /^Eneatipo 7, estilo asertivo/ })).toBeVisible();

    await page.getByRole("button", { name: "Armónicos" }).click();
    await expect(leyenda).toContainText("Perspectiva positiva · 2, 7, 9");
    await expect(page.getByRole("button", { name: /^Eneatipo 4, grupo reactivo/ })).toBeVisible();

    await page.getByRole("button", { name: "Sin grupos" }).click();
    await expect(leyenda).toHaveCount(0);
    await expect(page.locator("[data-group-mark]")).toHaveCount(0);
    // Con los grupos ocultos todos los puntos siguen siendo seleccionables.
    await nodo(page, 5).click();
    await expect(nodo(page, 5)).toHaveAttribute("aria-pressed", "true");
  });
});
