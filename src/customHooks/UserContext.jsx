import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authState")) || null
  );
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    setIsUserLoggedIn(user ? true : false);
    if (user) {
      console.log("USERCONTEXt user: ", user);
      localStorage.setItem("authState", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authState"));
    if (user) {
      axios
        .get(process.env.REACT_APP_BACK_API + "/users/" + user._id)
        .then((response) => {
          if (response.status === 200) {
            console.log("User from mongo", user);
            setUser(user);
          } else {
            console.error("Error getting user: ", response);
          }
        })
        .catch((error) => {
          console.error("Error getting user: ", error);
        });
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
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
