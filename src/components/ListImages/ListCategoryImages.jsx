import React, { useState, useContext } from "react";
import ImageDetails from "../imageDetails/ImageDetails";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import { Card } from "@material-tailwind/react";
import { optimizeImageUrl } from "../../utils";

const ListCategoryImages = ({ images }) => {
  const { user } = useContext(UserContext);
  const [srcImage, setSrcImage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    setSelectedImage(image);
    setOpen((cur) => !cur);
  };

  const renderImages = () =>
    images.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center my-16">
        {images.map((image, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-opacity hover:opacity-90"
            style={{ height: 300, width: 200 }}
            onClick={() =>
              handleOpen(image, optimizeImageUrl(image.urls.thumb))
            }
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
    ) : (
      <div className="grid place-items-center  h-[calc(100%-48px)]">
        <p>This libray is empty. Try adding new images! 🔥</p>
      </div>
    );

  return (
    <>
      <ImageDetails
        handleOpen={handleOpen}
        open={open}
        image={selectedImage}
        srcImage={srcImage}
      />
      {renderImages()}
    </>
  );
};

export default ListCategoryImages;
