const CACHE = "botbuy-v2";
const OFFLINE = "/offline";
const PRECACHE = [
  "/",
  "/home",
  "/signup",
  "/deals",
  "/intent",
  "/vault",
  "/settings",
  OFFLINE,
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const hit =
          (await caches.match(event.request)) ||
          (await caches.match(url.pathname));
        if (hit) return hit;
        if (event.request.mode === "navigate") {
          return (
            (await caches.match(OFFLINE)) ||
            (await caches.match("/home")) ||
            (await caches.match("/"))
          );
        }
        return caches.match(OFFLINE);
      }),
  );
});
