import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { UserContext } from "../customHooks/UserContext";
import UserLibrary from "../components/UserLibrary";
import "./Perfil.css";

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
    <>
      <div className="perfil-header">
        <div className="perfil-info">
          <Avatar
            src={user.photoURL}
            alt="Foto de perfil"
            className="perfil-photo"
            sx={{ width: 120, height: 120 }}
          />
          <div className="perfil-section">
            <h3>{user.email}</h3>
          </div>
          <div className="perfil-section">
            <h3>{user.displayName}</h3>
            <Button
              className="mt-2 rounded-4 p-2 fs-6 text-white border-white fw-bold"
              variant="secondary"
              onClick={handleEditProfile}
            >
              Editar perfil
            </Button>
          </div>
        </div>
      </div>
      <div className="perfil-library">
        <div className="perfil-section d-flex w-100 justify-content-center gap-5">
          <h3
            className={`pointer ${
              showCategory === "saved" ? "text-decoration-underline" : ""
            }`}
            onClick={() => toggleCategory("saved")}
          >
            Saved
          </h3>
          <h3
            className={`pointer ${
              showCategory !== "saved" ? "text-decoration-underline" : ""
            }`}
            onClick={() => toggleCategory("library")}
          >
            Library
          </h3>
        </div>
        <UserLibrary categorySelected={showCategory} />
      </div>
    </>
  );
};

export default Perfil;
