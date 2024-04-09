import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditarPerfil.css";
import { ArrowLeftSquareFill } from "react-bootstrap-icons";

const EditarPerfil = () => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the new display name is not empty
    if (newDisplayName.trim() === "") {
      alert("Please enter a valid display name.");
      return;
    }

    // Save the new display name in localStorage
    localStorage.setItem("newDisplayName", newDisplayName);
    console.log("New display name saved locally:", newDisplayName);

    // Redirect the user to the profile page
    navigate("/profile");
  };

  return (
    <>
      <div className="ms-2 d-flex">
      <ArrowLeftSquareFill className="back-button pointer" onClick={() => window.history.back()}
      width={40}
      height={40} />
    </div>
     <div className="editar-perfil-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="displayName">New Name:</label>
        <input
          type="text"
          id="displayName"
          value={newDisplayName}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
    </>
  );
   
};

export default EditarPerfil;
