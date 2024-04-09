import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "../../firebase";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import googleIcon from "../../assets/logos/google.webp";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      const user = response.user;

      const firestoreUser = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        // Add other relevant user data fields
      };

      const db = getFirestore();
      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, user.uid), firestoreUser);

      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      // Add user-friendly error handling here if needed
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="h2 mb-4">Login</h2>
        <button onClick={logGoogleUser} className="login-button">
          <img
            src={googleIcon}
            alt="Google icon"
            width={30}
            height={30}
            className="me-4"
          />
          Sign In With Google
        </button>
      </div>
    </div>
  );
};

export default Login;
