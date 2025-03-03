
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

  const getImageUrl = useCallback((imagePath: string) => {
    return supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
  }, []);

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
        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/5"
        style={{ 
          maxHeight: isMobile ? '300px' : '500px',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt="Product image"
            className="object-contain w-full h-full max-h-[300px] md:max-h-[500px]"
            onClick={() => setIsDialogOpen(true)}
            loading="eager"
          />
        </div>
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
              src={getImageUrl(image)}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-full h-[80vh] md:h-auto p-1 md:p-6 flex items-center justify-center">
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt="Product image fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
