import React, {
  createContext,
  useContext,
  useState,
  lazy,
  useEffect,
} from "react";
import { UserContext } from "../../customHooks/UserContext";
import UserLibrary from "../../components/UserLibrary/UserLibrary";
import { DrawerBottom } from "../../components/imageDetails/DrawerBottom";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import EditarPerfil from "./EditarPerfil";

const DefaultPhoto = lazy(() => import("../../assets/user-default-120.webp"));

// Create a context for managing the selected category
const CategoryContext = createContext();

const Perfil = () => {
  const { user, setUser } = useContext(UserContext);
  const [showCategory, setShowCategory] = useState("saved");
  const [openBottom, setOpenBottom] = useState(false);
  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => setOpenBottom(false);
  const [displayName, setDisplayName] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleEditProfile = () => {
    setOpen((cur) => !cur);
  };

  const toggleCategory = (category) => {
    setShowCategory(category);
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDisplayName(userData.displayName);
        }
      }
    };

    loadUserData();
  }, [user]);

  return (
    <CategoryContext.Provider value={{ showCategory, toggleCategory }}>
      <>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center my-8">
            <img
              rel="preload"
              src={user.photoURL || DefaultPhoto}
              alt="Foto de perfil"
              className="rounded-full outline outline-4 outline-blue-gray-900 w-30 h-30"
            />
            <div className="ml-4">
              <h3 className="font-bold">{user.email}</h3>
              <div className="mt-2">
                <h3>
                  <span className="font-thin italic">username</span>:{" "}
                  {displayName}
                </h3>

                <button
                  className="bg-blue-gray-700 text-white p-3 rounded-full mt-3"
                  onClick={handleEditProfile}
                >
                  Editar perfil
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <h3
              className={`cursor-pointer ${
                showCategory === "saved" ? "underline text-blue-500" : ""
              }`}
              onClick={() => toggleCategory("saved")}
            >
              Saved
            </h3>
            <h3
              className={`cursor-pointer ${
                showCategory !== "saved" ? "text-blue-500 underline" : ""
              }`}
              onClick={() => toggleCategory("library")}
            >
              Library
            </h3>
          </div>
        </div>
        <UserLibrary
          showCategory={showCategory}
          openDrawerBottom={openDrawerBottom}
        />
        <DrawerBottom
          openBottom={openBottom}
          closeDrawerBottom={closeDrawerBottom}
        />
      </>
      <EditarPerfil
        open={open}
        setOpen={setOpen}
        user={user}
        setUser={setUser}
      />

      <></>
    </CategoryContext.Provider>
  );
};

export default Perfil;
export { CategoryContext };
