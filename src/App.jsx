import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  useRoutes,
  BrowserRouter,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import CustomNavbar from "./components/navbar/CustomNavbar";
import { UserProvider } from "./customHooks/UserContext";
import { ImagesProvider } from "./customHooks/ImagesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Home = lazy(() => import("./pages/Home/Home"));
const Perfil = lazy(() => import("./pages/Perfil/Perfi"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditarPerfil = lazy(() => import("./pages/Perfil/EditarPerfil"));
const CategoryView = lazy(() => import("./pages/CategoryView/CategoryView"));
const AppRoutes = React.memo(({ isUserLoggedIn }) => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  return useRoutes([
    {
      path: "/profile",
      element: isUserLoggedIn ? <Perfil /> : <Login />,
    },
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
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
});

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsUserLoggedIn(currentUser ? true : false);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/pwa2evdev/"}>
      <UserProvider>
        <ImagesProvider>
          <ToastContainer />
          <Suspense fallback={<div>Loading...</div>}>
            <CustomNavbar isUserLoggedIn={isUserLoggedIn}>
              <AppRoutes isUserLoggedIn={isUserLoggedIn} />
            </CustomNavbar>
          </Suspense>
        </ImagesProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
