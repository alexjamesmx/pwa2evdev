import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const fetchRandomImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async (page = 1) => {
    try {
      const total = 15;
      const response = await axios.get(
        // `https://api.unsplash.com/photos/random?count=${count}&client_id=${process.env.ACCESS_KEY}`
        `https://api.unsplash.com/photos?page=${page}&per_page=${total}&client_id=${process.env.ACCESS_KEY}`
      );
      setImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      fetchImages();
    }
  }, [fetchImages, images]);

  return { images, loading };
};

export default fetchRandomImages;
