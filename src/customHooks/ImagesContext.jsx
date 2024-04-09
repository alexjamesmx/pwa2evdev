import React, { createContext, useState, useEffect, useContext } from "react";
import fetchRandomImages from "./fetchRandomImages";
import fetchLibrary from "./fetchLibrary";
import { UserContext } from "./UserContext";
import { collection, doc, getFirestore, getDoc } from "firebase/firestore";

export const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const { images, loading: s_loading } = fetchRandomImages();
  const [storedImages, setStoredImages] = useState([]);
  const { user } = useContext(UserContext);
  const [library, setLibrary] = useState([]);
  const [l_loading, setL_loading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (images.length > 0 && storedImages.length === 0) {
      console.log("Setting stored images...");
      setStoredImages(images);
    }
  }, [images, storedImages]);

  useEffect(() => {
    const fetchAndSetLibrary = async () => {
      if (user) {
        const { library, loading } = await fetchLibrary(user);
        console.log("fetching library...");
        setLibrary(library);
        setL_loading(loading);
      } else {
        setLibrary([]);
        setL_loading(false);
      }
    };

    fetchAndSetLibrary();
  }, [user, refresh]);

  useEffect(() => {
    console.log("library changed:", library);
  }, [library]);

  return (
    <ImagesContext.Provider
      value={{
        setStoredImages,
        storedImages,
        s_loading,
        library,
        setLibrary,
        l_loading,
        setRefresh,
        page,
        setPage,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};
