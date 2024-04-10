import React, { useContext, useMemo, memo } from "react";
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

  if (!library) {
    return <div>Error loading library</div>;
  }

  const savedLibrary = library.filter((item) => item.category === "saved");
  const otherLibraries = library.filter((item) => item.category !== "saved");

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
