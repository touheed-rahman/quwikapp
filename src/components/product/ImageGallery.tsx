
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Share } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageGallery = ({ images, currentImageIndex, setCurrentImageIndex }: ImageGalleryProps) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (images && images.length > 0) {
      try {
        const mainUrl = supabase.storage.from('listings').getPublicUrl(images[currentImageIndex]).data.publicUrl;
        setMainImage(mainUrl);

        const thumbUrls = images.map(img => {
          try {
            return supabase.storage.from('listings').getPublicUrl(img).data.publicUrl;
          } catch (error) {
            console.error('Error getting public URL:', error);
            return "/placeholder.svg";
          }
        });
        setThumbnails(thumbUrls);
      } catch (error) {
        console.error('Error processing images:', error);
        setMainImage("/placeholder.svg");
      }
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

  const goToNextImage = () => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);
    }
  };

  const goToPrevImage = () => {
    if (images.length > 1) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(prevIndex);
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
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-white">
        {/* Main image */}
        <div className="aspect-square w-full relative">
          <img
            src={mainImage || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          
          {/* Share button */}
          <Button 
            onClick={handleShare}
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
          >
            <Share className="h-5 w-5" />
          </Button>

          {/* Navigation arrows - show on both mobile and desktop */}
          {images.length > 1 && (
            <>
              <Button
                onClick={goToPrevImage}
                size="icon"
                variant="secondary"
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={goToNextImage}
                size="icon"
                variant="secondary"
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
          
          {/* Image indicator for mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex === index ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails - only show on desktop when multiple images */}
      {images.length > 1 && (
        <div className="hidden md:flex overflow-x-auto gap-2 pb-2 no-scrollbar justify-center">
          {thumbnails.map((thumb, index) => (
            <motion.button
              key={index}
              className={`relative rounded-md overflow-hidden flex-shrink-0 border-2 ${
                currentImageIndex === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-20 h-20">
                <img
                  src={thumb || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
