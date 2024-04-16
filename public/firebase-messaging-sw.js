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
