import { test as base, expect, type BrowserContext } from "@playwright/test";

/** IP falsa y única por test: el límite de tasa de la API se cuenta por `X-Forwarded-For`. */
function fakeIp() {
  const n = () => 1 + Math.floor(Math.random() * 254);
  return `10.${n()}.${n()}.${n()}`;
}

export const visitorHeaders = () => ({ "x-forwarded-for": fakeIp() });

/** Credenciales de una cuenta de prueba (correo `.invalid`, nunca entregable). */
export interface TestAccount {
  name: string;
  email: string;
  password: string;
}

interface Fixtures {
  /**
   * Credenciales únicas para una cuenta de prueba. Al terminar el test, aunque haya fallado a mitad,
   * se intenta entrar con ellas y borrar la cuenta por la API (los datos cuelgan en cascada).
   */
  account: TestAccount;
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

  account: async ({ context, baseURL }, provide) => {
    const id = Math.random().toString(36).slice(2, 10);
    const account: TestAccount = {
      name: "Cuenta E2E",
      email: `e2e+${id}@example.invalid`,
      password: `Frase-larga-${id}-de-prueba`,
    };
    await provide(account);
    const origin = new URL(baseURL!).origin;
    const headers = { Origin: origin, "content-type": "application/json" };
    try {
      const login = await context.request.post(`${origin}/api/auth/sign-in/email`, {
        headers,
        data: { email: account.email, password: account.password },
      });
      // 401 si el test ya borró la cuenta: no hay nada que limpiar.
      if (login.ok()) {
        await context.request.post(`${origin}/api/auth/delete-user`, { headers, data: { password: account.password } });
      }
    } catch {
      /* limpieza de mejor esfuerzo */
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
