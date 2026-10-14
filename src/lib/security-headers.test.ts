import { describe, expect, it } from "vitest";
import { buildCsp, buildHeaderRules } from "./security-headers";

const directive = (csp: string, name: string) =>
  csp
    .split(";")
    .map((d) => d.trim())
    .find((d) => d === name || d.startsWith(`${name} `));

const valueOf = (rules: ReturnType<typeof buildHeaderRules>, source: string, key: string) =>
  rules.find((r) => r.source === source)?.headers.find((h) => h.key === key)?.value;

describe("buildCsp", () => {
  it("locks down the base directives", () => {
    const csp = buildCsp({ isProd: true });
    expect(directive(csp, "default-src")).toBe("default-src 'self'");
    expect(directive(csp, "object-src")).toBe("object-src 'none'");
    expect(directive(csp, "base-uri")).toBe("base-uri 'self'");
    expect(directive(csp, "form-action")).toBe("form-action 'self'");
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(csp, "connect-src")).toBe("connect-src 'self'");
    expect(directive(csp, "font-src")).toBe("font-src 'self'");
    expect(directive(csp, "img-src")).toBe("img-src 'self' data:");
    expect(directive(csp, "worker-src")).toBe("worker-src 'self'");
    expect(directive(csp, "manifest-src")).toBe("manifest-src 'self'");
  });

  it("never allows remote origins or eval in production", () => {
    const csp = buildCsp({ isProd: true });
    expect(csp).not.toMatch(/https?:\/\//);
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("*");
  });

  it("upgrades insecure requests only in production", () => {
    expect(buildCsp({ isProd: true })).toContain("upgrade-insecure-requests");
    expect(buildCsp({ isProd: false })).not.toContain("upgrade-insecure-requests");
  });

  it("allows unsafe-eval only in development", () => {
    expect(directive(buildCsp({ isProd: false }), "script-src")).toContain("'unsafe-eval'");
  });

  it("keeps script-src same-origin (inline allowed because pages are statically prerendered)", () => {
    const script = directive(buildCsp({ isProd: true }), "script-src");
    expect(script).toBe("script-src 'self' 'unsafe-inline'");
  });
});

describe("buildHeaderRules", () => {
  const prod = buildHeaderRules({ isProd: true });
  const dev = buildHeaderRules({ isProd: false });

  it("applies the hardening headers to every route", () => {
    const get = (k: string) => valueOf(prod, "/:path*", k);
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=(), payment=()");
    expect(get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(get("X-Frame-Options")).toBe("DENY");
    expect(get("Content-Security-Policy")).toContain("default-src 'self'");
  });

  it("sends HSTS only in production", () => {
    expect(valueOf(prod, "/:path*", "Strict-Transport-Security")).toBe(
      "max-age=63072000; includeSubDomains",
    );
    expect(valueOf(dev, "/:path*", "Strict-Transport-Security")).toBeUndefined();
  });

  it("does not opt into HSTS preload", () => {
    expect(valueOf(prod, "/:path*", "Strict-Transport-Security")).not.toContain("preload");
  });

  it.each(["/api/:path*", "/evaluacion/:path*", "/resultado/:path*"])(
    "marks %s as no-store",
    (source) => {
      expect(valueOf(prod, source, "Cache-Control")).toBe("no-store");
    },
  );

  it("serves the service worker revalidated, as JavaScript, with root scope", () => {
    expect(valueOf(prod, "/sw.js", "Content-Type")).toBe("application/javascript; charset=utf-8");
    expect(valueOf(prod, "/sw.js", "Cache-Control")).toBe("no-cache, max-age=0, must-revalidate");
    expect(valueOf(prod, "/sw.js", "Service-Worker-Allowed")).toBe("/");
    expect(valueOf(prod, "/sw.js", "Content-Security-Policy")).toBe(
      "default-src 'self'; script-src 'self'",
    );
  });

  it("revalidates the shared sw policy script too", () => {
    expect(valueOf(prod, "/sw-policy.js", "Cache-Control")).toBe("no-cache, max-age=0, must-revalidate");
  });

  it("orders specific rules after the global one so they win", () => {
    expect(prod[0].source).toBe("/:path*");
  });
});
