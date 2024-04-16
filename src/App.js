import React, { lazy, Suspense, useEffect } from "react";
import {
  useRoutes,
  BrowserRouter,
  Navigate,
  useSearchParams,
  HashRouter,
} from "react-router-dom";
import CustomNavbar from "./components/navbar/CustomNavbar";
import { UserProvider } from "./customHooks/UserContext";
import { ImagesProvider } from "./customHooks/ImagesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { NetworkProvider } from "./customHooks/network-context";
import OfflineFallback from "./OfflineFallback";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
const Home = lazy(() => import("./pages/Home/Home"));
const Perfil = lazy(() => import("./pages/Perfil/Perfi"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryView = lazy(() => import("./pages/CategoryView/CategoryView"));

const getInitialAuthState = () => {
  const storedAuthState = localStorage.getItem("authState");
  return storedAuthState ? JSON.parse(storedAuthState) : false;
};

const AppRoutes = React.memo(({ isUserLoggedIn }) => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  return useRoutes([
    {
      path: "/profile",
      element: isUserLoggedIn ? (
        <Perfil />
      ) : (
        <Navigate to="/login" replace={true} />
      ),
    },
    {
      path: "/library",
      element:
        isUserLoggedIn && category ? (
          <CategoryView categorySelected={category} />
        ) : (
          <Navigate to="/login" replace={true} />
        ),
    },
    {
      path: "/login",
      element: isUserLoggedIn ? <Navigate to="/" replace={true} /> : <Login />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/offline",
      element: <OfflineFallback />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
});

const App = () => {
  const [isUserLoggedInState, setIsUserLoggedInState] = React.useState(
    getInitialAuthState()
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem("authState", JSON.stringify(true));
        setIsUserLoggedInState(true);
      } else {
        localStorage.removeItem("authState");
        setIsUserLoggedInState(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <HashRouter basename={"/pwa2evdev/"}>
      <NetworkProvider>
        <UserProvider>
          <ImagesProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <ToastContainer />

              <CustomNavbar isUserLoggedIn={isUserLoggedInState}>
                <AppRoutes isUserLoggedIn={isUserLoggedInState} />
              </CustomNavbar>
            </Suspense>
          </ImagesProvider>
        </UserProvider>
      </NetworkProvider>
    </HashRouter>
  );
};

export default App;
