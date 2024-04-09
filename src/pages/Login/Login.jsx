import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "../../firebase";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import googleIcon from "../../assets/logos/google40.svg";

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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md bg-gradient-to-r from-pink-500 to-purple-500 max-w-md w-full h-2/5 flex justify-center flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <button
          onClick={logGoogleUser}
          className="bg-white text-black font-bold py-2 px-4 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
        >
          <img
            src={googleIcon}
            alt="Google icon"
            className="mr-2"
            width={40}
            height={40}
          />
          Sign In With Google
        </button>
      </div>
    </div>
  );
};

export default Login;
