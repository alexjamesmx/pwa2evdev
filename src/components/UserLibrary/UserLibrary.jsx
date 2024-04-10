import React, { useContext, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesContext } from "../../customHooks/ImagesContext";

const UserLibrary = memo(({ showCategory }) => {
  const { library, l_loading } = useContext(ImagesContext);
  const navigate = useNavigate();

  const displayLibrary = useMemo(
    () => () => navigate(`/library?category=${showCategory}`),
    [navigate, showCategory]
  );

  const renderLibrary = () => {
    if (!l_loading) {
      return <p>Loading library ...</p>;
    }

    if (!library || library.length === 0) {
      return <p>Your library is empty.</p>;
    }

    const categoryData = library.find((item) => item.category === showCategory);

    if (!categoryData || categoryData.images.length === 0) {
      return (
        <div className="library-preview-card" onClick={displayLibrary}>
          <div className="d-flex justify-content-center">
            <p>Nothing to show...yet! Create your first libraries.</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex justify-center flex-wrap flex-row"
        onClick={displayLibrary}
      >
        <div className="pointer w-64 rounded shadow-sm">
          <div className="image-grid">
            {categoryData.images.slice(0, 1).map((image) => (
              <div key={image.id} className="rounded relative h-44">
                <img
                  src={image.url}
                  alt={image.description}
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return <>{renderLibrary()}</>;
});

export default UserLibrary;
