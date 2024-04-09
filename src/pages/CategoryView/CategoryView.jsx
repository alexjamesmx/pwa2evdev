import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import ListImages from "../../components/ListImages/ListImages";
import "./CategoryView.css";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { UserContext } from "../../customHooks/UserContext";
import axios from "axios";
import { ArrowLeftSquareFill } from "react-bootstrap-icons";

const CategoryView = memo(({ categorySelected }) => {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState([]);
  const handleIsFavorite = async () => {
    try {
      const db = getFirestore();
      const userId = user.uid;
      const imagesRef = doc(collection(db, "images"), userId);
      const docSnapshot = await getDoc(imagesRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const savedData = data.saved || [];
        const isImageSaved = savedData.some((item) => item.id === imageData.id);

        if (isImageSaved) {
          console.log("Removing from favorites... ", isImageSaved);
          // Remove image from favorites
          await updateDoc(imagesRef, {
            saved: arrayRemove({ id: imageData.id, url: srcImage }),
          });
        } else {
          console.log("Adding from favorites... ", isImageSaved);
          // Add image to favorites
          await updateDoc(imagesRef, {
            saved: arrayUnion({ id: imageData.id, url: srcImage }),
          });
        }

        setIsFavorite((cur) => !cur);
      } else {
        // Create a new document for the user with the image as the initial favorite
        await setDoc(imagesRef, {
          saved: [{ id: imageData.id, url: srcImage }],
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  const fetchImages = useCallback(async () => {
    const urls = await Promise.all(
      images.map(async (image) => {
        const response = await axios.get(
          // `https://api.unsplash.com/photos/${image.id}?client_id=bQuu4Cl1wW3kgLiTUKmBkRecQuesC31H0wEp8AjPdHg`
          `https://api.unsplash.com/photos/${image.id}&client_id=${process.env.ACCES_KEY}`
        );
        return response.data;
      })
    );
    setImageData(urls);
  }, [images]);

  useEffect(() => {
    getFavorites();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  console.log(process.env.ACCES_KEY);
  return (
    <>
      <div className="ms-2 d-flex">
        <ArrowLeftSquareFill
          className="back-button pointer"
          onClick={() => window.history.back()}
          width={40}
          height={40}
        />
        <h3 className="uppercase">{categorySelected}</h3>
      </div>

      <div className="image-container">
        <ListImages images={imageData} />
      </div>
    </>
  );
});

export default CategoryView;
