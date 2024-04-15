import React, { useContext } from "react";
import { Navbar, Collapse, Button, IconButton } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../customHooks/UserContext";
import { auth } from "../../firebase";
import Logo from "../../assets/logos/logo40.svg";
import { useNavigate } from "react-router-dom";
function CustomNavbar({ children }) {
  const { user, isUserLoggedIn, setIsUserLoggedIn } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClicked = () => {
    navigate("/login");
  };

  const logout = () => {
    console.log("Logging out...");
    auth.signOut();
    setIsUserLoggedIn(false);
    localStorage.removeItem("authState");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = isUserLoggedIn ? (
    <ul className="flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/profile" className="nav-link-custom">
        <img
          src={user?.photoURL || "../../assets/user-default-120.webp"}
          alt="foto de perfil"
          width="50"
          height="50"
          className="rounded-full cursor-pointer"
        />
      </Link>
      <li>
        <Link
          to="/profile"
          className={`p-1 font-normal items-center cursor-pointer ${
            isActive("/profile")
              ? "bg-blue-gray-900 text-white rounded px-4"
              : ""
          }`}
        >
          Profile
        </Link>
      </li>
    </ul>
  ) : (
    <></>
  );

  return (
    <div>
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900 mx-14">
          <Link
            to="/"
            className="mr-4 cursor-pointer py-1.5 font-medium flex items-center gap-2"
          >
            <img src={Logo} alt="Logo" width="40" height="40" />
            <span
              className={`${
                isActive("/") ? "bg-blue-gray-900 text-white rounded px-4" : ""
              }`}
            >
              Home
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">{navList}</div>
            {isUserLoggedIn ? (
              <div className="flex items-center gap-x-1"></div>
            ) : isActive("/login") ? (
              <></>
            ) : (
              <Button
                variant="text"
                size="sm"
                className="hidden lg:inline-block"
                onClick={() => handleLoginClicked()}
              >
                <span>Log In</span>
              </Button>
            )}
            {isUserLoggedIn ? (
              <div className="flex items-center gap-x-1">
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block"
                  onClick={() => logout()}
                >
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <></>
            )}
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
          <div className="flex items-center gap-x-1">
            {!isUserLoggedIn ? (
              <Button
                fullWidth
                variant="text"
                size="sm"
                className=""
                onClick={() => handleLoginClicked()}
              >
                <span>Log In</span>
              </Button>
            ) : (
              <Button
                fullWidth
                variant="text"
                size="sm"
                className=""
                onClick={() => logout()}
              >
                <span>Logout</span>
              </Button>
            )}
          </div>
        </Collapse>
      </Navbar>
      <div className="container mx-auto">{children}</div>
    </div>
  );
}

export default CustomNavbar;
