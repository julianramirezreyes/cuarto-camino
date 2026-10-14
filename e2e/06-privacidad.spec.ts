import type { BrowserContext } from "@playwright/test";
import { expect, test } from "./fixtures";
import { answerCurrent, startAssessment } from "./helpers";

const PROHIBIDAS = ["scores", "score", "weight", "weights", "rationale", "discrimination", "references"];

/** Recorre un JSON y devuelve las claves prohibidas encontradas. */
function clavesProhibidas(valor: unknown, ruta = "$"): string[] {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => clavesProhibidas(v, `${ruta}[${i}]`));
  if (valor && typeof valor === "object") {
    return Object.entries(valor).flatMap(([k, v]) => [
      ...(PROHIBIDAS.includes(k) ? [`${ruta}.${k}`] : []),
      ...clavesProhibidas(v, `${ruta}.${k}`),
    ]);
  }
  return [];
}

const mismoOrigen = (baseURL: string | undefined) => ({ Origin: new URL(baseURL!).origin });

test.describe("privacidad y autorización de la API", () => {
  test("otro visitante o sin cookie no puede leer, responder ni borrar una evaluación ajena (404)", async ({
    page,
    newVisitor,
    registerAssessment,
    playwright,
    baseURL,
  }) => {
    // Visitante A crea una evaluación por la UI; su id se captura de la red.
    const { id, policyVersion } = await startAssessment(page);
    const actual = await (await page.request.get("/api/assessments/current")).json();
    const q = actual.question as { id: string; options: { id: string }[] };
    const cuerpo = { questionId: q.id, optionId: q.options[0].id };
    const origen = mismoOrigen(baseURL);

    // Control: el dueño sí puede.
    const propio = await page.request.post(`/api/assessments/${id}/answers`, { data: cuerpo, headers: origen });
    expect(propio.status()).toBe(200);

    // Visitante B (contexto nuevo con su propia evaluación y cookie de invitado).
    const b: BrowserContext = await newVisitor();
    const creada = await b.request.post("/api/assessments", {
      data: { consent: true, policyVersion },
      headers: origen,
    });
    expect(creada.status()).toBe(201);
    registerAssessment(b, (await creada.json()).assessment.id);

    for (const [metodo, ruta, data] of [
      ["get", `/api/assessments/${id}/result`, undefined],
      ["post", `/api/assessments/${id}/answers`, cuerpo],
      ["post", `/api/assessments/${id}/back`, undefined],
      ["post", `/api/assessments/${id}/pause`, undefined],
      ["delete", `/api/assessments/${id}`, undefined],
    ] as const) {
      const res = await b.request.fetch(ruta, { method: metodo, data, headers: origen });
      expect(res.status(), `B ${metodo.toUpperCase()} ${ruta}`).toBe(404);
      expect(await res.json()).toEqual({ error: "not_found" });
    }

    // Sin ninguna cookie.
    const anonimo = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { "x-forwarded-for": "10.9.9.9" } });
    try {
      for (const [metodo, ruta, data] of [
        ["get", `/api/assessments/${id}/result`, undefined],
        ["post", `/api/assessments/${id}/answers`, cuerpo],
        ["delete", `/api/assessments/${id}`, undefined],
      ] as const) {
        const res = await anonimo.fetch(ruta, { method: metodo, data, headers: origen });
        expect(res.status(), `anónimo ${metodo.toUpperCase()} ${ruta}`).toBe(404);
      }
      expect((await anonimo.get("/api/assessments/current")).status()).toBe(404);
    } finally {
      await anonimo.dispose();
    }

    // Ids con formato inválido también son 404 (no se distingue de uno ajeno).
    const basura = await page.request.get("/api/assessments/no-es-un-uuid/result");
    expect(basura.status()).toBe(404);

    // Nada de lo anterior afectó a A.
    expect((await page.request.get("/api/assessments/current")).status()).toBe(200);
  });

  test("las peticiones mutantes de otro origen se rechazan con 403 y sin Origin ni Sec-Fetch-Site", async ({
    page,
    baseURL,
    playwright,
  }) => {
    const { id, policyVersion } = await startAssessment(page);
    const actual = await (await page.request.get("/api/assessments/current")).json();
    const q = actual.question as { id: string; options: { id: string }[] };
    const malo = { Origin: "https://evil.example" };

    const intentos = [
      ["post", "/api/assessments", { consent: true, policyVersion }],
      ["post", `/api/assessments/${id}/answers`, { questionId: q.id, optionId: q.options[0].id }],
      ["post", `/api/assessments/${id}/pause`, undefined],
      ["delete", `/api/assessments/${id}`, undefined],
    ] as const;
    for (const [metodo, ruta, data] of intentos) {
      const res = await page.request.fetch(ruta, { method: metodo, data, headers: malo });
      expect(res.status(), `${metodo.toUpperCase()} ${ruta} con Origin ajeno`).toBe(403);
      expect(await res.json()).toEqual({ error: "forbidden_origin" });
    }

    // Sin Origin ni Sec-Fetch-Site (cliente que no es un navegador): también 403.
    const sinOrigen = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { "x-forwarded-for": "10.8.8.8" } });
    try {
      const res = await sinOrigen.post("/api/assessments", { data: { consent: true, policyVersion } });
      expect(res.status()).toBe(403);
    } finally {
      await sinOrigen.dispose();
    }

    // La evaluación sigue intacta tras los ataques (no se borró ni se pausó).
    const despues = await page.request.get("/api/assessments/current");
    expect(despues.status()).toBe(200);
    expect((await despues.json()).question.id).toBe(q.id);
  });

  test("las preguntas que recibe el cliente no contienen puntajes, pesos ni justificaciones", async ({ page }) => {
    const respuestas: unknown[] = [];
    page.on("response", async (r) => {
      const ruta = new URL(r.url()).pathname;
      if (!ruta.startsWith("/api/assessments") || r.request().method() === "DELETE") return;
      try {
        respuestas.push(await r.json());
      } catch {
        /* sin cuerpo */
      }
    });

    await startAssessment(page);
    await answerCurrent(page, 0);
    await answerCurrent(page, 1);
    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(page.getByText(/^Pregunta 2$/)).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Tienes una evaluación en curso" })).toBeVisible();

    expect(respuestas.length).toBeGreaterThanOrEqual(4);
    for (const r of respuestas) expect(clavesProhibidas(r)).toEqual([]);

    // Y las preguntas tienen exactamente la forma pública documentada.
    const actual = await (await page.request.get("/api/assessments/current")).json();
    expect(Object.keys(actual.question).sort()).toEqual(
      expect.arrayContaining(["id", "kind", "module", "options", "text"]),
    );
    for (const o of actual.question.options) expect(Object.keys(o).sort()).toEqual(["id", "text"]);
    expect(JSON.stringify(actual)).not.toMatch(/rationale|weight|"scores?"/);
  });

  test("las respuestas de la API no se cachean y llevan nosniff", async ({ page }) => {
    await startAssessment(page);
    const res = await page.request.get("/api/assessments/current");
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["set-cookie"]).toBeUndefined();
  });
});
