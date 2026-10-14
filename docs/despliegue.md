# Despliegue en Vercel

Guía para publicar la app en Vercel con la base de datos en Neon. Ya están hechos: el proyecto de Vercel conectado al repositorio de
GitHub, la base de Neon con las migraciones `0000` y `0001` aplicadas y la semilla cargada.

## 1. Variables de entorno

Se configuran en **Vercel → Project → Settings → Environment Variables**. Nunca van en el repositorio.

| Variable | Obligatoria | Valor |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Cadena de conexión **pooled** de Neon, con `?sslmode=require`. |
| `AUTH_SECRET` | Sí | Cadena aleatoria de al menos 32 caracteres: `openssl rand -base64 32`. Usa un valor **distinto** al de tu `.env.local`. |
| `BETTER_AUTH_URL` | Sí | Origen público exacto de producción, con `https://` y **sin barra final** (por ejemplo `https://tu-proyecto.vercel.app`). Confírmalo en Vercel → Domains. Se usa para los orígenes permitidos (CSRF) y los enlaces de correo. |
| `APP_URL` | Sí | El mismo origen que `BETTER_AUTH_URL`. |
| `CRON_SECRET` | Sí | Cadena aleatoria: `openssl rand -hex 32`. Vercel la envía como `Authorization: Bearer …` al ejecutar el cron. Sin ella la purga responde 500 y **no corre**. |
| `RATE_LIMIT_SALT` | No | Sal para el hash de IPs del límite de intentos. Si falta se deriva de `AUTH_SECRET`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | No | Activan la verificación de correo y la recuperación de contraseña. **Sin ellas** la app funciona igual, pero sin verificación ni recuperación. Ver `docs/correo.md`. |

Marca `DATABASE_URL`, `AUTH_SECRET`, `CRON_SECRET` y `SMTP_PASS` como **Sensitive**. No definas `EMAIL_TRANSPORT=outbox` en
Vercel: el buzón de desarrollo se niega a arrancar en producción.

### Entorno Preview

Las URL de las vistas previas cambian en cada despliegue, así que `BETTER_AUTH_URL` no coincidirá y el inicio de sesión de cuentas
fallará en ellas (la evaluación como invitado sí funciona). Además, si defines `DATABASE_URL` también para Preview, las vistas
previas escribirían en la **base de producción**. Recomendación: define estas variables solo para **Production**, o usa una rama de
Neon distinta para Preview.

## 2. Base de datos

- Las migraciones **no** se aplican solas en el despliegue. Cuando cambie el esquema, aplícalas desde tu máquina contra la base
  de producción: `npm run db:migrate` (lee `.env.local`; asegúrate de que `DATABASE_URL` apunte a la base correcta).
- La semilla de datos de referencia es idempotente: `npm run db:seed`.
- Ya aplicadas en el proyecto de Neon `cuarto-camino`: migraciones `0000_init` y `0001_tricky_swarm`, y la semilla.

## 3. Purga diaria (cron)

`vercel.json` programa `GET /api/cron/purge` una vez al día (03:17 UTC). Borra sesiones de invitado inactivas, evaluaciones
borradas hace más de 7 días y contadores de límite viejos. La política está en `docs/retencion-y-limites.md`. Comprueba en tu plan de
Vercel que permite esta frecuencia, y revisa **Settings → Cron Jobs** tras el primer despliegue.

## 4. Primer despliegue: verificación

1. Despliega y abre la URL de producción: la landing debe cargar y el diagrama debe responder.
2. `https://…/manifest.webmanifest` devuelve JSON y la app es instalable.
3. Haz una evaluación completa como invitado hasta ver el resultado.
4. Con `curl -I https://…/` comprueba las cabeceras (`Content-Security-Policy`, `Strict-Transport-Security`, …).
5. Prueba el cron a mano: sin cabecera debe responder **401**; con el secreto, **200** con conteos:

   ```bash
   curl -i https://…/api/cron/purge
   curl -i -H "Authorization: Bearer $CRON_SECRET" https://…/api/cron/purge
   ```

6. Revisa **Logs** de Vercel: no deben aparecer respuestas de usuarios ni correos.

## 5. Antes de compartirla con testers

La app es un instrumento **provisional y sin validar**. Para un piloto:

- Completa los datos del responsable del tratamiento en el aviso de consentimiento (hoy dice que «se completarán antes del
  lanzamiento») y publica una política de privacidad, conforme a la Ley 1581 de 2012.
- Di claramente a los testers que es una versión de prueba y que su resultado es una pista, no un diagnóstico.
- El contenido editorial está en **borrador**: no lo presentes como material revisado.
- Plan de validación del cuestionario: `docs/validacion-psicometrica.md`.

## 6. Revertir

En Vercel → Deployments, promueve un despliegue anterior. Si una migración ya se aplicó, es aditiva: la versión anterior del
código sigue funcionando; no hay migraciones destructivas pendientes.
