const baseURL = "/";
// const baseURL = "/pwa2evdev/";

if (navigator.serviceWorker) {
  console.log("Registering sw");
  navigator.serviceWorker.register(baseURL + "sw.js");
}

window.addEventListener("load", () => {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const { type } = event.data;
    if (type === "online") {
      console.log("Conectado a internet.");
    } else if (type === "offline") {
      console.log("No hay conexión a internet, inténtalo de nuevo más tarde.");
    }
  });
});

function isOnline() {
  if (navigator.onLine) {
    console.log("Conectado a internet.");
  } else {
    console.log("No hay conexión a internet, inténtalo de nuevo más tarde.");
  }
}

window.addEventListener("online", isOnline);
window.addEventListener("offline", isOnline);

isOnline();
