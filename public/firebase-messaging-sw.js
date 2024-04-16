import { isSupported } from "firebase/messaging";
import {
  getMessaging,
  onBackgroundMessage,
  getToken,
  isSupported,
} from "firebase/messaging";

importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCBH2UdRWATVXpvk1ohUDEI0pgjnYfXD_I",
  authDomain: "test-push-cbd7c.firebaseapp.com",
  projectId: "test-push-cbd7c",
  storageBucket: "test-push-cbd7c.appspot.com",
  messagingSenderId: "624630754496",
  appId: "1:624630754496:web:caae6a83b542c786b99125",
  measurementId: "G-0CSWHXGH94",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

const serviceWorkerScope = "/pwa2evdev/"; // Set the correct scope for your service worker

isSupported().then((supported) => {
  if (supported) {
    const messaging = getMessaging(app, {
      serviceWorkerRegistration: {
        options: {
          scope: serviceWorkerScope,
        },
      },
    });

    onBackgroundMessage(messaging, (payload) => {
      console.log("Received background message:", payload);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/pwa2evdev/img/40.png",
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  } else {
    console.log("Firebase Cloud Messaging is not supported in this browser.");
  }
});
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: "./img/40.png",
  };

  self.registration.showNotification(notificationTitle, options);
});
