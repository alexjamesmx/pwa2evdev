import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLibrary from "../../components/UserLibrary/UserLibrary";
import { UserContext } from "../../customHooks/UserContext";
import "./Perfil.css";

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

  console.log("showCategory", showCategory);

  return (
    <CategoryContext.Provider value={{ showCategory, toggleCategory }}>
      <>
        <div className="perfil-header">
          <div className="perfil-info">
            <img
              src={user.photoURL}
              alt="Foto de perfil"
              className="perfil-photo"
              style={{ width: 120, height: 120 }}
            />
            <div className="perfil-section">
              <h3>{user.email}</h3>
            </div>
            <div className="perfil-section">
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
        <div className="perfil-library">
          <div className="perfil-section justify-content-center gap-5 flex">
            <h3
              className={`pointer ${
                showCategory === "saved" ? "underline text-blue-500" : ""
              }`}
              onClick={() => toggleCategory("saved")}
            >
              Saved
            </h3>
            <h3
              className={`pointer ${
                showCategory !== "saved" ? "text-blue-500 underline" : ""
              }`}
              onClick={() => toggleCategory("library")}
            >
              Library
            </h3>
          </div>
        </div>
        <UserLibrary />
      </>
    </CategoryContext.Provider>
  );
};

export default Perfil;
export { CategoryContext };
