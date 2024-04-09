import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import "./Home.css";
import ListImages from "../../components/ListImages/ListImages";
const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // const accessKey = "73m9zE9ivuue_6Dl-i9sqsRUJGDdTGs9upcq3MNDf4I";
        const count = 5;
        const response = await axios.get(
          `https://api.unsplash.com/photos/random?count=${count}&client_id=${process.env.ACCESS_KEY}`
        );
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  console.log(process.env.ACCESS_KEY);

  return (
    <>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <ListImages images={images} />
        </Suspense>
      )}
    </>
  );
};

export default Home;
