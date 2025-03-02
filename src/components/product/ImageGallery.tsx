
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Generate optimized image URLs with size parameters
  const getImageUrl = useCallback((imagePath: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    let width = 800; // Default medium size
    
    if (size === 'small') {
      width = 200; // Thumbnail size
    } else if (size === 'large') {
      width = 1200; // Full size for dialog
    }
    
    // Use Supabase's transform URL parameters to resize the image
    const publicUrl = supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
    // Add a cache-busting parameter to prevent browser caching issues
    return `${publicUrl}?width=${width}&quality=${size === 'small' ? 70 : 80}&t=${encodeURIComponent(imagePath.split('/').pop() || '')}`;
  }, []);

  // Preload the current and adjacent images
  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = [currentImageIndex];
      
      // Add next image
      if (currentImageIndex < images.length - 1) {
        imagesToPreload.push(currentImageIndex + 1);
      }
      
      // Add previous image
      if (currentImageIndex > 0) {
        imagesToPreload.push(currentImageIndex - 1);
      }
      
      // Preload these images
      imagesToPreload.forEach(index => {
        const img = new Image();
        img.src = getImageUrl(images[index]);
      });
    };
    
    preloadImages();
  }, [currentImageIndex, images, getImageUrl]);

  // Initialize imagesLoaded array
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDialogOpen) { // Don't auto-slide when dialog is open
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex, images.length, setCurrentImageIndex, isDialogOpen]);

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

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };

  return (
    <>
      <div 
        className="relative aspect-4/3 rounded-lg overflow-hidden bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={getImageUrl(image)}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
                loading={index === currentImageIndex ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(index)}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 px-1 items-center">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100 ${
              index === currentImageIndex ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={getImageUrl(image, 'small')}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-full h-[80vh] flex items-center justify-center p-0 bg-black/90">
          <img
            src={getImageUrl(images[currentImageIndex], 'large')}
            alt="Product image fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
