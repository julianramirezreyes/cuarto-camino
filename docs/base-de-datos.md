# Base de datos y persistencia

Stack: Neon Postgres, Drizzle ORM (`drizzle-orm` 0.45, `drizzle-kit` 0.31), Better Auth 1.7.
Esquema en `src/lib/db/schema/`, migración versionada en `drizzle/`.

## Mapa de tablas

| Grupo | Tablas | Notas |
|---|---|---|
| Auth (Better Auth) | `user`, `session`, `account`, `verification` | Forma exigida por el adaptador Drizzle. IDs `uuid` (`advanced.database.generateId = "uuid"`). |
| Aplicación | `profiles` | 1:1 con `user`. Solo `display_name` y `locale`. |
| Invitados | `guest_sessions` | Guarda solo el hash SHA-256 del token. |
| Evaluación | `assessments`, `assessment_answers`, `assessment_results`, `consent_records` | Ver invariantes abajo. |
| Referencia | `enneagram_types`, `enneagram_wings`, `enneagram_connections`, `enneagram_triad_memberships`, `instinctual_subtypes`, `development_levels`, `content_sources` | Solo estructura y claves; sembradas por `scripts/seed.ts`. |

Todas las PK son `uuid` con `defaultRandom()` (`gen_random_uuid()`), todas las fechas `timestamptz`,
y las tablas mutables llevan `created_at`/`updated_at` (este último se refresca en cada update vía Drizzle).

## Invariantes garantizadas en la base de datos

- `assessments`: **exactamente un dueño** (`num_nonnulls(user_id, guest_session_id) = 1`); consentimiento obligatorio
  (`consent_granted = true`); `completed_at` no nulo si y solo si `status = 'completed'`; `version >= 1`.
- `assessment_answers`: `UNIQUE (assessment_id, question_id)` (una respuesta por pregunta; reenviar = upsert).
- `assessment_results`: `UNIQUE (assessment_id, engine_version)`; re-puntuar con un motor nuevo añade fila, no sobrescribe.
- `consent_records`: exactamente un sujeto (usuario o invitado).
- `guest_sessions`: `token_hash` único y con forma de SHA-256 hex (`^[0-9a-f]{64}$`).
- Referencia: rangos 1..9, sin auto-referencias, una flecha de cada tipo por tipo origen, una pertenencia por tríada.
- Borrado en cascada: usuario -> sesiones/cuentas/perfil/evaluaciones/consentimientos; invitado -> evaluaciones/consentimientos;
  evaluación -> respuestas/resultados. `guest_sessions.claimed_by_user_id` usa `SET NULL` para no borrar la sesión.

## Decisiones y omisiones justificadas

**No hay tabla `questions`.** El banco de preguntas vive en archivos TypeScript versionados (`src/content`).
Razones: (1) se revisa por pull request junto con su justificación y referencias, (2) no requiere migraciones
para corregir un texto, (3) el motor adaptativo lo consume como datos tipados, y (4) una tabla mutable permitiría
cambiar el significado de respuestas ya guardadas. Por eso `assessment_answers` guarda `question_id` y `option_id`
(texto, ids estables) y `assessments.bank_version` fija contra qué versión del banco se interpretan. Consecuencia
aceptada: no hay FK hacia preguntas; la aplicación valida los ids contra el banco (los esquemas Zod restringen su formato).

**Texto editorial fuera de la base de datos.** Las tablas de referencia guardan estructura y claves (`4-sx`, `4-L7`),
no descripciones. El texto vive en `src/content` con estado `draft`/`reviewed`.

**Tablas de referencia normalizadas, sin columnas duplicadas.** Centro, grupo hornevian y armónico no son columnas de
`enneagram_types`: son filas de `enneagram_triad_memberships` (`kind` + `group_key`), lo que evita tres columnas
redundantes y permite añadir otra clasificación sin migrar el esquema de tipos. Las alas se guardan en ambas
direcciones (18 filas) para consultar sin `OR`.

**Sin columnas de datos sensibles que no se usan.** `profiles` no almacena fecha de nacimiento, género ni ubicación.
`assessments` no guarda IP ni user-agent. Los resultados son un `jsonb` autocontenido (`report`).

**Sin índice único "una evaluación activa por dueño".** Es una decisión de producto aún no tomada; añadirlo luego es una
migración aditiva (índice parcial sobre `status in ('in_progress','paused')`).

**`assessment_results.bank_version` duplica el de `assessments`.** Intencional: un resultado es un snapshot
(motor + banco) y debe ser interpretable aunque la evaluación se re-puntúe.

**Contraseñas.** La aplicación nunca recibe ni guarda contraseñas por su cuenta: Better Auth las procesa y guarda un hash
con sal en `account.password`. Ese campo no se lee ni escribe desde código propio.

## Invitados y reclamación

- Token: 32 bytes aleatorios (CSPRNG), base64url. Solo viaja en una cookie `httpOnly`, `sameSite=lax`, `path=/`,
  `secure` en producción (prefijo `__Host-` en producción), `maxAge` 30 días.
