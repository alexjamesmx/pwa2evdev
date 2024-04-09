import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import "./Home.css";

const ListImages = lazy(() => import("../../components/ListImages/ListImages"));

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // const accessKey = "73m9zE9ivuue_6Dl-i9sqsRUJGDdTGs9upcq3MNDf4I";
        const accessKey = "bQuu4Cl1wW3kgLiTUKmBkRecQuesC31H0wEp8AjPdHg";
        const count = 5;
        const response = await axios.get(
          `https://api.unsplash.com/photos/random?count=${count}&client_id=${accessKey}`
        );
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="mx-auto max-w-screen-md py-12">
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <ListImages images={images} />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
