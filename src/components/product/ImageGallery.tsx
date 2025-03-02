
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const getImageUrl = useCallback((imagePath: string, width = 800, height = 600) => {
    // Get optimized image URLs with consistent dimensions
    const options = {
      width,
      height,
      resize: 'contain' as const, // Using const assertion for TypeScript
      quality: isMobile ? 75 : 85 // Lower quality on mobile for faster loading
    };
    
    const url = supabase.storage.from('listings').getPublicUrl(imagePath, {
      transform: options,
    }).data.publicUrl;
    
    return url;
  }, [isMobile]);

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

  return (
    <>
      <div 
        className="relative rounded-lg overflow-hidden bg-black/5 w-full"
        style={{ 
          aspectRatio: isMobile ? '4/3' : '16/9',
          maxHeight: isMobile ? '300px' : '500px'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getImageUrl(images[currentImageIndex], 
            isMobile ? 400 : 800, 
            isMobile ? 300 : 450)}
          alt="Product image"
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
          loading="eager"
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
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 px-1">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
              index === currentImageIndex ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={getImageUrl(image, 100, 100)}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] h-[80vh] flex items-center justify-center p-2 sm:p-4">
          <img
            src={getImageUrl(images[currentImageIndex], 
              isMobile ? 600 : 1200, 
              isMobile ? 800 : 1000)}
            alt="Product image fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