- En base de datos solo existe `SHA-256(token)`. Comparación en tiempo constante (`timingSafeEqual`).
- Política: expira tras **30 días sin actividad** (ventana deslizante; se renueva como máximo una vez por hora).
- Control de acceso (`src/lib/guest/ownership.ts`, `canAccessAssessment`): denegar por defecto. Un invitado solo lee lo
  suyo; un usuario solo lo suyo; un usuario no ve datos de invitado sin reclamarlos; las evaluaciones con borrado lógico
  son inaccesibles.
- Reclamación (`authorizeGuestClaim`): solo quien presenta el token cuyo hash coincide con la sesión actual, una sola vez
  y antes de expirar. La capa de datos debe ejecutarla en **una transacción** con
  `UPDATE guest_sessions SET claimed_by_user_id = $u, claimed_at = now() WHERE id = $g AND claimed_by_user_id IS NULL`
  (si afecta 0 filas, perdió una carrera), y luego mover `assessments` y `consent_records` poniendo `user_id` y anulando
  `guest_session_id` en el mismo `UPDATE` (así el CHECK de dueño único se cumple siempre).
  La función de decisión es pura y está probada; **la transacción de reclamación aún no está implementada ni probada contra Postgres**.

## Retención y derecho de borrado

- `assessments.deleted_at`: borrado lógico inmediato (la API deja de devolverlo); `scripts/purge-expired.ts` lo elimina
  físicamente tras 7 días de gracia (ver `src/lib/db/retention.ts`).
- `assessments.expires_at`: límite duro de retención; también se purga.
- Sesiones de invitado expiradas y sus evaluaciones/consentimientos se eliminan en una sola transacción.
- Programar el script a diario (cron de Vercel hacia una ruta protegida, o GitHub Action).

## Drivers

- **Runtime de la app: `neon-http`** (`src/lib/db/client.ts`). Una petición HTTPS por consulta, ideal para serverless.
  No admite transacciones interactivas (`db.transaction()` lanza error). Better Auth funciona porque su adaptador
  Drizzle usa `transaction: false` por defecto.
- **Scripts: `neon-serverless` Pool** (`src/lib/db/transactional.ts`), basado en WebSocket, con transacciones reales
  (seed y purga). En Node >= 22 se usa el `WebSocket` global.
- El cliente es perezoso: importar el módulo no lee `DATABASE_URL` ni abre conexiones, así `next build` no necesita
  credenciales. `DATABASE_URL` nunca tiene prefijo `NEXT_PUBLIC_`.

## Por qué Better Auth y no `@neondatabase/auth`

- `@neondatabase/auth` seguía en `0.6.0-beta` al escribir esto: API inestable y poco historial en producción.
- Neon Auth está construido sobre Better Auth, así que usar Better Auth directamente da el mismo modelo
  (user/session/account/verification) sin depender de una capa beta ni acoplar la autenticación al proveedor de base de datos.
- Las tablas de auth viven en **nuestro** esquema Drizzle: migraciones, FKs a `profiles`/`assessments` y borrado en cascada
  son nuestros. Migrar a Neon Auth más adelante es viable porque el modelo de datos es el mismo.
- Coste: nos encargamos de la configuración de email/recuperación de contraseña cuando se active.
  Hoy `requireEmailVerification` está en `false` porque aún no hay proveedor de correo.

Configuración: `src/lib/auth/auth.ts` expone `createAuth({ db, secret, baseURL })` (fábrica, testeable sin base de datos)
y `getAuth()` (singleton perezoso que lee `DATABASE_URL`, `AUTH_SECRET` >= 32 caracteres y `BETTER_AUTH_URL`).

## Migraciones y seed

```bash
npm run db:generate                 # genera SQL en drizzle/ (offline, sin BD)
npm run db:migrate                  # aplica a Neon (requiere DATABASE_URL)
npm run db:seed                     # siembra tablas de referencia (idempotente, transaccional)
npx tsx scripts/purge-expired.ts    # retención
```

`seed` y `purge` terminan con un mensaje claro y código 1 si falta `DATABASE_URL`. El seed deriva todo de
`src/domain/enneagram/structure.ts` (9 tipos, 18 alas, 18 conexiones, 27 pertenencias a tríadas, 27 subtipos, 81 niveles)
y de `src/content/sources.ts`, con `ON CONFLICT DO NOTHING` sobre claves naturales.

## Qué se verificó y qué no

Verificado sin base de datos: pruebas unitarias (tokens, hash, cookie, expiración, propiedad y reclamación, esquemas Zod,
cardinalidades y unicidad del seed, forma del SQL de la purga, construcción de Better Auth contra el esquema) y revisión
del SQL generado por `drizzle-kit`.

**No verificado (requiere Neon real):** aplicar la migración, ejecutar el seed y la purga, que los CHECK/FK se comporten
como se espera, el flujo de registro/inicio de sesión de Better Auth, y la transacción de reclamación.
