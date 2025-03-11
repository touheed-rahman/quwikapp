
import React from "react";

interface ListingErrorProps {
  message?: string;
}

const ListingError = ({ message = "Error loading listings. Please try again later." }: ListingErrorProps) => {
  return (
    <div className="text-destructive bg-destructive/10 p-6 rounded-lg border border-destructive/20 my-4">
      {message}
    </div>
  );
};

export default ListingError;
