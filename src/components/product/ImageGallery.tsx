
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const getImageUrl = (imagePath: string) => {
    return supabase.storage.from('listings').getPublicUrl(imagePath).data.publicUrl;
  };

  const nextImage = () => {
    setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };

  return (
    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/5">
      <img
        src={getImageUrl(images[currentImageIndex])}
        alt="Product image"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevImage}
          className="bg-white/80 hover:bg-white/90"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextImage}
          className="bg-white/80 hover:bg-white/90"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
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
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
