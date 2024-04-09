import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { UserContext } from "../../customHooks/UserContext";
import { ImagesContext } from "../../customHooks/ImagesContext";
import { LazyLoadComponent } from "react-lazy-load-image-component";
const ImageDetails = memo(({ handleOpen, open, srcImage, imageData }) => {
  const { user } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const { setRefresh } = useContext(ImagesContext);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const db = getFirestore();
        const userId = user?.uid;
        if (!userId) return;
        const imagesRef = doc(collection(db, "images"), userId);
        const docSnapshot = await getDoc(imagesRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const savedData = data.saved || [];
          const isImageSaved = savedData.some(
            (item) => item.id === imageData?.id
          );

          console.log("isFavorite? ", isImageSaved);

          setIsFavorite(isImageSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    if (user && imageData) {
      checkSavedStatus();
    }
  }, [user, imageData]);

  const toggleSave = useCallback(async () => {
    try {
      if (!user || !imageData || !srcImage) return;
      const db = getFirestore();
      const userId = user.uid;
      const imagesRef = doc(collection(db, "images"), userId);
      const updateImage = { url: srcImage, id: imageData.id };

      const docSnapshot = await getDoc(imagesRef);
      const savedData = docSnapshot.exists()
        ? docSnapshot.data().saved || []
        : [];

      const isImageSaved = savedData.some((item) => item.id === updateImage.id);

      if (isImageSaved) {
        await updateDoc(imagesRef, { saved: arrayRemove(updateImage) });
        setIsFavorite(false);
      } else {
        await updateDoc(imagesRef, { saved: arrayUnion(updateImage) });
        setIsFavorite(true);
      }
      // Update library after save toggle
      setRefresh((e) => !e);

      setLibrary(updatedLibrary);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  }, [user, imageData, srcImage, isFavorite]);

  if (!imageData) {
    return <></>;
  }

  return (
    <>
      <Dialog size="xl" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              size="sm"
              variant="circular"
              alt={imageData?.user}
              src={imageData?.user?.profile_image.small}
            />
            <div className="-mt-px flex flex-col">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
                {imageData?.user?.first_name}
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="text-xs font-normal"
              >
                {imageData?.user?.username}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              size="sm"
              color={isFavorite ? "red" : "blue-gray"}
              onClick={toggleSave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </IconButton>
            <Button color="gray" size="sm">
              Free Download
            </Button>
          </div>
        </DialogHeader>
        <DialogBody>
          <img
            alt={imageData.alt_description}
            className="h-[48rem] w-full rounded-lg object-cover object-center"
            src={srcImage}
          />
        </DialogBody>
        <DialogFooter className="justify-between">
          <div className="flex items-center gap-16">
            <div>
              <Typography variant="small" color="gray" className="font-normal">
                Views
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                {imageData.views}
              </Typography>
            </div>
            <div>
              <Typography variant="small" color="gray" className="font-normal">
                Likes
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                {imageData.likes}
              </Typography>
            </div>
          </div>
          <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="mr-5 flex items-center"
          >
            Share
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
});

export default ImageDetails;
