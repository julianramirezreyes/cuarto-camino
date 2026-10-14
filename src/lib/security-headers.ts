/**
 * Security headers for next.config.ts `headers()`.
 *
 * CSP note: Next documents a nonce-based CSP, but nonces require dynamic
 * rendering of every page and are incompatible with Partial Prerendering /
 * `cacheComponents`, which this app relies on. We therefore use a same-origin
 * policy with 'unsafe-inline' for scripts/styles (Next injects inline
 * bootstrap scripts; Motion/Tailwind use inline styles). Everything else is
 * locked down. See docs/seguridad-y-pwa.md.
 */

export type HeaderRule = { source: string; headers: { key: string; value: string }[] };

export function buildCsp({ isProd }: { isProd: boolean }): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  if (isProd) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

const NO_STORE = [{ key: "Cache-Control", value: "no-store" }];
const REVALIDATE = "no-cache, max-age=0, must-revalidate";

export function buildHeaderRules({ isProd }: { isProd: boolean }): HeaderRule[] {
  const global = [
    { key: "Content-Security-Policy", value: buildCsp({ isProd }) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    ...(isProd
      ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
      : []),
  ];

  // Specific rules come after the global one so their values win.
  return [
    { source: "/:path*", headers: global },
    { source: "/api/:path*", headers: NO_STORE },
    { source: "/evaluacion/:path*", headers: NO_STORE },
    { source: "/resultado/:path*", headers: NO_STORE },
    {
      source: "/sw.js",
      headers: [
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        { key: "Cache-Control", value: REVALIDATE },
        { key: "Service-Worker-Allowed", value: "/" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
      ],
    },
    { source: "/sw-policy.js", headers: [{ key: "Cache-Control", value: REVALIDATE }] },
  ];
}
