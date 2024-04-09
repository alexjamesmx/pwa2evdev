import React from "react";
import { auth } from "../firebase";
import { UserContext } from "../customHooks/UserContext";
function Logout() {
  const { setIsUserLoggedIn } = React.useContext(UserContext);
  const logout = () => {
    auth.signOut();
    setIsUserLoggedIn(false);
  };
  useEffect(() => {
    logout();
  }, []);
  return <></>;
}
