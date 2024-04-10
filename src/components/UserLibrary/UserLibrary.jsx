import React, { useContext, useMemo, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesContext } from "../../customHooks/ImagesContext";
import { PlusCircleFill } from "react-bootstrap-icons";

const UserLibrary = memo(
  ({ showCategory, openDrawerBottom, refreshLibrary }) => {
    const { library, l_loading } = useContext(ImagesContext);
    const [librariesNames, setLibrariesNames] = useState([]);
    const [librariesData, setLibrariesData] = useState([]);

    const [savedLibary, setSavedLibrary] = useState([]);

    const navigate = useNavigate();

    if (!library) {
      return <div>Loading...</div>;
    }

    const displayLibrary = useMemo(
      () => () => navigate(`/library?category=${showCategory}`),
      [navigate, showCategory]
    );

    const getLibrariesNames = () => {
      let names = Object.keys(library);
      names = names.filter((name) => name !== "saved");
      setLibrariesNames(names);
    };

    const getLibrariesData = () => {
      const filteredData = library.filter((obj) => obj.category !== "saved");
      setLibrariesData(filteredData);
    };

    const getSavedLibrary = () => {
      const filteredData = library.filter((obj) => obj.category === "saved");
      setSavedLibrary(filteredData);
    };

    const findCategory = (category) => {
      const data = library.find((item) => item.category === category);

      if (data) {
        setCategoryData(data);
      }
    };

    useEffect(() => {
      findCategory();
      getSavedLibrary();
      getLibrariesNames();
      getLibrariesData();
    }, [library]);

    const createLibrary = () => {
      openDrawerBottom();
    };

    const renderLibrary = () => {
      if (!l_loading) {
        <div className="mt-10" onClick={displayLibrary}>
          <div className="flex justify-center">
            <p>Loading library</p>
          </div>
        </div>;
      }

      if (showCategory === "saved" && savedLibary.length === 0) {
        return (
          <div className="mt-10">
            <div className="flex justify-center flex-col items-center">
              <p>No saved Images</p>
            </div>
          </div>
        );
      }
      if (showCategory === "library" && librariesNames.length === 0) {
        return (
          <div className="mt-10">
            <div className="flex justify-center flex-col items-center">
              <p>No libraries created yet"</p>
              <br />
              {showCategory === "library" ? (
                <>
                  <PlusCircleFill
                    width={40}
                    height={40}
                    className="text-red-900 hover:text-red-700 hover:scale-110 transition-transform duration-300"
                    alt="Add new library"
                    onClick={() => createLibrary()}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }

      const renderLibrary = (data) => {
        return (
          <div className="flex flex-col items-center">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="rounded relative h-44 cursor-pointer"
                  onClick={displayLibrary}
                >
                  <h3 className="font-bold">{item.category}</h3>
                  {item.images[0]?.url ? (
                    <img
                      src={item.images[0]?.url ? item.images[0].url : ""}
                      alt={item.description}
                      width={200}
                      height={200}
                    />
                  ) : (
                    <>Empty category</>
                  )}
                </div>
              ))}
            </div>
            <PlusCircleFill
              width={40}
              height={40}
              className="text-red-900 hover:text-red-700 hover:scale-110 transition-transform duration-300"
              alt="Add new library"
              onClick={() => createLibrary()}
            />
          </div>
        );
      };
      return (
        <>
          {showCategory === "saved"
            ? renderLibrary(savedLibary)
            : renderLibrary(librariesData)}
        </>
      );
    };

    return <>{renderLibrary()}</>;
  }
);

export default UserLibrary;
