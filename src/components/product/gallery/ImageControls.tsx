
import { Share, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageControlsProps {
  hasMultipleImages: boolean;
  handleShare: () => void;
  goToPrevImage: () => void;
  goToNextImage: () => void;
}

const ImageControls = ({ 
  hasMultipleImages, 
  handleShare, 
  goToPrevImage, 
  goToNextImage 
}: ImageControlsProps) => {
  return (
    <>
      {/* Share button */}
      <Button 
        onClick={handleShare}
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 z-10 bg-background backdrop-blur-sm rounded-full shadow-md hover:bg-background/80"
      >
        <Share className="h-5 w-5 text-background" />
      </Button>

      {/* Navigation arrows */}
      {hasMultipleImages && (
        <>
          <Button
            onClick={goToPrevImage}
            size="icon"
            variant="secondary"
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-background backdrop-blur-sm rounded-full shadow-md hidden md:flex hover:bg-background/80"
          >
            <ChevronLeft className="h-5 w-5 text-background" />
          </Button>
          
          <Button
            onClick={goToNextImage}
            size="icon"
            variant="secondary"
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-background backdrop-blur-sm rounded-full shadow-md hidden md:flex hover:bg-background/80"
          >
            <ChevronRight className="h-5 w-5 text-background" />
          </Button>
        </>
      )}
    </>
  );
};

export default ImageControls;
