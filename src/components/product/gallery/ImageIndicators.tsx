
interface ImageIndicatorsProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageIndicators = ({ images, currentImageIndex, setCurrentImageIndex }: ImageIndicatorsProps) => {
  if (images.length <= 1) return null;
  
  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
      {images.map((_, index) => (
        <button
          key={index}
          className={`w-2.5 h-2.5 rounded-full ${
            currentImageIndex === index ? "bg-primary" : "bg-gray-300"
          }`}
          onClick={() => setCurrentImageIndex(index)}
        />
      ))}
    </div>
  );
};

export default ImageIndicators;
