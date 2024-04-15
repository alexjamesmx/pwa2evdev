import React from "react";
import { PlusCircleFill } from "react-bootstrap-icons";

const LibraryList = ({
  libraries,
  displayLibrary,
  emptyMessage,
  showCreateButton,
  onCreateLibrary,
}) => {
  if (libraries.length === 0) {
    return (
      <div className="mt-10">
        <div className="flex justify-center flex-col items-center">
          <p>{emptyMessage}</p>
          {showCreateButton && (
            <>
              <br />
              <PlusCircleFill
                width={40}
                height={40}
                className="text-red-900 hover:text-red-700 hover:scale-110 transition-transform duration-300"
                alt="Add new library"
                onClick={onCreateLibrary}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {libraries.map((item) => (
          <div
            className="rounded relative h-44 cursor-pointer"
            key={item.category}
            onClick={displayLibrary(item.category)}
          >
            <h3 className="font-bold">{item.category}</h3>
            {item.images[0]?.url ? (
              <img
                src={item.images[0]?.url}
                width={200}
                height={200}
                alt={`${item.category}`}
                className="rounded object-cover w-full h-full"
              />
            ) : (
              <>Empty category</>
            )}
          </div>
        ))}
      </div>
      {showCreateButton && (
        <PlusCircleFill
          width={40}
          height={40}
          className="text-red-900 hover:text-red-700 hover:scale-110 transition-transform duration-300"
          alt="Add new library"
          onClick={onCreateLibrary}
        />
      )}
    </div>
  );
};

export default LibraryList;
