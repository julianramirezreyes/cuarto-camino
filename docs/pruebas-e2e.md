# Pruebas end-to-end (Playwright)

Las pruebas E2E recorren la app real en un navegador: portada, cuestionario completo, resultado, biblioteca,
privacidad de la API, accesibilidad y PWA. Se ejecutan contra el **build de producción** (`next build` +
`next start`), porque es lo que se despliega y el único modo en el que se registra el service worker.

## Cómo ejecutarlas

```bash
npm run test:e2e            # todo, proyectos desktop y mobile
npm run test:e2e:desktop    # solo Desktop Chrome
npm run test:e2e:mobile     # solo emulación Pixel 7
npm run test:e2e:headed     # con el navegador visible
npm run test:e2e:ui         # modo UI de Playwright (explorar, repetir, ver trazas)
npm run test:e2e:debug      # inspector paso a paso
npm run test:e2e:report     # abre el último informe HTML (playwright-report/)

npx playwright test e2e/05-evaluacion-completa.spec.ts          # un solo archivo
npx playwright test -g "pausar y retomar" --project=desktop      # por nombre
```

Requisitos: Google Chrome instalado (se usa `channel: "chrome"`, **no** se descargan navegadores) y las variables
de entorno de la app en `.env.local` (base de datos Neon, secreto de autenticación). No hace falta nada más.

`playwright.config.ts` levanta el servidor solo: `npm run build && npm run start -- -p 3400`, con
`BETTER_AUTH_URL` y `APP_URL` apuntando a `http://localhost:3400` (el control CSRF compara `Origin` con ellos).
La primera ejecución compila (unos minutos). Si ya hay un servidor en ese puerto, localmente se **reutiliza**
(`reuseExistingServer`), así que tras cambiar código hay que pararlo para que se recompile. Para otro puerto:
`E2E_PORT=3410 npm run test:e2e`.

Salida: `playwright-report/` (informe HTML) y `test-results/` (capturas de fallos, trazas del primer reintento y los
JSON de axe adjuntos). Ambos están en `.gitignore`.

## Qué cubre

| Archivo | Cubre |
| --- | --- |
| `01-smoke.spec.ts` | Portada, título, flujo portada → introducción → evaluación; biblioteca y página de tipo; `/offline`; manifiesto válido; sin errores de consola. |
| `02-diagrama.spec.ts` | Los nueve puntos del símbolo, con clic y con teclado (Tab, flechas con vuelta, Enter, Espacio); `aria-pressed` y texto en vivo. |
| `03-consentimiento.spec.ts` | Sin casilla no se puede empezar (botón desactivado, Enter no envía, no se crea evaluación). |
| `04-cuestionario.spec.ts` | Responder, retroceder (etiqueta «Pregunta N» correcta: regresión), cambiar respuesta, teclas de dígito, pausa y retomar tras recargar, empezar de nuevo. |
| `05-evaluacion-completa.spec.ts` | Evaluación completa por la UI (≤ 120 respuestas) y recorrido del resultado: cabecera «Interpretación provisional», 12 pestañas con teclado, alas, instintos sp/so/sx, niveles y aviso, conexiones (integración/estrés), explorar otro tipo, reiniciar con diálogo y estado eliminado. |
| `06-privacidad.spec.ts` | Otro visitante o sin cookie: 404 en resultado, respuestas, atrás, pausa y borrado; ids inválidos 404; POST/DELETE con `Origin` ajeno o sin origen: 403; las preguntas no llevan `scores`, `weight`, `rationale`…; cabeceras `no-store`/`nosniff`. |
| `07-responsive.spec.ts` | 360×740, 390×844, 430×932, 768×1024, 1024×768 y 1440×900 en `/`, `/introduccion`, `/evaluacion`, `/biblioteca`, `/biblioteca/tipos/4`: sin desbordamiento horizontal y botones ≥ 44 px de alto. |
| `08-accesibilidad.spec.ts` | axe (WCAG 2.0/2.1/2.2 A y AA) en claro y oscuro sobre páginas públicas y de cuenta; pregunta, diálogo de pausa, resultado (varias pestañas) y diálogo de reinicio. **Falla con `serious` y `critical`**; el resto se adjunta como `axe-*.json`. |
| `09-pwa.spec.ts` | Iconos del manifiesto (200, `image/png`), registro y control del service worker, `/api`, `/evaluacion` y `/resultado` fuera de la caché, y caída a `/offline` sin red. |

