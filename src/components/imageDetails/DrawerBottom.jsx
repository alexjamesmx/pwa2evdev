import React, { useContext, useState } from "react";

import { Drawer, IconButton, Button, Input } from "@material-tailwind/react";

import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import { ImagesContext } from "../../customHooks/ImagesContext";

export const DrawerBottom = ({ openBottom, closeDrawerBottom }) => {
  const { user } = useContext(UserContext);
  const { setRefresh: setRefreshLibrary } = useContext(ImagesContext);
  const [newLibrary, setNewLibrary] = useState(null);

  const postLibrary = async () => {
    console.log("Creating library");

    if (!newLibrary || newLibrary === "")
      toast.error("Library name is required");

    try {
      const db = getFirestore();
      const userId = user.uid;
      const imagesRef = doc(collection(db, "images"), userId);
      const docSnapshot = await getDoc(imagesRef);

      if (docSnapshot.exists()) {
        if (docSnapshot.data()[newLibrary]) {
          toast.error(
            capitalizeFirstLetter(newLibrary) + " library already exists"
          );
        } else {
          await updateDoc(imagesRef, {
            [newLibrary]: [],
          });
          toast.success("Library created successfully");
          setRefreshLibrary((prev) => !prev);
        }
      } else {
        await setDoc(imagesRef, { [newLibrary]: [] });
        toast.success("Library created successfully");
        setRefreshLibrary((prev) => !prev);
      }
      closeDrawerBottom();
    } catch (error) {
      console.error("Error creating library:", error);
    }
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Drawer
      placement="bottom"
      open={openBottom}
      onClose={closeDrawerBottom}
      className="p-4"
    >
      <div className="mb-6 flex items-center justify-center">
        <p>Give a name to your library</p>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={closeDrawerBottom}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="w-1/2 flex gap-2">
          <Input
            label="library"
            onChange={(e) => setNewLibrary(e.target.value)}
          />
          <Button size="sm" onClick={() => postLibrary()}>
            Crear
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
