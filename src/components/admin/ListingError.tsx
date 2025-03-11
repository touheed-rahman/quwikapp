
import React from "react";

interface ListingErrorProps {
  message?: string;
}

const ListingError = ({ message = "Error loading listings. Please try again later." }: ListingErrorProps) => {
  return (
    <div className="text-destructive p-4 border border-destructive/30 bg-destructive/5 rounded-lg my-4">
      {message}
    </div>
  );
};

export default ListingError;
