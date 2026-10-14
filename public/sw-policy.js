/* Cache policy shared by public/sw.js (importScripts) and the unit tests
 * (require). Single source of truth: no build step, no duplicated logic.
 * Plain ES5-ish JS on purpose so it runs unchanged in both places. */
(function (root) {
  "use strict";

  var CACHE_VERSION = "v1";
  var STATIC_CACHE = "cuarto-camino-static-" + CACHE_VERSION;
  var OFFLINE_URL = "/offline";

  // Public, immutable (content-hashed or versioned) assets only.
  var STATIC_PREFIXES = ["/_next/static/", "/icons/"];
  var STATIC_FILES = ["/apple-touch-icon.png"];

  // Never handled by the service worker at all (private or user data).
  var PRIVATE_PREFIXES = ["/api/", "/evaluacion", "/resultado"];

  function parse(request, origin) {
    var url;
    try {
      url = new URL(request.url);
    } catch {
      return null;
    }
    if (url.origin !== origin) return null;
    return url;
  }

  function isPrivatePath(pathname) {
    return PRIVATE_PREFIXES.some(function (p) {
      return pathname === p.replace(/\/$/, "") || pathname.indexOf(p) === 0;
    });
  }

  function isStaticPath(pathname) {
    return (
      STATIC_FILES.indexOf(pathname) !== -1 ||
      STATIC_PREFIXES.some(function (p) {
        return pathname.indexOf(p) === 0;
      })
    );
  }

  /** @returns {"static" | "navigate" | "bypass"} */
  function classifyRequest(request, origin) {
    if (request.method !== "GET") return "bypass";
    var url = parse(request, origin);
    if (!url) return "bypass";
    if (isPrivatePath(url.pathname)) return "bypass";
    if (isStaticPath(url.pathname)) return "static";
    if (request.mode === "navigate") return "navigate";
    return "bypass";
  }

  function shouldCache(request, origin) {
    return classifyRequest(request, origin) === "static";
  }

  function isCacheableResponse(response) {
    if (response.status !== 200) return false;
    if (response.type === "opaque" || response.type === "opaqueredirect") return false;
    if (response.headers.get("set-cookie")) return false;
    var cc = (response.headers.get("cache-control") || "").toLowerCase();
    return cc.indexOf("no-store") === -1 && cc.indexOf("private") === -1;
  }

  var api = {
    CACHE_VERSION: CACHE_VERSION,
    STATIC_CACHE: STATIC_CACHE,
    OFFLINE_URL: OFFLINE_URL,
    classifyRequest: classifyRequest,
    shouldCache: shouldCache,
    isCacheableResponse: isCacheableResponse,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CCSWPolicy = api;
})(typeof self !== "undefined" ? self : this);
