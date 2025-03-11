
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MainImage from "./gallery/MainImage";
import ImageControls from "./gallery/ImageControls";
import ImageThumbnails from "./gallery/ImageThumbnails";
import ImageIndicators from "./gallery/ImageIndicators";

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageGallery = ({ images, currentImageIndex, setCurrentImageIndex }: ImageGalleryProps) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (images && images.length > 0) {
      const mainUrl = supabase.storage.from('listings').getPublicUrl(images[currentImageIndex]).data.publicUrl;
      setMainImage(mainUrl);

      const thumbUrls = images.map(img => 
        supabase.storage.from('listings').getPublicUrl(img).data.publicUrl
      );
      setThumbnails(thumbUrls);
    }
  }, [images, currentImageIndex]);

  const handleShare = async () => {
    if (images && images.length > 0) {
      try {
        // Check if Web Share API is available
        if (navigator.share) {
          await navigator.share({
            title: 'Check out this listing',
            text: 'I found this great item on Quwik!',
            url: window.location.href,
          });
        } else {
          // Fallback to copying URL
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied!",
            description: "Share link copied to clipboard",
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          title: "Error sharing",
          description: "Could not share this listing",
          variant: "destructive"
        });
      }
    }
  };

  // Touch handling for swipe
  let touchStartX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // If swipe distance is significant
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right - go to previous image
        goToPrevImage();
      } else {
        // Swipe left - go to next image
        goToNextImage();
      }
    }
  };

  const goToNextImage = () => {
    if (images.length > 1) {
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
    }
  };

  const goToPrevImage = () => {
    if (images.length > 1) {
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="relative rounded-lg overflow-hidden bg-white">
        {/* Main image */}
        <MainImage 
          mainImage={mainImage}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
        />
        
        {/* Controls (Share button and navigation arrows) */}
        <ImageControls 
          hasMultipleImages={images.length > 1}
          handleShare={handleShare}
          goToPrevImage={goToPrevImage}
          goToNextImage={goToNextImage}
        />
        
        {/* Mobile image indicators */}
        <ImageIndicators 
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      </div>

      {/* Thumbnails - only show when multiple images and on desktop */}
      {!isMobile && images.length > 1 && (
        <ImageThumbnails 
          thumbnails={thumbnails}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}
    </div>
  );
};

export default ImageGallery;
