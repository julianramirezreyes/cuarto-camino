# Lighthouse en producción

Medición del **2026-10-14** sobre https://cuartocamino.vercel.app con Lighthouse 13.5.0 y Chrome 155 (headless), perfil móvil
por defecto (Moto G con red 4G simulada) salvo donde se indica «escritorio». Una sola ejecución por página: la
variación entre corridas es normal (±2–3 puntos); tómalo como orden de magnitud, no como garantía.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS |
| --- | :---: | :---: | :---: | :---: | --- | --- | --- | --- |
| `/` (móvil) | 99 | 100 | 100 | 100 | 0,9 s | 1,5 s | 100 ms | 0 |
| `/introduccion` | 99 | 100 | 100 | 100 | 0,9 s | 1,3 s | 120 ms | 0 |
| `/evaluacion` (consentimiento) | 96 | 100 | 96 | 100 | 0,8 s | 2,6 s | 120 ms | 0 |
| `/biblioteca` | 99 | 100 | 100 | 100 | 1,0 s | 2,2 s | 60 ms | 0 |
| `/biblioteca/tipos/4` | 97 | 100 | 100 | 100 | 1,0 s | 1,9 s | 180 ms | 0 |
| `/cuenta/registro` | 100 | 100 | 100 | 60 (*) | 0,8 s | 1,3 s | 30 ms | 0 |
| `/` (escritorio) | 100 | 100 | 100 | 100 | 0,3 s | 0,5 s | 0 ms | 0 |
| `/biblioteca/tipos/4` (escritorio) | 100 | 100 | 100 | 100 | — | — | — | — |

## Lo que no es un problema

- (*) **SEO 60 en `/cuenta/registro`** es intencional: las páginas de cuenta llevan `<meta name="robots" content="noindex, nofollow">`.
- **Buenas prácticas 96 en `/evaluacion`:** el único fallo es «errores en consola», que corresponde al `404` de
  `GET /api/assessments/current` para un visitante nuevo. Es el comportamiento diseñado del contrato (ver `docs/api.md`); la
  interfaz lo trata como «no hay evaluación en curso». Podría eliminarse devolviendo `200` con `null`, pero cambiaría el contrato.
- **bfcache desactivado** en `/evaluacion`: es consecuencia de `Cache-Control: no-store`, que se aplica a propósito a las rutas
  privadas (`docs/seguridad-y-pwa.md`).
- Una primera medición de escritorio de `/` mostró un `ERR_FAILED` en un archivo JS (Buenas prácticas 96). **No se reprodujo**:
  dos corridas posteriores dieron 100/100/100/100 sin solicitudes fallidas. Se considera un fallo de red transitorio.

## Oportunidades menores (sin urgencia)

- **JavaScript sin usar** (~28 KiB en la mayoría de páginas, ~69 KiB en `/evaluacion`) y **JavaScript heredado** (~14 KiB):
  salen sobre todo del runtime de Next y las librerías de animación.
- **TBT** de 100–180 ms en móvil simulado: bien, pero es la métrica donde más margen hay si se quisiera optimizar.

## Límites de esta medición

- Lighthouse 13 **ya no incluye la categoría PWA**: la instalabilidad (manifiesto, iconos, service worker) se verifica con las
  pruebas E2E (`e2e/09-pwa.spec.ts`) y a mano con Chrome DevTools → Application. **No se ha probado instalar la app en un teléfono real.**
- Es un laboratorio simulado en una máquina de escritorio, no datos de usuarios reales (CrUX/Web Vitals de campo).
- Solo se midieron páginas públicas y las de cuenta sin sesión; **no** el informe de resultados (requiere completar una evaluación).

## Cómo repetirlo

```bash
npx lighthouse https://cuartocamino.vercel.app/ --chrome-path=/usr/bin/google-chrome \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=./lh.html
```

Añade `--preset=desktop` para escritorio.
