importScripts("https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js");
importScripts("/pwa2evdev/js/sw-utils.js");
importScripts("/pwa2evdev/firebase-messaging-sw.js");

const CACHE_DYNAMIC = "dynamic-v0";
const CACHE_STATIC = "static-v0";
const CACHE_INMUTABLE = "inmutable-v0";

const CACHE_DYNAMIC_LIMIT = 151;

self.addEventListener("install", (event) => {
  console.log("SW: static cache installed");
  const cachePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/pwa2evdev/",
      "/pwa2evdev/img/29.png",
      "/pwa2evdev/img/40.png",
      "/pwa2evdev/img/57.png",
      "/pwa2evdev/img/58.png",
      "/pwa2evdev/img/60.png",
      "/pwa2evdev/img/80.png",
      "/pwa2evdev/img/87.png",
      "/pwa2evdev/img/114.png",
      "/pwa2evdev/img/120.png",
      "/pwa2evdev/img/180.png",
      "/pwa2evdev/img/1024.png",
      "/pwa2evdev/img/maskable_iconx192.png",
      "/pwa2evdev/img/pinterest_mobile360x740.png",
      "/pwa2evdev/img/pinterest_desktop_1280x800.png",
      "/pwa2evdev/js/app.js",
      "/pwa2evdev/js/sw-utils.js",
      "/pwa2evdev/favicon.ico",
      "/pwa2evdev/firebase-messaging.sw.js",
      "/pwa2evdev/index.html",
      "/pwa2evdev/manifest.json",
      "/pwa2evdev/OfflineFallback.js",
      "/pwa2evdev/sw.js",
      "/pwa2evdev/static/js/bundle.js",
      "/pwa2evdev/img/not-found.png",
      // "/pwa2evdev/static/js/src_components_ListImages_InfiniteList_jsx.chunk.js",
      // "/pwa2evdev/static/js/src_pages_Home_Home_jsx.chunk.js",
      // "/pwa2evdev/static/js/vendors-node_modules_react-infinite-scroll-component_dist_index_es_js.chunk.js",
      // "/pwa2evdev/static/js/src_components_imageDetails_ImageDetails_jsx-src_utils_js.chunk.js",
      // "/pwa2evdev/static/js/src_pages_Login_Login_jsx.chunk.js",
      // "/pwa2evdev/static/js/src_pages_Perfil_Perfi_jsx.chunk.js",
      // "/pwa2evdev/static/js/src_pages_Perfil_EditarPerfi_jsx.chunk.js",
      // "/pwa2evdev/static/js/src_pages_CategoryView_CategoryView_jsx.chunk.js",
      // "/pwa2evdev/static/media/google40.1d1b6b0523bfed6fe90561969e50c650.svg",
      // "/pwa2evdev/static/media/logo40.43a81a044e58ea50f3f12bbdb866dd7d.svg",
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
