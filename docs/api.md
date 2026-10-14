# API HTTP de evaluación

Rutas bajo `src/app/api/assessments/`, delgadas: toda la lógica vive en `src/features/assessment/`
(servicio puro sobre un puerto de repositorio; sin importar Next ni la base de datos).
Todas las respuestas llevan `Cache-Control: no-store` y `X-Content-Type-Options: nosniff`.
Los errores son siempre JSON `{ "error": "<codigo>" }`.

## Contrato

`QuestionDTO = { id, text, kind, module, options: [{ id, text }], selectedOptionId? }`.
Nunca se envían puntajes, pesos, discriminación, justificación ni referencias.

`progress = { answered, position, module, moduleIndex, moduleMin, moduleMax }`:
`answered` = respuestas del camino actual; `module` = módulo de la pregunta mostrada (el último al terminar);
`position` = posición base 1 de la pregunta mostrada en el camino (no baja ni sube al retroceder más que la pregunta; `answered` se mantiene estable). `moduleIndex` = posición base 0 de la pregunta dentro de su módulo; `moduleMin/Max` = límites del motor.

| Método y ruta | Cuerpo | Éxito | Errores |
|---|---|---|---|
| `POST /api/assessments` | `{ consent: true, policyVersion }` | `201 { assessment: {id,status}, question, progress, resumed }` | 400, 403, 429 |
| `GET /api/assessments/current` | – | `200 { assessment, question, progress }` | 404 |
| `POST /api/assessments/[id]/answers` | `{ questionId, optionId }` | `200 { question \| null, progress, done }` | 400, 403, 404, 409, 429 |
| `POST /api/assessments/[id]/back` | opcional `{ questionId }` | `200 { question (con selectedOptionId), progress }` | 403, 404, 409, 429 |
| `POST /api/assessments/[id]/pause` | – | `200 { status: "paused" }` | 403, 404, 409, 429 |
| `GET /api/assessments/[id]/result` | – | `200 { report, engineVersion, bankVersion, completedAt }` | 404, 409 |
| `DELETE /api/assessments/[id]` | – | `204` | 403, 404, 429 |
| `POST /api/assessments/claim` | – | `200 { claimed: number }` | 401, 403, 429 |

Códigos de error: `invalid_request` (400, Zod estricto, JSON mal formado o cuerpo > 2 KB), `invalid_answer` (400, pregunta u
opción inexistente), `consent_required` (400), `unauthorized` (401), `forbidden_origin` (403), `not_found` (404),
`not_complete` (409, resultado aún no disponible), `already_completed` (409), `question_not_available` (409),
`no_previous` (409), `version_mismatch` (409), `rate_limited` (429, con `Retry-After`), `internal_error` (500).

### Comportamiento

- **Inicio.** Sin sesión de usuario se crea una sesión de invitado y la cookie `cc_guest` (`httpOnly`, `SameSite=Lax`,
  `Path=/`, 30 días; en producción `Secure` y prefijo `__Host-`, es decir `__Host-cc_guest`, según `src/lib/guest/cookie.ts`).
  La base solo guarda el hash SHA-256 del token. Si el titular ya tiene una evaluación `in_progress` o `paused`, se reanuda
  (`resumed: true`; sigue respondiendo 201).
- **Respuestas.** Solo se puede responder la pregunta ofrecida o una ya respondida del camino actual. Responder de nuevo la
  misma pregunta reemplaza la respuesta. Al agotarse el motor (`sessionDecision.stop`) la evaluación se completa sola, se
  guarda el `AssessmentReport` en `assessment_results` con `engineVersion` y `bankVersion`, y se responde `done: true`.
- **Atrás.** El servidor no guarda cursor. Sin cuerpo devuelve la pregunta anterior a la actual. Para retroceder varias veces
  el cliente envía `{ "questionId": "<pregunta que está mostrando>" }` y recibe la anterior a esa
  (extensión opcional del contrato; sin ella solo se puede retroceder un paso desde la pregunta actual).
- **Resultado inmutable.** Una evaluación completada no admite cambios (`409 already_completed`) y `result` devuelve el
  snapshot guardado; nunca se recalcula con otro motor o banco. Un motor nuevo añadiría una fila, no sobrescribe.
- **Reclamación.** `claim` exige usuario autenticado y la cookie de invitado; el invitado no se nombra por id, la cookie es la
  prueba. Es idempotente: sin cookie, token desconocido, expirado o ya reclamado responde `{ claimed: 0 }`. Si reclama,
  borra la cookie. Mueve evaluaciones (no borradas) y consentimientos al usuario y marca `claimed_by_user_id`.
