const db = PouchDB("ev2-db");
const server = "http://localhost:3001/api/users/";

function manageAPIPOSTS(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT, req) {
  const method = req.clone().method;
  const url = req.clone().url;
  if (method === "POST") {
    if (url.includes("categories")) {
      // console.log("SW categories");
    }
    // if (self.registration.sync) {
    //   return req
    //     .clone()
    //     .text()
    //     .then((body) => {
    //       console.log("SW API POST request to: ", req.url, "with body: ", body);
    //       const jsonObject = JSON.parse(body);
    //       return saveObjectInDB(jsonObject);
    //     });
    // } else {
    //   return fetch(req);
    // }
  } else if (method === "PUT") {
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          console.log("SW API PUT request to: ", req.url, "with body: ", body);
          const jsonObject = JSON.parse(body);
          return saveDisplayNameInDB(jsonObject);
        });
    } else {
      return fetch(req);
    }
  } else {
    return fetch(req);
  }
}

//--------------------toggle save------------------
function saveToggleSaveInDB(jsonObject) {
  jsonObject._id = new Date().toISOString();
  console.log("SW-saveObjectInDB: ", jsonObject);

  return db.put(jsonObject).then(() => {
    console.log("SW-registration.sync.register: ", self.registration.sync);
    self.registration.sync.register("sync-post-save-favorite");
    const newResp = { ok: true, offline: true };
    return new Response(JSON.stringify(newResp));
  });
}

function postSaveFavorite() {
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((doc) => {
      console.log("SW-postSaveFavorite: ", doc.doc);
      const docData = doc.doc;
      const userId = docData.user_id;

      fetch(server + userId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: docData,
        }),
      }).then((res) => {
        if (res.ok) {
          db.remove(doc);
        }
      });
    });
  });
}

//--------------------displayname------------------

function saveDisplayNameInDB(jsonObject) {
  jsonObject._id = new Date().toISOString();
  console.log("SW-saveObjectInDB: ", jsonObject);

  return db.put(jsonObject).then(() => {
    self.registration.sync.register("sync-post-edit-username");
    const newResp = { ok: true, offline: true };
    return new Response(JSON.stringify(newResp));
  });
}

function postUpdateUsername() {
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((doc) => {
      console.log("SW-postUpdateUsername: ", doc.doc);
      const docData = doc.doc;
      const userId = docData.id;
      const newDisplayName = docData.displayName;
      fetch(server + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: newDisplayName,
        }),
      }).then((res) => {
        if (res.ok) {
          db.remove(doc);
        }
      });
    });
  });
}

//--------------------displayname------------------
