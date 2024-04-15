import React, { createContext, useState, useEffect, useContext } from "react";
import useFetchRandomImages from "./useFetchRandomImages";
import fetchLibrary from "./fetchLibrary";
import { UserContext } from "./UserContext";

export const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const { images, loading: s_loading } = useFetchRandomImages();
  const [storedImages, setStoredImages] = useState([]);
  const { user } = useContext(UserContext);
  const [library, setLibrary] = useState([]);
  const [l_loading, setL_loading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (images.length > 0 && storedImages.length === 0) {
      setStoredImages(images);
    }
  }, [images, storedImages]);

  useEffect(() => {
    const fetchAndSetLibrary = async () => {
      if (user) {
        const { library, loading } = await fetchLibrary(user);
        setLibrary(library);
        setL_loading(loading);
      } else {
        setLibrary([]);
        setL_loading(false);
      }
    };

    fetchAndSetLibrary();
  }, [user, refresh]);

  useEffect(() => {}, [library]);

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
