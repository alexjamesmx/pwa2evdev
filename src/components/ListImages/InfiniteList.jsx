import React, { useState, useContext, useEffect, useMemo } from "react";
import ImageDetails from "../imageDetails/ImageDetails";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "@material-tailwind/react";
import axios from "axios";
import { Loading } from "../Loading";
import { optimizeImageUrl } from "../../utils";
const InfiniteList = () => {
  const { user } = useContext(UserContext);
  const [imageData, setImageData] = useState(null);
  const [srcImage, setSrcImage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [nextImages, setNextImages] = useState([]);

  const fetchImages = async (page = 1) => {
    try {
      const total = 20;
      const response = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&per_page=${total}&client_id=${process.env.ACCESS_KEY}`
      );
      setData(response.data);
      setPage(page + 1);
      return response.data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const getImages = () => {
    if (!data) return;
    const response = [...data.map((image) => image)];
    setNextImages(response);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useMemo(() => {
    getImages();
  }, [data]);

  const handleUnregisteredUsers = () => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return false;
    }
    return true;
  };

  const handleOpen = async (image, url) => {
    if (!handleUnregisteredUsers()) return;
    setSrcImage(url);
    setImageData(image);
    setOpen((cur) => !cur);
  };

  const fetchMoreImages = async () => {
    const newImages = await fetchImages(page);
    const response = [...data, ...newImages];
    setData(response);
  };

  if (!nextImages || nextImages.length === 0) {
    return <Loading />;
  }

  const renderImages = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
      {nextImages.map((image, index) => (
        <Card
          key={index}
          className="cursor-pointer transition-opacity hover:opacity-90"
          style={{ height: 300, width: 200 }}
          onClick={() => handleOpen(image, optimizeImageUrl(image.urls.thumb))}
        >
          <img
            rel="preload"
            srcSet={optimizeImageUrl(image.urls.thumb)}
            src={optimizeImageUrl(image.urls.thumb)}
            alt={image.alt_description || "Image from Unsplash"}
            className="object-fill transform hover:scale-105 transition-transform duration-300 "
            height={300}
            width={200}
          />
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <ImageDetails
        handleOpen={handleOpen}
        open={open}
        image={imageData}
        srcImage={srcImage}
      />
      <InfiniteScroll
        dataLength={nextImages ? nextImages.length : 0}
        next={() => {
          fetchMoreImages();
        }}
        hasMore={true}
        loader={<Loading />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {renderImages()}
      </InfiniteScroll>
    </>
  );
};

export default InfiniteList;
