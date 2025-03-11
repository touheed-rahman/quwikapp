
import { motion } from "framer-motion";

interface ImageThumbnailsProps {
  thumbnails: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageThumbnails = ({ thumbnails, currentImageIndex, setCurrentImageIndex }: ImageThumbnailsProps) => {
  if (!thumbnails.length) return null;
  
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
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
          <div className="w-16 h-16 md:w-20 md:h-20">
            <img
              src={thumb}
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
  );
};

export default ImageThumbnails;
