import React, { createContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [token, setToken] = useState(null);
  const notifyme = useCallback(() => {
    if (!window.Notification) {
      console.log("This browser does not support notifications.");
      return;
    }
    if (Notification.permission === "granted") {
      getTokenNotification();
    } else if (
      Notification.permission !== "denied" ||
      Notification.permission === "default"
    ) {
      Notification.requestPermission().then((permission) => {
        console.log("permission: ", permission);
        if (permission === "granted") {
          getTokenNotification();
        }
      });
    }
  }, []);
  useEffect(() => {
    notifyme();
  }, [token, notifyme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsUserLoggedIn(currentUser ? true : false);
      if (currentUser) {
        localStorage.setItem("authState", JSON.stringify(true));
        notifyme();
      } else {
        localStorage.removeItem("authState");
      }
      console.log("token: ", token);
    });

    return unsubscribe;
  }, [notifyme, token]);

  const getTokenNotification = async () => {
    const response = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_PUSH_NOTIFICATION_KEY,
    }).catch((err) => console.error("Error getting token: ", err));

    if (response) {
      setToken(response);
    } else {
      console.log("No token");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isUserLoggedIn, setIsUserLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
