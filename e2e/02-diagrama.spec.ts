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
