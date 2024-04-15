import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getFirestore, updateDoc } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBH2UdRWATVXpvk1ohUDEI0pgjnYfXD_I",
  authDomain: "test-push-cbd7c.firebaseapp.com",
  projectId: "test-push-cbd7c",
  storageBucket: "test-push-cbd7c.appspot.com",
  messagingSenderId: "624630754496",
  appId: "1:624630754496:web:caae6a83b542c786b99125",
  measurementId: "G-0CSWHXGH94",
};
// Initialize Firebase Auth provider
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
// const analytics = getAnalytics(app);

export const messaging = getMessaging(app);

export const firestore = getFirestore(app);

export const updateUserDisplayNameInDatabase = async (
  userId,
  newDisplayName
) => {
  try {
    await updateDoc(doc(collection(firestore, "users"), userId), {
      displayName: newDisplayName,
    });
  } catch (error) {
    console.error("Error updating user display name in database:", error);
    throw error;
  }
};
