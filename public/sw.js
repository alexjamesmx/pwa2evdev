// Crear las variables de cache
const CACHE_DYNAMIC = "dynamic-v0"; // Para los archivos que se van a descargar
const CACHE_STATIC = "static-v0"; // App shell
const CACHE_INMUTABLE = "inmutable-v0"; // CDN de terceros. LIBRERIAS

const CACHE_DYNAMIC_LIMIT = 30;

// Función para limpiar el cache
const limpiarCache = (cacheName, numberItem) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > numberItem) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, numberItem)); // Corrección: debe llamarse limpiarCache nuevamente después de la eliminación
      }
    });
  });
};

self.addEventListener("install", (event) => {
  console.log("installing sw. ..");
  const cachePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/",
      "/index.html",
      "/sw.js",
      "/js/sw-utils.js",
      "manifest.json",
      "favicon.ico",
      "firebase-messaging.sw.js",
      "/pages/offline.html",
      "not-found.jpeg",
      "app.js",
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
      if (res) return res; //return from cache
      // fetch from the internet

      console.log("No existe en cache", event.request.url);
      return fetch(event.request).then((newRes) => {
        if (newRes.ok) {
          caches.open(CACHE_DYNAMIC).then((cache) => {
            cache.put(event.request, newRes.clone());
            limpiarCache(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT);
          });
          return newRes.clone();
        }

        return newRes;
      });
    });
  } else if (event.request.method === "POST") {
    console.log("POST request: ", event.request.url);
    fetchResponse = fetch(event.request);
  }

  event.respondWith(fetchResponse);
});

// Event listeners para manejar la conexión
const sendConnectionStatus = () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "connectionStatus",
        online: navigator.onLine,
      });
    });
  });
};

self.addEventListener("online", sendConnectionStatus);
self.addEventListener("offline", sendConnectionStatus);

// Inicializa el estado de conexión al inicio
sendConnectionStatus();

// Almacenamiento de la sesión del usuario
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "storeUserData") {
    const userData = event.data.userData;
    localStorage.setItem("userData", JSON.stringify(userData));
  }
});
