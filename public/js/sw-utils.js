const db = PouchDB("firebase-db");
const server = "https://firestore.googleapis.com/google.firestore.v1.Firestore";

function postUpdateUsername() {
  const username = "";

  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((doc) => {
      const docData = doc.doc;
      const userId = docData.userId;
      const newDisplayName = docData.displayName;
      fetch(server, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            displayName: {
              stringValue: newDisplayName,
            },
          },
        }),
      }).then((res) => {
        if (res.ok) {
          db.remove(doc);
        }
      });
    });
  });
}

function manageAPIPOSTS(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT, req) {
  console.log("SW-manageAPIPOSTS");
  if (req.clone().method === "POST") {
    console.log("POST request to: ", req);
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          console.log("POST request to: ", req.url, "with body: ", body);
          const jsonObject = JSON.parse(body);
          return saveObjectInDB(jsonObject);
        });
    } else {
      return fetch(req);
    }
  } else {
    console.log("GET request to: ", req.url);
    return fetch(req)
      .then((resp) => {
        if (resp.ok) {
          updateDynamicCache(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT, req, resp);
          return resp.clone();
        }
      })
      .catch((err) => {
        return caches.match(req) || err;
      });
  }
}

function updateDynamicCache(cacheName, cacheLimit, req, res) {
  if (res.ok) {
    caches.open(cacheName).then((cache) => {
      cache.put(req, res.clone());
      limpiarCache(cacheName, cacheLimit);
    });
  } else {
    return res;
  }
}

const limpiarCache = (cacheName, numberItem) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > numberItem) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, numberItem));
      }
    });
  });
};

function saveObjectInDB(jsonObject) {
  jsonObject._id = new Date().toISOString();

  return db.put(jsonObject).then(() => {
    self.registration.sync.register("sync-post-edit-username");
    const newResp = { ok: true, offline: true };
    return new Response(JSON.stringify(newResp));
  });
}
