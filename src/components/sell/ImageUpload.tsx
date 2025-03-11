
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, X, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ images, setImages, maxImages = 12 }: ImageUploadProps) => {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate previews when images change
    const newPreviews = images.map(image => URL.createObjectURL(image));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [images]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    let errorShown = false;
    
    Array.from(files).forEach(file => {
      // Check if it's an image
      if (!file.type.match('image.*')) {
        if (!errorShown) {
          toast({
            title: "Invalid file type",
            description: "Only image files are allowed",
            variant: "destructive"
          });
          errorShown = true;
        }
        return;
      }
      
      // Check if we already have max images
      if (images.length + validFiles.length >= maxImages) {
        if (!errorShown) {
          toast({
            title: "Too many images",
            description: `Maximum ${maxImages} images allowed`,
            variant: "destructive"
          });
          errorShown = true;
        }
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
          dragActive ? "border-secondary bg-secondary/5" : "border-primary/30 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <UploadCloud 
          className={`w-10 h-10 ${dragActive ? "text-secondary" : "text-primary/60"}`} 
        />
        <div>
          <p className="font-medium text-sm">
            Click or drag and drop your images here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You can upload up to {maxImages} images (PNG, JPG, WEBP)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          multiple
          className="hidden"
          disabled={images.length >= maxImages}
        />
      </div>

      {/* Preview images - display in a grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          <AnimatePresence>
            {previews.map((preview, index) => (
              <motion.div
                key={`${preview}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square group"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-primary/10"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6 opacity-80 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/70 text-white text-[10px] font-medium p-1 text-center rounded-b-lg">
                    Cover Image
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {previews.length === 0 && (
        <div className="text-center p-6 bg-muted rounded-lg border border-border">
          <Image className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}

      {/* Image counter */}
      {images.length > 0 && (
        <div className="text-xs text-right text-muted-foreground">
          {images.length} of {maxImages} images
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
