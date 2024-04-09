import React, {
  useState,
  useContext,
  memo,
  useCallback,
  useEffect,
} from "react";
import ImageDetails from "../imageDetails/ImageDetails";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroller";
import { Card } from "@material-tailwind/react";
import axios from "axios";

const ListImages = memo(({ images }) => {
  const { user } = useContext(UserContext);
  const [imageData, setImageData] = useState(null);
  const [srcImage, setSrcImage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [nextImages, setNextImages] = useState(images);
  const [page, setPage] = useState(1);

  const handleUnregisteredUsers = () => {
    if (!user) {
      toast.error("You must sign in to view image details.");
      return false;
    }
    return true;
  };

  const optimizeImageUrl = useCallback((url) => {
    let optimizedUrl = url;
    // Function to replace the 'q' parameter with 'q=80'
    if (optimizedUrl.includes("&fit")) {
      optimizedUrl = optimizedUrl.replace(/(\\?|&)fit=[^&]*/, "&fit=crop");
    } else {
      optimizedUrl = optimizedUrl + "&fit=crop";
    }

    if (optimizedUrl.includes("?q")) {
      optimizedUrl = optimizedUrl.replace(/(\\?|&)q=[^&]*/, "$1q=80");
    }
    if (optimizedUrl.includes("&h")) {
      optimizedUrl = optimizedUrl.replace(/(\\?|&)q=[^&]*/, "&1h=320");
    } else {
      //add h=80 to the url
      optimizedUrl = optimizedUrl + "&h=320";
    }

    // Function to replace the 'fm' parameter with 'fm=webp'
    optimizedUrl = optimizedUrl.replace(/(\\?|&)fm=[^&]*/, "$1fm=webp");
    return optimizedUrl;
  }, []);

  const handleOpen = async (image, url) => {
    if (!handleUnregisteredUsers()) return;
    setSrcImage(url);
    setImageData(image);
    setOpen((cur) => !cur);
  };
  const fetchImages = async (page = 1) => {
    try {
      const total = 15;
      const response = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&per_page=${total}&client_id=${process.env.ACCESS_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchMoreImages = useCallback(async () => {
    console.log("fetching more images...");
    setLoading(true);
    const newImages = await fetchImages(page);
    setNextImages((prevImages) => [...prevImages, ...newImages]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    console.log("useeffect");
    const fetchInitialImages = async () => {
      await fetchMoreImages();
    };
    fetchInitialImages();
  }, []);

  const renderImages = useCallback(
    () => (
      //auto-format
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {nextImages.map((image, index) => (
          <Card
            key={index}
            className="cursor-pointer overflow-hidden transition-opacity hover:opacity-90"
            style={{ height: 320 }}
            onClick={() =>
              handleOpen(image, optimizeImageUrl(image.urls.thumb))
            }
          >
            <LazyLoadImage
              rel="preload"
              srcSet={optimizeImageUrl(image.urls.thumb)}
              src={optimizeImageUrl(image.urls.thumb)}
              alt={image.alt_description || "Image from Unsplash"}
              className="object-fill transform hover:scale-105 transition-transform duration-300 "
              height={320}
              width={300}
            />
          </Card>
        ))}
      </div>
    ),
    [images, optimizeImageUrl]
  );

  return (
    <>
      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={True}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more data to load.</p>}
      >
        {renderImages()}
      </InfiniteScroll>
      <ImageDetails
        handleOpen={handleOpen}
        open={open}
        imageData={imageData}
        srcImage={srcImage}
      />
    </>
  );
});

export default ListImages;
