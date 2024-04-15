import React, { useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesContext } from "../../customHooks/ImagesContext";
import LibraryList from "./LibraryList";
import { Loading } from "../Loading";

const UserLibrary = memo(({ showCategory, openDrawerBottom }) => {
  const { library, isLoading } = useContext(ImagesContext);
  const navigate = useNavigate();

  const displayLibrary = (category) => () => {
    navigate(`/library?category=${category}`);
  };

  const handleCreateLibrary = () => {
    openDrawerBottom();
  };

  if (isLoading) {
    return <Loading />;
  }

  const savedLibrary =
    Object.keys(library).length > 0
      ? library.filter((item) => item.category === "saved")
      : [];
  const otherLibraries =
    Object.keys(library).length > 0
      ? library.filter((item) => item.category !== "saved")
      : [];

  return (
    <>
      {showCategory === "saved" ? (
        <LibraryList
          libraries={savedLibrary}
          displayLibrary={displayLibrary}
          emptyMessage="No saved images"
        />
      ) : (
        <LibraryList
          libraries={otherLibraries}
          displayLibrary={displayLibrary}
          emptyMessage="No libraries created yet"
          showCreateButton
          onCreateLibrary={handleCreateLibrary}
        />
      )}
    </>
  );
});

export default UserLibrary;
