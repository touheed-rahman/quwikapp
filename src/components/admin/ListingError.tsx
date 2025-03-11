
import React from "react";

interface ListingErrorProps {
  message?: string;
}

const ListingError = ({ message = "Error loading listings. Please try again later." }: ListingErrorProps) => {
  return (
    <div className="text-red-500 p-4">
      {message}
    </div>
  );
};

export default ListingError;
