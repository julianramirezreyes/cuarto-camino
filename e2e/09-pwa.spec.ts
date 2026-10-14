import { expect, test } from "./fixtures";
import { startAssessment } from "./helpers";

test.describe("PWA", () => {
  test("los iconos del manifiesto responden 200 con image/png", async ({ request }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icono of manifest.icons as { src: string; type: string; sizes: string }[]) {
      const res = await request.get(icono.src);
      expect(res.status(), icono.src).toBe(200);
      expect(res.headers()["content-type"], icono.src).toContain("image/png");
      expect((await res.body()).byteLength, icono.src).toBeGreaterThan(100);
    }
    expect((await request.get("/apple-touch-icon.png")).status()).toBe(200);
  });

  test("el service worker se registra en producción y controla la página", async ({ page }) => {
    await page.goto("/");
    const info = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      const sw = reg.active!;
      // `ready` resuelve con el worker activo aunque aún esté «activating»: esperar a «activated».
      if (sw.state !== "activated") {
        await new Promise<void>((resolve) =>
          sw.addEventListener("statechange", () => sw.state === "activated" && resolve()),
        );
      }
      return { scope: reg.scope, script: sw.scriptURL, state: sw.state };
    });
    expect(info.script).toMatch(/\/sw\.js$/);
    expect(info.scope).toMatch(/\/$/);
    expect(info.state).toBe("activated");
    // clients.claim(): la página pasa a estar controlada sin recargar.
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);

    const sw = await page.request.get("/sw.js");
    expect(sw.headers()["content-type"]).toContain("javascript");
    expect(sw.headers()["service-worker-allowed"]).toBe("/");
  });

  test("/api, /evaluacion y /resultado nunca entran en la caché del service worker", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);

    // Visitar rutas públicas y privadas, y llamar a la API, con el SW activo.
    await page.goto("/biblioteca");
    await startAssessment(page); // /evaluacion + POST/GET /api/assessments
    await page.evaluate(() => fetch("/api/assessments/current").then((r) => r.status));
    await page.goto("/resultado");
    await page.goto("/biblioteca/tipos/4");

    const cache = await page.evaluate(async () => {
      const nombres = await caches.keys();
      const entradas: Record<string, string[]> = {};
      for (const n of nombres) entradas[n] = (await (await caches.open(n)).keys()).map((r) => new URL(r.url).pathname);
      return entradas;
    });

    const todas = Object.values(cache).flat();
    expect(Object.keys(cache).every((n) => n.startsWith("cuarto-camino-static-"))).toBe(true);
    expect(todas.some((p) => p.startsWith("/api/")), "no debe haber /api en caché").toBe(false);
    expect(todas.some((p) => p.startsWith("/resultado")), "no debe haber /resultado en caché").toBe(false);
    expect(todas.some((p) => p.startsWith("/evaluacion")), "no debe haber /evaluacion en caché").toBe(false);
    // Las navegaciones públicas tampoco se guardan: solo /offline y estáticos versionados.
    expect(todas.filter((p) => !p.startsWith("/_next/static/") && !p.startsWith("/icons/") && p !== "/apple-touch-icon.png")).toEqual(["/offline"]);
  });

  test("sin red, una navegación pública cae en /offline", async ({ page, context }) => {
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    // /offline se precachea en `install`; confirmarlo antes de cortar la red.
    await expect
      .poll(() => page.evaluate(async () => !!(await caches.match("/offline"))))
      .toBe(true);

    await context.setOffline(true);
    try {
      await page.goto("/biblioteca", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: "Sin conexión" })).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
