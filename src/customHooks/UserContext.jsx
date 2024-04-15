import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("UserContext: onAuthStateChanged", currentUser);
      setUser(currentUser);
      setIsUserLoggedIn(currentUser ? true : false);
      if (currentUser) {
        localStorage.setItem("authState", JSON.stringify(true));
      } else {
        localStorage.removeItem("authState");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, isUserLoggedIn, setIsUserLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
