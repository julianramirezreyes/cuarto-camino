# Cuentas (Better Auth)

Registro y acceso con correo y contraseña. Todo es opcional: la evaluación funciona como invitado.

## Piezas

- Servidor: `src/lib/auth/auth.ts` (fábrica `createAuth`, singleton perezoso `getAuth`), ruta `src/app/api/auth/[...all]/route.ts`
  (`toNextJsHandler`, perezoso: `next build` no necesita variables de entorno).
- Cliente: `src/lib/auth/auth-client.ts` (`createAuthClient`, mismo origen).
- Páginas: `/cuenta/registro`, `/cuenta/entrar`, `/cuenta` (perfil: cerrar sesión y eliminar cuenta).
- Cabecera: `HeaderAccount` es una isla de cliente (`useSession`); las páginas estáticas (`/`, `/biblioteca`…) siguen estáticas.
- `/resultado` muestra «Crear cuenta para conservar tu resultado» (`/cuenta/registro?next=/resultado`) solo sin sesión.

## Configuración del servidor

- `user.deleteUser.enabled = true`. El cliente envía la contraseña (`authClient.deleteUser({ password })`).
- `trustedOrigins` = orígenes de `BETTER_AUTH_URL` y `APP_URL`. Peticiones con otro `Origin` dan 403.
- Límite de tasa de Better Auth **activado siempre** (por defecto solo lo está en producción): 100 peticiones/10 s en general, y
  más estricto en `/sign-in/email` (10/min), `/sign-up/email` (5/min) y `/delete-user` (5/min). El almacén es memoria **por
  instancia**: en serverless es un freno parcial, no un límite global (usar `secondaryStorage` o `storage: "database"` más adelante).
- Cookies `Secure` en producción (`advanced.useSecureCookies`).

## Reclamar el resultado de invitado

Tras registrarse o entrar con éxito, `PostAuth` llama una sola vez a `POST /api/assessments/claim` (protegido contra doble
ejecución, incluido StrictMode). Si mueve algo: «Guardamos tu resultado en tu cuenta». Si falla, la cuenta funciona igual: aviso no
bloqueante con «Reintentar» y «Continuar». Destino: `?next=` validado (`safeNextPath`: solo rutas relativas del mismo origen, sin
`//`, `\`, esquemas, caracteres de control ni equivalentes codificados); si no hay, `/evaluacion` o `/resultado` según lo reclamado
(un resultado completado no se puede detectar sin una API nueva, por eso el usuario que vuelve a entrar va a `/resultado`, que
tiene su propio estado vacío con enlace a la evaluación).

## Eliminar la cuenta y los datos

`/cuenta` → «Eliminar mi cuenta y mis datos» (diálogo, pide contraseña) → `deleteUser`. El borrado de `user` elimina por
`ON DELETE CASCADE`: `session`, `account`, `profiles`, `assessments` (y con ellas `assessment_answers` y `assessment_results`) y
`consent_records`. `guest_sessions.claimed_by_user_id` es `ON DELETE SET NULL`: la fila de invitado (solo el hash del token) queda
huérfana y la elimina la purga por caducidad. Verificado con Neon real (ver abajo). «Descargar mis datos» queda fuera de alcance.

## Limitaciones conocidas (leer antes de lanzar)

- **Correo sin verificar.** No hay proveedor de correo, así que `requireEmailVerification` está en `false`. Cualquiera puede
  registrar un correo ajeno o con una errata; quien se equivoque al escribir el suyo deja una cuenta a la que otra persona
  podría acceder (toma de cuenta por correo con errata). Habilitar la verificación cuando exista proveedor.
- **Sin recuperación de contraseña**: necesita correo. Por eso no hay botón «Olvidé mi contraseña». Perder la contraseña es perder
  la cuenta (se avisa en el formulario de registro).
- El registro devuelve un mensaje genérico si el correo ya existe; el acceso devuelve el mismo error para correo inexistente y
  contraseña incorrecta (verificado: mismo estado y mensaje).
- Límite de tasa por instancia (ver arriba). Sin captcha.
- No hay página de privacidad propia: el aviso (Ley 1581) está en un desplegable del formulario.

## Verificación con base real (Neon), 2026-10-13

Flujo HTTP completo contra `next dev` (correo `e2e+…@example.invalid`): invitado completa la evaluación, registro, claim con ambas
cookies (`claimed: 1`, segundo claim `0`), resultado visible solo con la sesión, otro invitado recibe 404 (lectura y borrado),
cerrar sesión (404 después), entrar de nuevo (resultado intacto), `delete-user` con Origin ajeno 403, con contraseña errónea 400 y
correcta 200; después resultado 404, sesión inválida y no se puede volver a entrar. Consulta de solo lectura posterior: 0 usuarios
`e2e+`, 0 filas de la evaluación (`assessments`, `assessment_results`, `assessment_answers`), 0 `guest_sessions` con
`claimed_by_user_id`. Quedan solo las filas del segundo invitado de la prueba (evaluación con borrado lógico, consentimiento,
`guest_sessions`) y la fila huérfana del primero, que corresponden a la purga por caducidad.
