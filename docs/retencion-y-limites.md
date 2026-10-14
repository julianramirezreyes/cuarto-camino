# Retención de datos y límites de tasa

> **PROPUESTA pendiente de revisión legal** (Ley 1581 de 2012). Los plazos de retención son valores por defecto razonables, no una decisión jurídica.

## Límite de tasa compartido (Postgres/Neon)

- Implementación: `src/features/assessment/rate-limit-shared.ts`. Ventana fija con **un solo `INSERT ... ON CONFLICT (key) DO UPDATE ... RETURNING`**
  sobre la tabla `rate_limits` (atómico, sin transacción, funciona sobre `neon-http`).
- Límites (constantes `RATE_LIMITS`): `start` 10/min, resto de mutaciones 120/min, por IP. Al superarlos: `429 rate_limited` + `Retry-After`.
- Clave: `<cubo>:<sha256(sal + IP)>`. **La IP en claro nunca se guarda.** Sal: `RATE_LIMIT_SALT` o, si falta, derivada de `AUTH_SECRET`
  (hash unidireccional). IP del cliente: primer salto de `X-Forwarded-For`, luego `X-Real-IP`, si no un cubo constante `unknown`.
- **Si la base de datos falla, el límite falla abierto**: se usa el limitador en memoria de esa instancia (`rate-limit.ts`) y solo se registra
  el código genérico `rate_limit_store_unavailable` (nunca IPs ni respuestas).
- `Retry-After` se calcula con el reloj de la aplicación frente a `window_start` de la base de datos; una deriva de reloj de pocos segundos es tolerable.
- Better Auth tiene su propio almacén (`auth_rate_limit`, modelo `rateLimit`); ver "Configuración pendiente en Better Auth".

### Configuración pendiente en Better Auth (la aplica quien posee `src/lib/auth/**`)

```ts
import { account, rateLimit, session, user, verification } from "@/lib/db/schema";

betterAuth({
  // ...
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, rateLimit }, // clave EXACTA: rateLimit
  }),
  rateLimit: { enabled: true, storage: "database" }, // modelName por defecto = "rateLimit"
});
```

Columnas: `id` uuid, `key` text único, `count` integer, `last_request` bigint (epoch ms). `enabled` es `true` por defecto solo en producción.

## Política de retención (propuesta)

| Dato | Retención | Mecanismo |
|---|---|---|
| Sesión de invitado | 30 días **sin actividad** (ventana deslizante, `GUEST_IDLE_TTL_DAYS`) | purga de `guest_sessions.expires_at` |
| Evaluaciones de un invitado | Mueren con su sesión | `ON DELETE CASCADE` (+ borrado explícito previo en la purga) |
| Evaluación con borrado lógico (`deleted_at`) | 7 días de gracia y luego borrado físico | purga |
| Evaluaciones de usuarios con cuenta (`in_progress`, `paused`, `completed`, `abandoned`) | **Se conservan** hasta que el usuario las borre | no se tocan |
| Filas de `rate_limits` / `auth_rate_limit` | 24 h desde su última ventana | purga |

### Por qué no se usa `assessments.expires_at`

Ningún código lo escribía nunca (siempre `NULL`). Para evaluaciones de invitado la caducidad ya la determina la sesión de invitado (si se copiara,
habría que mantenerla sincronizada en cada "touch" de la sesión: más escrituras y un segundo origen de verdad). Para usuarios con cuenta la política es
"hasta que borre". Decisión más simple y correcta: **la purga ignora `expires_at`**; la columna queda sin uso (se evita una migración destructiva) y
puede retirarse más adelante.

## Purga

- Lógica pura/inyectable: `retentionCutoffs(now)` y `purgeExpired(db, now)` en `src/lib/db/retention.ts` (una transacción).
- `GET /api/cron/purge` (Vercel Cron, diario a las 03:17 UTC, `vercel.json`): exige `Authorization: Bearer ${CRON_SECRET}` (Vercel lo envía
  automáticamente si existe la variable `CRON_SECRET`), comparación en tiempo constante, `401` si no coincide, `500 cron_not_configured` si falta
  el secreto (nunca se ejecuta sin autenticar), `Cache-Control: no-store`, responde solo conteos `{assessments, guestSessions, rateLimits}`.
- `npm run db:purge` (`scripts/purge-expired.ts`) usa la misma función.
- El plan Hobby de Vercel solo permite crons diarios y la hora exacta puede variar dentro de la hora programada.

## Despliegue

1. Definir `CRON_SECRET` (cadena aleatoria larga) en Vercel; opcional `RATE_LIMIT_SALT`.
2. Aplicar la migración `0001_tricky_swarm` (`npm run db:migrate`).
