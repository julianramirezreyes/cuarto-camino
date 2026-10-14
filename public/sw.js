/* Cuarto Camino service worker.
 * - Cache-first ONLY for public, versioned static assets (see sw-policy.js).
 * - Network-first for navigations, with /offline as fallback.
 * - Never touches /api, /evaluacion, /resultado or non-GET requests.
 * - No automatic activation of new versions: a new version waits until old tabs close, or
 *   the page sends {type: "SKIP_WAITING"}. */
importScripts("/sw-policy.js");

const { STATIC_CACHE, OFFLINE_URL, classifyRequest, isCacheableResponse } = self.CCSWPolicy;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" }))),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("cuarto-camino-") && k !== STATIC_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const kind = classifyRequest(request, self.location.origin);
  if (kind === "bypass") return;

  if (kind === "static") {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (isCacheableResponse(response)) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Navigation: network-first, never cached; offline page only on network failure.
  event.respondWith(
    fetch(request).catch(() => caches.match(OFFLINE_URL).then((r) => r || Response.error())),
  );
});
