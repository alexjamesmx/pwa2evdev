const CACHE_DYNAMIC = "dynamic-v0";
const CACHE_STATIC = "static-v0";
const CACHE_INMUTABLE = "inmutable-v0";

const CACHE_DYNAMIC_LIMIT = 100;

const limpiarCache = (cacheName, numberItem) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > numberItem) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, numberItem));
      }
    });
  });
};

self.addEventListener("install", (event) => {
  console.log("installing sw...");
  const cachePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/",
      "/static/js/bundle.js",
      "/index.html",
      "/sw.js",
      "/js/sw-utils.js",
      "/manifest.json",
      "/favicon.ico",
      "/firebase-messaging.sw.js",
      "/pages/offline.html",
      "/not-found.jpeg",
      "/app.js",
    ]);
  });
  const cacheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    return cache.addAll([]);
  });
  event.waitUntil(Promise.all([cachePromise, cacheInmutable]));
});
self.addEventListener("activate", (event) => {
  console.log("SW: activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_STATIC &&
            cacheName !== CACHE_DYNAMIC &&
            cacheName !== CACHE_INMUTABLE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.includes("http")) {
    console.log("No se puede descargar");
    return;
  }

  let fetchResponse;

  if (event.request.method === "GET") {
    fetchResponse = caches.match(event.request).then((res) => {
      if (res) {
        console.log("Existe en cache", event.request.url);
        return res;
      } //return from cache
      // fetch from the internet

      console.log("No existe en cache", event.request.url);
      return fetch(event.request)
        .then((newRes) => {
          if (newRes.ok) {
            console.log("Agregando al cache dinamico", event.request.url);
            caches.open(CACHE_DYNAMIC).then((cache) => {
              cache.put(event.request, newRes.clone());
              limpiarCache(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT);
            });
            return newRes.clone();
          }
          return newRes;
        })
        .catch(() => {
          if (event.request.url.endsWith(".jsx")) {
            console.log("No hay conexión, devolver offline.html");
            return caches.open(CACHE_STATIC).then((cache) => {
              return cache.match("/pages/offline.html");
            });
          }
          if (
            event.request.url.includes(".jpeg") ||
            event.request.url.includes(".jpg") ||
            event.request.url.includes(".png") ||
            event.request.url.includes(".gif") ||
            event.request.url.includes(".webp") ||
            event.request.url.includes(".svg")
          ) {
            console.log("No hay conexión, devolver imagen");
            return caches.open(CACHE_STATIC).then((cache) => {
              return cache.match("/not-found.jpeg");
            });
          }
        });
    });
  } else if (event.request.method === "POST") {
    console.log("POST request: ", event.request.url);
    fetchResponse = fetch(event.request);
  }

  event.respondWith(fetchResponse);
});
