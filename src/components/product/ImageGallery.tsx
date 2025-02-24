
import { useEffect, useState, useCallback, useRef } from "react";
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
  const imageCache = useRef<Map<string, string>>(new Map());

  const getImageUrl = useCallback((imagePath: string) => {
    if (imageCache.current.has(imagePath)) {
      return imageCache.current.get(imagePath);
    }
    const url = supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
    imageCache.current.set(imagePath, url);
    return url;
  }, []);

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
      
      [nextIndex, prevIndex].forEach(index => {
        const img = new Image();
        img.src = getImageUrl(images[index]);
      });
    };
    preloadImages();
  }, [currentImageIndex, images, getImageUrl]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
      } else {
        setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
      }
    }
    setTouchStart(null);
  };

  return (
    <>
      <div 
        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getImageUrl(images[currentImageIndex])}
          alt="Product"
          className="w-full h-full object-contain cursor-pointer transition-transform duration-200"
          onClick={() => setIsDialogOpen(true)}
          loading="eager"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 px-1 snap-x">
        {images.map((image, index) => (
          <button
            key={index}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden snap-center ${
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-full h-[80vh] flex items-center justify-center p-0">
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt="Product fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
