import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import ListImages from "../../components/ListImages/ListImages";
import axios from "axios";
import { ArrowLeftSquareFill } from "react-bootstrap-icons";
import { ImagesContext } from "../../customHooks/ImagesContext";

const CategoryView = memo(({ categorySelected }) => {
  const { library } = useContext(ImagesContext);
  const [imageData, setImageData] = useState([]);

  const getCategoryData = useCallback(
    (category) => {
      const categoryData = library.find((item) => item.category === category);
      if (!categoryData || categoryData.images.length === 0) {
        return null;
      }
      return categoryData;
    },
    [library]
  );

  const fetchImages = useCallback(async () => {
    console.log("fetching images category data ...");
    const data = getCategoryData(categorySelected);
    if (!data) {
      setImageData([]);
      return;
    }

    const response = await Promise.all(
      data.images.map(async (image) => {
        const res = await axios.get(
          `https://api.unsplash.com/photos/${image.id}?client_id=${process.env.ACCESS_KEY}`
        );
        return res.data;
      })
    );

    console.log("response", response);
    setImageData(response);
  }, [categorySelected, getCategoryData]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, categorySelected, library]);

  if (!imageData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="ms-2 flex mb-5">
          <ArrowLeftSquareFill
            className="back-button pointer"
            onClick={() => window.history.back()}
            width={40}
            height={40}
          />
          <h3 className="uppercase ms-6 self-center">{categorySelected}</h3>
        </div>

        <ListImages images={imageData} />
      </div>
    </>
  );
});

export default CategoryView;
