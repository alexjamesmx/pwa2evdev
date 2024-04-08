import React, { useState, useEffect, useContext } from "react";
import {
  useRoutes,
  BrowserRouter,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import Home from "./pages/Home";
import Perfil from "./pages/Perfi";
import "./App.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import CustomNavbar from "./components/CustomNavbar";
import { UserProvider, UserContext } from "./customHooks/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditarPerfil from "./pages/EditarPerfil";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CategoryView from "./pages/CategoryView";

const AppRoutes = ({ isUserLoggedIn }) => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  return useRoutes([
    {
      path: "/profile",
      element: isUserLoggedIn ? <Perfil /> : <Login />,
    }, // Redirect to login if not logged in
    {
      path: "/editProfile",
      element: <EditarPerfil />,
    },
    {
      path: "/library",
      element:
        isUserLoggedIn && category ? (
          <CategoryView categorySelected={category} />
        ) : (
          <Login />
        ),
    },
    {
      path: "/login",
      element: isUserLoggedIn ? <Navigate to="/" /> : <Login />,
    }, // Redirect to home if already logged in
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> },
  ]);
};

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsUserLoggedIn(currentUser ? true : false);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <ToastContainer />
          <CustomNavbar isUserLoggedIn={isUserLoggedIn} />
          <AppRoutes isUserLoggedIn={isUserLoggedIn} />
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
