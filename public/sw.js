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
    // return cache.addAll([]);
  });
  event.waitUntil(Promise.all([cachePromise, cacheInmutable]));
});

self.addEventListener("fetch", (event) => {
  // Cache with network fallback
  if (event.request.method === "GET") {
    const respuesta = caches.match(event.request).then((response) => {
      if (response) return response;
      // Si no existe el archivo, verifica si hay conexión
      if (!navigator.onLine) {
        // Si no hay conexión, responde con la imagen not-found.jpg desde el cache estático
        return caches.match("/not-found.jpg");
      }
      // Si hay conexión, descarga el archivo
      return fetch(event.request).then((newResponse) => {
        caches.open(CACHE_DYNAMIC).then((cache) => {
          cache.put(event.request, newResponse);
          limpiarCache(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT);
        });
        return newResponse.clone();
      });
    });
    event.respondWith(respuesta);
  } else {
    // Si no es una solicitud GET, simplemente pasa la solicitud al servidor
    event.respondWith(fetch(event.request));
  }
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

self.addEventListener("activate", (event) => {
  console.log("SW: esta siendo activando...");
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
