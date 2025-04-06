
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imagePreview: string;
  onClear: () => void;
}

const ImagePreview = ({ imagePreview, onClear }: ImagePreviewProps) => {
  return (
    <div className="mb-3 relative inline-block">
      <img 
        src={imagePreview} 
        alt="Preview" 
        className="h-20 rounded-md object-cover border border-primary/20"
      />
      <Button 
        onClick={onClear}
        variant="secondary"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 bg-white rounded-full shadow-md"
      >
        <X className="h-3 w-3 text-gray-600" />
      </Button>
    </div>
  );
};

export default ImagePreview;
