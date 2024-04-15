importScripts("https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js");
importScripts("js/sw-utils.js");
importScripts("firebase-messaging-sw.js");

const CACHE_DYNAMIC = "dynamic-v0";
const CACHE_STATIC = "static-v0";
const CACHE_INMUTABLE = "inmutable-v0";

const CACHE_DYNAMIC_LIMIT = 151;

self.addEventListener("install", (event) => {
  console.log("SW: static cache installed");
  const cachePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/",
      "/img/29.png",
      "/img/40.png",
      "/img/57.png",
      "/img/58.png",
      "/img/60.png",
      "/img/80.png",
      "/img/87.png",
      "/img/114.png",
      "/img/120.png",
      "/img/180.png",
      "/img/1024.png",
      "/img/maskable_iconx192.png",
      "/img/pinterest_mobile360x740.png",
      "/img/pinterest_desktop_1280x800.png",
      "/js/app.js",
      "/js/sw-utils.js",
      "/favicon.ico",
      "/firebase-messaging.sw.js",
      "/index.html",
      "/manifest.json",
      "/OfflineFallback.js",
      "/sw.js",
      "/static/js/bundle.js",
      "/img/not-found.png",
      "/app.js",
      "/static/js/src_components_ListImages_InfiniteList_jsx.chunk.js",
      "/static/js/src_pages_Home_Home_jsx.chunk.js",
      "/static/js/vendors-node_modules_react-infinite-scroll-component_dist_index_es_js.chunk.js",
      "/static/js/src_components_imageDetails_ImageDetails_jsx-src_utils_js.chunk.js",
      "/static/js/src_pages_Login_Login_jsx.chunk.js",
      "/static/js/src_pages_Perfil_Perfi_jsx.chunk.js",
      "/static/js/src_pages_Perfil_EditarPerfi_jsx.chunk.js",
      "/static/js/src_pages_CategoryView_CategoryView_jsx.chunk.js",
      "/static/media/google40.1d1b6b0523bfed6fe90561969e50c650.svg",
      "/static/media/logo40.43a81a044e58ea50f3f12bbdb866dd7d.svg",
    ]);
  });
  const cacheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    return cache.addAll([]);
  });
  event.waitUntil(Promise.all([cachePromise, cacheInmutable]));
});
self.addEventListener("activate", (event) => {
  console.log("SW: activated");
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
    return;
  }

  let fetchResponse;

  if (
    event.request.url.includes("database") &&
    event.request.url.includes("Write")
  ) {
    fetchResponse = manageAPIPOSTS(
      CACHE_DYNAMIC,
      CACHE_DYNAMIC_LIMIT,
      event.request
    );
  }

  if (event.request.method === "GET") {
    fetchResponse = caches.match(event.request).then((res) => {
      if (res) {
        return res;
      } //return from cache
      // fetch from the internet

      return fetch(event.request)
        .then((newRes) => {
          if (newRes.ok) {
            updateDynamicCache(
              CACHE_DYNAMIC,
              CACHE_DYNAMIC_LIMIT,
              event.request,
              newRes.clone()
            );
            return newRes.clone();
          }
          return newRes;
        })
        .catch(() => {
          if (event.request.url.includes(".jsx")) {
            return caches.open(CACHE_STATIC).then((cache) => {
              return cache.match("/OfflineFallback.js");
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
            return caches.open(CACHE_STATIC).then((cache) => {
              return cache.match("/img/not-found.png");
            });
          }
          return caches.open(CACHE_STATIC).then((cache) => {
            return cache.match("/OfflineFallback.js");
          });
        });
    });
  } else if (event.request.method === "POST") {
    fetchResponse = fetch(event.request);
  }

  event.respondWith(fetchResponse);
});

self.addEventListener("sync", (event) => {
  console.log("Connection restored! Syncing data...");
  if (event.tag === "sync-post-edit-username") {
    event.waitUntil(postUpdateUsername());
  }
});
