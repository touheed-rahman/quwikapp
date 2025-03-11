
import { useState } from "react";

interface MainImageProps {
  mainImage: string;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

const MainImage = ({ mainImage, handleTouchStart, handleTouchEnd }: MainImageProps) => {
  return (
    <div 
      className="aspect-square w-full relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={mainImage || "/placeholder.svg"}
        alt="Product"
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
  );
};

export default MainImage;
