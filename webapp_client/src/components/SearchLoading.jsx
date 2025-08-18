import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SearchLoading = () => {
  const rows = 3;
  const columns = 3;

  return (
    <div className="loading-wrapper">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height={200}
              width={100}
              borderRadius={8}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SearchLoading;