Las pruebas **no** afirman un tipo concreto de eneagrama: el cuestionario no está validado. Solo comprueban estructura
y redacción honesta («provisional», «compatibilidad relativa», sin prometer «precisión» del test). La palabra
«precisión» sí aparece en el contenido descriptivo de algunos tipos (p. ej. tipo 1), por eso solo se prohíbe en la
cabecera y en frases que atribuyan precisión al test.

## No cubre

- **Cuentas, reclamación de evaluaciones y correos** (`/cuenta/**`, `POST /api/assessments/claim`, verificación de
  correo): pendiente de una tarea aparte. Las páginas de entrar/registro solo se escanean con axe.
- **Navegadores**: solo Chrome (canal `chrome`). Firefox y Safari/WebKit no se prueban; iOS Safari tampoco. La
  emulación «mobile» es Chrome con perfil de Pixel 7, no un dispositivo real.
- Rendimiento/Lighthouse, instalación real de la PWA, límite de tasa (se evita a propósito, ver abajo) y cookies
  `__Host-` sobre HTTPS real (en `localhost` Chrome las acepta aunque sea HTTP).
- La corrección del cálculo del tipo: eso lo cubren las pruebas unitarias del dominio.

## Higiene de datos

Todas las pruebas usan la **misma base Neon** a través de la app.

- Cada test tiene su propio `BrowserContext`, es decir, su propia cookie de invitado.
- `e2e/fixtures.ts` anota el id de cada evaluación creada (`POST /api/assessments` → 201) y, al terminar el test,
  la borra por la API pública (`DELETE`, borrado lógico) con la cookie de su dueño. Las creadas por API en
  `06-privacidad` se registran con `registerAssessment`.
- Los **invitados** (`guest_sessions`) y los consentimientos quedan en la base: la API no ofrece cómo borrarlos.
  `npm run db:purge` (`scripts/purge-expired.ts`) elimina físicamente lo caducado.
- Cada test usa una cabecera `X-Forwarded-For` aleatoria: el límite de tasa de la API es por IP (10 inicios/min,
  120 mutaciones/min) y así los tests no se estorban entre sí. El límite en sí no se prueba aquí.

## Cómo ampliarlas

- Importa `test` y `expect` de `./fixtures` (no de `@playwright/test`): añade el aislamiento de IP y la limpieza.
- Para un segundo visitante usa la fixture `newVisitor()`; para ids creados por API, `registerAssessment(ctx, id)`.
- `e2e/helpers.ts`: `startAssessment`, `answerCurrent`, `answerUntilDone(page, estrategia)` (estrategias
  deterministas `first`, `last`, `cycle`, `zigzag` o una función) y `completeAssessment`. Responden **por la UI**,
  esperando a que cambie la pregunta (nunca con pausas fijas).
- Selectores por rol y nombre accesible, textos en español. Nada de `waitForTimeout`.
- Añade el archivo con prefijo numérico (`NN-tema.spec.ts`). Una evaluación completa tarda ~1–2 min: dale
  `test.setTimeout`.

## Limitaciones conocidas

- La primera ejecución incluye `next build`; en CI considera construir antes y pasar `reuseExistingServer`.
- Los tests de evaluación completa dependen de la latencia de Neon (≈100 peticiones).
- `reuseExistingServer` puede dar falsos resultados si el servidor reutilizado es de un build antiguo.
- La prueba de `/offline` depende de que Chrome emule «sin red» también para el service worker; si falla en un
  entorno concreto, revisa primero eso antes de culpar a la política de caché.
