import React, { useState, useContext, memo, useCallback } from "react";
import ImageDetails from "../imageDetails/ImageDetails";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import "./ListImages.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroller";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  IconButton,
  Typography,
  Card,
} from "@material-tailwind/react";

const ListImages = memo(({ images, fetchMoreImages }) => {
  const { user } = useContext(UserContext);
  const [imageData, setImageData] = useState(null);
  const [srcImage, setSrcImage] = useState(null);
  const [open, setOpen] = React.useState(false);

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
    if (optimizedUrl.includes("?q")) {
      optimizedUrl = optimizedUrl.replace(/(\\?|&)q=[^&]*/, "$1q=80");
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

  const renderImages = useCallback(
    () => (
      <div className="image-grid">
        {images.map((image, index) => (
          <Card
            key={index}
            className="h-64 w-64 cursor-pointer overflow-hidden transition-opacity hover:opacity-90"
            onClick={() =>
              handleOpen(image, optimizeImageUrl(image.urls.regular))
            }
          >
            <LazyLoadImage
              loading="lazy"
              src={optimizeImageUrl(image.urls.regular)}
              alt={image.alt_description || "Image from Unsplash"}
              className="image"
              width={300}
              height={300}
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
        pageStart={0}
        loadMore={fetchMoreImages}
        hasMore={true}
        loader={<div key={0}>Loading...</div>}
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