- **Autenticación.** La sesión de Better Auth se consulta solo si la petición trae cookie `session_token`; un usuario
  autenticado tiene prioridad sobre la cookie de invitado.

## Diseño del retroceso (camino derivado)

El motor elige la siguiente pregunta como función pura del **conjunto** de respuestas. Por eso no se guarda orden ni cursor:
`walkAnswers` (`trail.ts`) parte de cero, pide una pregunta al motor, consume la respuesta guardada si existe y repite hasta
hallar una pregunta sin respuesta (la actual) o hasta que el motor termine. Consecuencias:

- Retroceder no borra nada; cambiar una respuesta anterior re-deriva el camino posterior.
- Las respuestas que quedan fuera del camino ("huérfanas") se conservan, no puntúan ni son respondibles, y se reutilizan solas
  si el camino vuelve a pasar por ellas (p. ej. al restaurar la opción original).
- El informe final se calcula solo con las respuestas del camino.

## Seguridad

- **Propiedad.** Cada llamada pasa por `canAccessAssessment`. Ids ajenos, borrados, inexistentes o con formato no UUID dan
  `404 not_found` (nunca 403) para impedir enumeración. Sin sesión ni cookie válida también es 404 (salvo `claim`: 401).
- **CSRF.** Toda petición mutante (POST/DELETE) exige `Origin` igual al origen de la petición (o uno de `BETTER_AUTH_URL` /
  `APP_URL`); sin `Origin` se acepta solo con `Sec-Fetch-Site: same-origin`. Si no, `403 forbidden_origin`. Además la cookie
  es `SameSite=Lax`.
- **Validación.** Esquemas Zod estrictos (`schemas.ts`), ids con patrón restringido, cuerpo máximo 2 KB.
- **Límite de tasa.** Compartido entre instancias, guardado en Postgres (`rate_limits`, un `INSERT ... ON CONFLICT` atómico;
  ver `rate-limit-shared.ts`): inicio 10/min, resto de mutaciones 120/min por IP (primer salto de `X-Forwarded-For`). La clave
  guarda un hash de la IP, nunca la IP en claro. Si la base falla, cae a un limitador en memoria por instancia y registra solo
  un código genérico. Sin cabecera de IP todos comparten el cubo `unknown`. Detalle en `docs/retencion-y-limites.md`.
- **Logs.** Los errores inesperados registran solo el nombre del error (los mensajes de drivers/ORM pueden incluir parámetros,
  es decir, respuestas) y responden `500 internal_error` sin detalle. Nunca se registran cuerpos.
- **Sin fuga de contenido sensible.** `QuestionDTO` copia solo campos públicos; el informe se entrega solo a su dueño.

## Persistencia y transacciones

- `neon-http` no admite transacciones: la escritura de varias sentencias (crear evaluación + consentimiento, completar
  = resultado + estado, reclamar) corre en una transacción real sobre el pool WebSocket (`src/lib/db/transactional.ts`,
  una conexión por transacción, cerrada al terminar). Lo demás son sentencias únicas (`upsert` de respuesta con
  `ON CONFLICT`, pausa, borrado lógico).
- **Reclamación** (`drizzle-repository.ts`): `UPDATE guest_sessions SET claimed_by_user_id … WHERE id = $g AND claimed_by_user_id IS NULL
  RETURNING id`; si no devuelve filas se pierde la carrera y no se toca nada más; si gana, en la misma transacción
  `UPDATE assessments SET user_id = $u, guest_session_id = NULL …` y lo mismo en `consent_records`.
  El `CHECK` de dueño único se cumple siempre.
- `BANK_VERSION` (`versions.ts`) debe incrementarse al cambiar el banco. Una evaluación con otro `bank_version`/`engine_version`
  no se puede continuar (`409 version_mismatch`) pero su resultado sigue disponible.
- Borrado: lógico (`deleted_at`); `scripts/purge-expired.ts` lo elimina físicamente.

## Qué está verificado y qué no

Verificado sin base de datos: servicio completo con el banco real y un respondiente sintético, reanudar/pausar, retroceso y
cambio de respuesta, acceso ajeno = 404, borrado, reclamación (solo titular de la cookie, una vez, carrera concurrente),
manejadores HTTP con `Request` reales, límite de tasa, CSRF, y el SQL que genera el repositorio Drizzle (driver proxy que
registra las sentencias: forma, orden y alcance transaccional). `next build` compila las rutas sin variables de entorno.

**No verificado (requiere Neon real):** ejecución de las sentencias contra Postgres (CHECK/UNIQUE/FK, `ON CONFLICT`),
el pool WebSocket y los commit/rollback reales, la lectura de sesión de Better Auth, y el comportamiento de la cookie
`__Host-` en un despliegue HTTPS.
