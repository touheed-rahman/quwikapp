
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const getImageUrl = useCallback((imagePath: string) => {
    return supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDialogOpen) {
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex, images.length, setCurrentImageIndex, isDialogOpen]);

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

  const nextImage = () => {
    setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
  };

  const previousImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-lg overflow-hidden bg-black/5 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getImageUrl(images[currentImageIndex])}
          alt="Product image"
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
          loading="eager"
        />
        
        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            previousImage();
          }}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>

        {/* Dots navigation */}
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

      {/* Fullscreen dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] flex items-center justify-center">
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt="Product image fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
