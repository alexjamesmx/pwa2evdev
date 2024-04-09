import React, { createContext, useContext, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../customHooks/UserContext";
import UserLibrary from "../../components/UserLibrary/UserLibrary";

const DefaultPhoto = lazy(() => import("../../assets/user-default-120.webp"));

// Create a context for managing the selected category
const CategoryContext = createContext();

const Perfil = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showCategory, setShowCategory] = useState("saved");

  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  const toggleCategory = (category) => {
    setShowCategory(category);
  };

  return (
    <CategoryContext.Provider value={{ showCategory, toggleCategory }}>
      <>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center my-8">
            <img
              src={user.photoURL || DefaultPhoto}
              alt="Foto de perfil"
              className="rounded-full outline outline-4 outline-blue-gray-900 w-30 h-30"
            />
            <div className="ml-4">
              <h3>{user.email}</h3>
              <div className="mt-2">
                <h3>{user.displayName}</h3>
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
        <UserLibrary showCategory={showCategory} />
      </>
    </CategoryContext.Provider>
  );
};

export default Perfil;
export { CategoryContext };
