import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { UserContext } from "../customHooks/UserContext";
import "./Perfil.css";

const Perfil = () => {
  const { isUserLoggedIn, user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  return (
    <div className="perfil-container">
      {isUserLoggedIn ? ( // Verificar si se encontraron datos del usuario
        <div>
          <h1 className="perfil-title">Perfil</h1>
          <div className="perfil-info">
            <img
              src={user.photoURL}
              alt="Foto de perfil"
              className="perfil-photo"
            />
            <div className="perfil-section">
              <h3>Correo electrónico:</h3>
              <p>{user.email}</p>
            </div>
            <div className="perfil-section">
              <h3>Nombre:</h3>
              <p>{user.displayName}</p>
              <button
                className="edit-profile-button"
                onClick={handleEditProfile}
              >
                Editar perfil
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="perfil-title">Perfil</h1>
          <p className="login-message">
            Inicia sesión para mejorar tu experiencia
          </p>
        </div>
      )}
    </div>
  );
};

export default Perfil;
