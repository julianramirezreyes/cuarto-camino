# Seguridad web y PWA

## Cabeceras (src/lib/security-headers.ts, aplicadas desde next.config.ts)

| Cabecera | Qué hace |
| --- | --- |
| `Content-Security-Policy` | Solo origen propio (`default-src 'self'`); sin `object`, `frame-ancestors 'none'`, `base-uri`/`form-action` propios; `upgrade-insecure-requests` solo en producción. |
| `Strict-Transport-Security` | Fuerza HTTPS 2 años con subdominios. Solo en producción. Sin `preload` (ver pendientes). |
| `X-Content-Type-Options: nosniff` | Evita que el navegador adivine tipos MIME. |
| `Referrer-Policy: strict-origin-when-cross-origin` | No filtra rutas a otros orígenes. |
| `Permissions-Policy` | Desactiva cámara, micrófono, geolocalización y pagos. |
| `Cross-Origin-Opener-Policy: same-origin` | Aísla la ventana frente a otros orígenes. |
| `X-Frame-Options: DENY` | Anti-clickjacking (refuerza `frame-ancestors`). |
| `Cache-Control: no-store` | En `/api/**`, `/evaluacion/**`, `/resultado/**`. |
| `/sw.js` | `Content-Type` JS, `Cache-Control: no-cache`, `Service-Worker-Allowed: /`, CSP propia `script-src 'self'`. |

`poweredByHeader: false` quita `X-Powered-By`.

## Política de caché del service worker (public/sw.js + public/sw-policy.js)

| Recurso | Estrategia | Motivo |
| --- | --- | --- |
| `/_next/static/**`, `/icons/**`, `/apple-touch-icon.png` (GET, mismo origen) | Cache-first | Públicos e inmutables (hash en el nombre). |
| Navegaciones públicas | Network-first, **no se guardan**; si falla la red, se sirve `/offline` | Evita servir HTML viejo. |
| `/api/**`, `/evaluacion`, `/resultado` | Ignorados (el SW no interviene) | Datos privados / cookies. |
| Cualquier no-GET, otros orígenes | Ignorados | Mutaciones y terceros. |

Además solo se guarda una respuesta 200 sin `Set-Cookie` ni `Cache-Control: no-store/private`.
La caché se llama `cuarto-camino-static-<versión>`; al activar se borran las anteriores.
Actualización segura: no hay `skipWaiting` automático; la versión nueva espera a que se cierren las pestañas
(o a un mensaje `{type: "SKIP_WAITING"}`). `clients.claim()` es seguro porque los assets están versionados por hash.

La lógica de decisión vive en **un solo archivo**, `public/sw-policy.js` (JS plano). El SW lo carga con
`importScripts` y los tests lo cargan con `require`, así que no hay duplicado ni paso de build.
Al cambiar la política, sube `CACHE_VERSION`.

`/offline` es honesto: la evaluación necesita conexión para guardar respuestas; no se promete uso offline completo.

## Iconos

`node scripts/generate-icons.mjs` regenera `public/icons/*` y `public/apple-touch-icon.png` de forma determinista.
Usa `sharp`, que está en `node_modules` como dependencia opcional de Next (no declarada en `package.json`).
`src/app/favicon.ico` sigue siendo el de Next por defecto (fuera del alcance de este cambio); hay un
`public/icons/favicon-32.png` listo para sustituirlo.

## Cómo comprobar la instalabilidad

1. `npx next build && npx next start` y abrir en Chrome (localhost cuenta como contexto seguro).
2. DevTools > Application > Manifest: sin errores, iconos 192/512/maskable visibles. Service Workers: `sw.js` activado.
3. Offline: marcar "Offline" en Network y navegar a una página pública; debe verse `/offline`.
4. Lighthouse > categoría PWA/Installability (no se ejecutó Lighthouse real en este cambio).
5. iOS: Safari > Compartir > Añadir a pantalla de inicio (no probado en dispositivo real).

## Límites conocidos

- CSP usa `'unsafe-inline'` en `script-src` y `style-src`. Las CSP con nonce de Next exigen render dinámico de todas
  las páginas y son incompatibles con Partial Prerendering / `cacheComponents`, que esta app usa. Next ofrece SRI
  experimental (`experimental.sri`) como alternativa con generación estática; queda por evaluar. `unsafe-eval` solo en desarrollo.
- Los estilos inline también los usa Motion/Tailwind; sin `'unsafe-inline'` en `style-src` se rompería la UI.
- No se ha ejecutado Lighthouse ni probado la instalación en dispositivo real.
- La instalación en iOS no dispara `beforeinstallprompt`; se muestra una instrucción manual.

## Pendiente antes del lanzamiento

- [ ] Política de tratamiento de datos (Ley 1581 de 2012) y aviso de privacidad.
- [x] Rate limiting con almacén compartido: Postgres/Neon (`rate_limits`), falla abierto a memoria. Ver `docs/retencion-y-limites.md`.
- [ ] Activar `rateLimit.storage: "database"` en Better Auth (fragmento en `docs/retencion-y-limites.md`).
- [x] Purga de retención programada: `GET /api/cron/purge` + `vercel.json` (requiere `CRON_SECRET` en Vercel).
- [ ] Revisión legal de los plazos de retención propuestos (`docs/retencion-y-limites.md`).
- [ ] Decidir HSTS `preload` (es difícil de revertir; exige dominio definitivo y todos los subdominios en HTTPS).
- [ ] Evaluar CSP basada en SRI/hashes para retirar `'unsafe-inline'` de `script-src`.
- [ ] Reemplazar `src/app/favicon.ico` por el icono propio.
- [ ] Lighthouse y prueba de instalación en Android e iOS.
