import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test, type TestAccount } from "./fixtures";
import { completeAssessment } from "./helpers";

const origenDe = (baseURL: string | undefined) => ({ Origin: new URL(baseURL!).origin });

async function registrar(page: Page, cuenta: TestAccount) {
  await page.getByLabel(/^Nombre/).fill(cuenta.name);
  await page.getByLabel(/^Correo electrónico/).fill(cuenta.email);
  await page.getByLabel(/^Contraseña/).fill(cuenta.password);
  await page.getByRole("checkbox", { name: /Autorizo crear una cuenta/ }).check();
  await page.getByRole("button", { name: "Crear cuenta" }).click();
}

async function entrar(page: Page, cuenta: Pick<TestAccount, "email" | "password">) {
  await page.getByLabel(/^Correo electrónico/).fill(cuenta.email);
  await page.getByLabel(/^Contraseña/).fill(cuenta.password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test.describe("cuentas (sin correo configurado: sin verificación ni recuperación)", () => {
  test("el registro valida cada campo antes de enviar y no crea nada", async ({ page }) => {
    let altas = 0;
    page.on("request", (r) => {
      if (r.method() === "POST" && new URL(r.url()).pathname === "/api/auth/sign-up/email") altas++;
    });
    await page.goto("/cuenta/registro");
    const enviar = page.getByRole("button", { name: "Crear cuenta" });

    await enviar.click();
    await expect(page.getByLabel(/^Nombre/)).toBeFocused();
    await expect(page.getByLabel(/^Nombre/)).toHaveAttribute("aria-invalid", "true");

    await page.getByLabel(/^Nombre/).fill("Cuenta E2E");
    await enviar.click();
    await expect(page.getByLabel(/^Correo electrónico/)).toBeFocused();

    await page.getByLabel(/^Correo electrónico/).fill("esto-no-es-un-correo");
    await enviar.click();
    await expect(page.getByLabel(/^Correo electrónico/)).toHaveAttribute("aria-invalid", "true");

    await page.getByLabel(/^Correo electrónico/).fill("e2e+valida@example.invalid");
    await page.getByLabel(/^Contraseña/).fill("corta");
    await enviar.click();
    await expect(page.getByLabel(/^Contraseña/)).toBeFocused();
    await expect(page.getByLabel(/^Contraseña/)).toHaveAttribute("aria-invalid", "true");

    await page.getByLabel(/^Contraseña/).fill("una-contrasena-suficientemente-larga");
    await enviar.click();
    await expect(page.getByRole("checkbox", { name: /Autorizo crear una cuenta/ })).toBeFocused();
    expect(altas, "nada se envía al servidor mientras falte un dato válido").toBe(0);
  });

  test("entrar con datos incorrectos da el mismo mensaje exista o no la cuenta", async ({ page, account }) => {
    await page.goto("/cuenta/entrar");
    await entrar(page, { email: account.email, password: "contrasena-equivocada-123" });
    const mensaje = page.getByText("Correo o contraseña incorrectos.");
    await expect(mensaje).toBeVisible();

    await page.getByLabel(/^Correo electrónico/).fill(`otra+${Date.now()}@example.invalid`);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(mensaje).toBeVisible();
    await expect(page).toHaveURL(/\/cuenta\/entrar/);
  });

  test("sin cuenta no hay acceso a /cuenta ni sesión en la API", async ({ page, baseURL }) => {
    await page.goto("/cuenta");
    await expect(page.getByRole("heading", { name: "Mi cuenta" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Eliminar mi cuenta y mis datos" })).toHaveCount(0);
    const sesion = await page.request.get(`${new URL(baseURL!).origin}/api/auth/get-session`);
    expect(await sesion.json()).toBeNull();
  });

  test("invitado → crea cuenta → su resultado queda vinculado → salir, entrar de nuevo → eliminar todo", async ({
    page,
    account,
    newVisitor,
    baseURL,
  }) => {
    test.setTimeout(300_000);
    const origen = new URL(baseURL!).origin;

    // 1. Como invitado, completa la evaluación.
    const { id } = await completeAssessment(page, "cycle");
    await expect(page.getByText("Interpretación provisional")).toBeVisible();

    // 2. «Crear cuenta para conservar tu resultado» lleva al registro y vuelve al resultado.
    await page.getByRole("link", { name: "Crear cuenta para conservar tu resultado" }).click();
    await expect(page).toHaveURL(/\/cuenta\/registro\?next=%2Fresultado|\/cuenta\/registro\?next=\/resultado/);
    await registrar(page, account);
    await expect(page.getByText("Guardamos tu resultado en tu cuenta.")).toBeVisible({ timeout: 30_000 });
    await expect(page).toHaveURL(/\/resultado$/, { timeout: 30_000 });
    await expect(page.getByText("Interpretación provisional")).toBeVisible();
    await expect(page.getByRole("link", { name: account.name })).toBeVisible();
    await expect(page.getByRole("link", { name: "Crear cuenta para conservar tu resultado" })).toHaveCount(0);

    // 3. El resultado pertenece ahora a la cuenta: legible con su sesión, 404 para cualquier otro visitante.
    expect((await page.request.get(`${origen}/api/assessments/${id}/result`)).status()).toBe(200);
    const otro = await newVisitor();
    expect((await otro.request.get(`${origen}/api/assessments/${id}/result`)).status()).toBe(404);
    expect(
      (await otro.request.post(`${origen}/api/assessments/${id}/pause`, { headers: origenDe(baseURL) })).status(),
    ).toBe(404);

    // 4. La página de la cuenta muestra los datos y pasa axe (WCAG 2.2 AA).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cuenta");
    await expect(page.getByRole("heading", { name: "Mi cuenta" })).toBeVisible();
    await expect(page.getByText(account.email)).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`), "violaciones axe en /cuenta").toEqual([]);

    // 5. Cerrar sesión: el resultado deja de ser accesible y el encabezado vuelve a ofrecer «Entrar».
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page.getByRole("link", { name: "Entrar" }).first()).toBeVisible({ timeout: 30_000 });
    expect((await page.request.get(`${origen}/api/assessments/${id}/result`)).status()).toBe(404);

    // 6. Entrar de nuevo con la misma cuenta recupera el resultado.
    await page.goto("/cuenta/entrar?next=/resultado");
    await entrar(page, account);
    await expect(page).toHaveURL(/\/resultado$/, { timeout: 30_000 });
    await expect(page.getByText("Interpretación provisional")).toBeVisible();
    expect((await page.request.get(`${origen}/api/assessments/${id}/result`)).status()).toBe(200);

    // 7. Eliminar la cuenta pide la contraseña y borra también el resultado.
    await page.goto("/cuenta");
    await page.getByRole("button", { name: "Eliminar mi cuenta y mis datos" }).click();
    const dialogo = page.getByRole("dialog", { name: "¿Eliminar tu cuenta y tus datos?" });
    await expect(dialogo).toBeVisible();
    await dialogo.getByLabel("Tu contraseña").fill(account.password);
    await dialogo.getByRole("button", { name: "Sí, eliminar todo" }).click();
    await expect(dialogo).toBeHidden({ timeout: 30_000 });

    const post = { headers: { ...origenDe(baseURL), "content-type": "application/json" } };
    expect((await page.request.get(`${origen}/api/assessments/${id}/result`)).status()).toBe(404);
    const reentrada = await page.request.post(`${origen}/api/auth/sign-in/email`, {
      ...post,
      data: { email: account.email, password: account.password },
    });
    expect(reentrada.status(), "la cuenta eliminada ya no puede entrar").toBe(401);
  });
});
