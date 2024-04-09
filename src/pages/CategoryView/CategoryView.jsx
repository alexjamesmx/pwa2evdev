import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import ListImages from "../../components/ListImages/ListImages";
import "./CategoryView.css";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { UserContext } from "../../customHooks/UserContext";
import axios from "axios";
import { ArrowLeftSquareFill } from "react-bootstrap-icons";

const CategoryView = memo(({ categorySelected }) => {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState([]);

  const getFavorites = useCallback(async () => {
    try {
      const db = getFirestore();
      const userId = user.uid;
      const imagesRef = doc(collection(db, "images"), userId);
      const docSnapshot = await getDoc(imagesRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const selectedCategoryData = userData[categorySelected] || [];
        setImages(selectedCategoryData);
      }
    } catch (error) {
      console.error("Error checking saved status", error);
    }
  }, [user, categorySelected]);

  const fetchImages = useCallback(async () => {
    const urls = await Promise.all(
      images.map(async (image) => {
        const response = await axios.get(
          `https://api.unsplash.com/photos/${image.id}?client_id=bQuu4Cl1wW3kgLiTUKmBkRecQuesC31H0wEp8AjPdHg`
          // `https://api.unsplash.com/photos/${image.id}?client_id=73m9zE9ivuue_6Dl-i9sqsRUJGDdTGs9upcq3MNDf4I`
        );
        return response.data;
      })
    );
    setImageData(urls);
  }, [images]);

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
