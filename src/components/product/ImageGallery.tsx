
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageGallery = ({ 
  images, 
  currentImageIndex, 
  setCurrentImageIndex 
}: ImageGalleryProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const getImageUrl = (imagePath: string) => {
    return supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex, images.length, setCurrentImageIndex]);

  // Touch slide handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
      } else {
        // Swipe right
        setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
      }
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/5"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={getImageUrl(images[currentImageIndex])}
        alt="Product image"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
