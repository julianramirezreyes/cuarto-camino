import { test as base, expect, type BrowserContext } from "@playwright/test";

/** IP falsa y única por test: el límite de tasa de la API se cuenta por `X-Forwarded-For`. */
function fakeIp() {
  const n = () => 1 + Math.floor(Math.random() * 254);
  return `10.${n()}.${n()}.${n()}`;
}

export const visitorHeaders = () => ({ "x-forwarded-for": fakeIp() });

interface Fixtures {
  /** Crea un visitante nuevo (contexto aislado, cookie de invitado propia) y limpia sus evaluaciones al terminar. */
  newVisitor: () => Promise<BrowserContext>;
  /** Registra una evaluación creada por API para que se elimine al terminar el test. */
  registerAssessment: (context: BrowserContext, id: string) => void;
}

/**
 * Cada test usa su propio BrowserContext (cookie de invitado nueva). Al terminar, cada evaluación
 * creada se borra (borrado lógico) por la API pública, con la cookie de su dueño.
 */
export const test = base.extend<Fixtures & { _cleanup: void }>({
  extraHTTPHeaders: async ({}, provide) => {
    await provide(visitorHeaders());
  },

  newVisitor: async ({ browser, baseURL }, provide) => {
    const created: BrowserContext[] = [];
    await provide(async () => {
      const context = await browser.newContext({ extraHTTPHeaders: visitorHeaders() });
      watchAssessments(context);
      created.push(context);
      return context;
    });
    for (const context of created) {
      await deleteTracked(context, baseURL!);
      await context.close();
    }
  },

  registerAssessment: async ({}, provide) => {
    await provide((context, id) => idsOf(context).add(id));
  },

  _cleanup: [
    async ({ context, baseURL }, provide) => {
      watchAssessments(context);
      await provide();
      await deleteTracked(context, baseURL!);
    },
    { auto: true },
  ],
});

export { expect };

const tracked = new WeakMap<BrowserContext, Set<string>>();
const idsOf = (context: BrowserContext) => {
  let set = tracked.get(context);
  if (!set) tracked.set(context, (set = new Set()));
  return set;
};

/** Anota el id de toda evaluación que la app cree en este contexto (POST /api/assessments → 201). */
function watchAssessments(context: BrowserContext) {
  context.on("response", async (response) => {
    const request = response.request();
    if (request.method() !== "POST" || response.status() !== 201) return;
    if (new URL(response.url()).pathname !== "/api/assessments") return;
    try {
      const body = (await response.json()) as { assessment?: { id?: string } };
      if (body.assessment?.id) idsOf(context).add(body.assessment.id);
    } catch {
      /* cuerpo no legible: nada que limpiar */
    }
  });
}

async function deleteTracked(context: BrowserContext, baseURL: string) {
  const origin = new URL(baseURL).origin;
  for (const id of [...idsOf(context)]) {
    try {
      // 204 si se borró; 404 si el propio test ya la había borrado.
      await context.request.delete(`${origin}/api/assessments/${id}`, { headers: { Origin: origin } });
    } catch {
      /* limpieza de mejor esfuerzo */
    }
  }
  idsOf(context).clear();
}
