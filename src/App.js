import React, { lazy, Suspense } from "react";
import {
  useRoutes,
  BrowserRouter,
  Navigate,
  useSearchParams,
} from "react-router-dom";
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
      path: "*",
      element: <NotFound />,
    },
  ]);
});

const App = () => {
  const isUserLoggedIn = getInitialAuthState();
  return (
    <BrowserRouter basename={"/"}>
      <UserProvider>
        <ImagesProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ToastContainer />

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
