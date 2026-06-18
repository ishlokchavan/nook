/*
 * Nook service worker — gives the installed PWA an app-like offline baseline.
 *
 * Strategy:
 *  - Precache the app shell + offline fallback on install.
 *  - Navigations: network-first, falling back to the cached page, then to
 *    /offline when truly offline. Keeps content fresh but never shows the
 *    browser's dino screen inside the installed app.
 *  - Static assets (_next/static, icons): cache-first (they're content-hashed).
 *  - Never cache Supabase / API calls — auth and data must always hit network.
 */
const VERSION = "nook-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE = ["/", "/app", "/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSupabaseOrApi(url) {
  return (
    url.hostname.endsWith(".supabase.co") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/auth")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Different origin or data/auth traffic: let it pass straight through.
  if (url.origin !== self.location.origin || isSupabaseOrApi(url)) return;

  // App navigations: network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("/offline");
        }),
    );
    return;
  }

  // Hashed static assets: cache-first.
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
});
