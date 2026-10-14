import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// public/sw-policy.js is the single source of truth: the service worker loads
// it with importScripts and these tests load it as a CommonJS module.
const require = createRequire(import.meta.url);
const policy = require("../../../public/sw-policy.js") as {
  CACHE_VERSION: string;
  STATIC_CACHE: string;
  OFFLINE_URL: string;
  classifyRequest: (r: { method: string; url: string; mode?: string }, origin: string) => string;
  shouldCache: (r: { method: string; url: string; mode?: string }, origin: string) => boolean;
  isCacheableResponse: (r: { status: number; type?: string; headers: { get(n: string): string | null } }) => boolean;
};

const origin = "https://cuarto.example";
const req = (path: string, extra: Partial<{ method: string; mode: string }> = {}) => ({
  method: "GET",
  url: origin + path,
  ...extra,
});

describe("shouldCache", () => {
  it.each([
    "/_next/static/chunks/app-abc123.js",
    "/_next/static/media/font.woff2",
    "/icons/icon-192.png",
    "/apple-touch-icon.png",
  ])("caches versioned public asset %s", (path) => {
    expect(policy.shouldCache(req(path), origin)).toBe(true);
  });

  it.each([
    "/api/assessments",
    "/api/content/type/4",
    "/evaluacion",
    "/evaluacion/anything",
    "/resultado",
    "/resultado?id=1",
    "/",
    "/biblioteca",
    "/sw.js",
    "/manifest.webmanifest",
  ])("never caches %s", (path) => {
    expect(policy.shouldCache(req(path), origin)).toBe(false);
  });

  it("never caches non-GET requests, even to static paths", () => {
    expect(policy.shouldCache(req("/_next/static/a.js", { method: "POST" }), origin)).toBe(false);
    expect(policy.shouldCache(req("/icons/icon-192.png", { method: "PUT" }), origin)).toBe(false);
  });

  it("never caches cross-origin requests", () => {
    expect(
      policy.shouldCache({ method: "GET", url: "https://evil.example/_next/static/a.js" }, origin),
    ).toBe(false);
  });

  it("does not let a traversal-like path escape the static prefix", () => {
    expect(policy.shouldCache(req("/_next/static/../../api/x"), origin)).toBe(false);
  });
});

describe("classifyRequest", () => {
  it("treats same-origin GET navigations as network-first", () => {
    expect(policy.classifyRequest(req("/biblioteca", { mode: "navigate" }), origin)).toBe("navigate");
  });

  it("bypasses private navigations and API calls entirely", () => {
    expect(policy.classifyRequest(req("/api/assessments"), origin)).toBe("bypass");
    expect(policy.classifyRequest(req("/evaluacion", { mode: "navigate" }), origin)).toBe("bypass");
    expect(policy.classifyRequest(req("/resultado", { mode: "navigate" }), origin)).toBe("bypass");
  });

  it("bypasses non-GET navigations", () => {
    expect(policy.classifyRequest(req("/", { mode: "navigate", method: "POST" }), origin)).toBe("bypass");
  });

  it("classifies static assets as cache-first", () => {
    expect(policy.classifyRequest(req("/_next/static/x.js"), origin)).toBe("static");
  });
});

describe("isCacheableResponse", () => {
  const res = (status: number, headers: Record<string, string> = {}, type = "basic") => ({
    status,
    type,
    headers: { get: (n: string) => headers[n.toLowerCase()] ?? null },
  });

  it("accepts plain 200 basic responses", () => {
    expect(policy.isCacheableResponse(res(200))).toBe(true);
  });
  it("rejects errors, opaque, cookies and private/no-store responses", () => {
    expect(policy.isCacheableResponse(res(404))).toBe(false);
    expect(policy.isCacheableResponse(res(206))).toBe(false);
    expect(policy.isCacheableResponse(res(200, {}, "opaque"))).toBe(false);
    expect(policy.isCacheableResponse(res(200, { "set-cookie": "a=b" }))).toBe(false);
    expect(policy.isCacheableResponse(res(200, { "cache-control": "no-store" }))).toBe(false);
    expect(policy.isCacheableResponse(res(200, { "cache-control": "private, max-age=0" }))).toBe(false);
  });
});

describe("cache versioning", () => {
  it("embeds the version in the cache name", () => {
    expect(policy.STATIC_CACHE).toContain(policy.CACHE_VERSION);
  });
});

describe("sw.js wiring", () => {
  const sw = readFileSync(join(process.cwd(), "public/sw.js"), "utf8");

  it("loads the shared policy and offline fallback", () => {
    expect(sw).toContain('importScripts("/sw-policy.js")');
    expect(sw).toContain("OFFLINE_URL");
  });
  it("cleans old caches on activate", () => {
    expect(sw).toMatch(/caches\.delete/);
  });
  it("does not call skipWaiting unprompted", () => {
    const outsideMessage = sw.replace(/addEventListener\("message"[\s\S]*?\}\);/, "");
    expect(outsideMessage).not.toContain("skipWaiting");
  });
});
