import React, { lazy, Suspense, useContext } from "react";
import { ImagesContext } from "../../customHooks/ImagesContext";

const ListImages = lazy(() => import("../../components/ListImages/ListImages"));

const Home = () => {
  const { storedImages, s_loading, setStoredImages, page, setPage } =
    useContext(ImagesContext);

  return (
    <div className="container mx-auto py-8">
      {s_loading ? (
        <p>Loading images...</p>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <ListImages
            images={storedImages}
            setImages={setStoredImages}
            page={page}
            setPage={setPage}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
