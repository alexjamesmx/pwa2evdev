import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getFirestore, getDoc } from "firebase/firestore";
import { UserContext } from "../customHooks/UserContext";

import "./UserLibrary.css";

function UserLibrary({ categorySelected }) {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const db = getFirestore();
        const userId = user.uid;
        const imagesRef = doc(collection(db, "images"), userId);
        const docSnapshot = await getDoc(imagesRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const selectedCategoryData = userData[categorySelected] || [];
          setCategories([
            { category: categorySelected, images: selectedCategoryData },
          ]);
        }
      } catch (error) {
        console.error("Error checking saved status", error);
      }
    };

    getFavorites();
  }, [categorySelected, user]);

  const displayLibrary = () => {
    navigate(`/library?category=${categorySelected}`);
  };

  return (
    <div className="library-preview-card" onClick={displayLibrary}>
      {categories.length === 0 ? (
        <div className="d-flex justify-content-center">
          <p>Nothing to show...yet! Create your first libraries.</p>
        </div>
      ) : (
        categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className="image-grid">
              {category.images.map((image) => (
                <div key={image.id} className="library-container">
                  <img src={image.url} alt="Saved" />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserLibrary;
