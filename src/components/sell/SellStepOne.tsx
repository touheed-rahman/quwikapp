
import { useState } from "react";
import { Button } from "../ui/button";
import { categories } from "@/types/categories";
import { Upload, X, Camera, Image, CheckCircle2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import Header from "../Header";
import { motion } from "framer-motion";

interface SellStepOneProps {
  onNext: (data: { category: string; subcategory: string; images: File[] }) => void;
}

const SellStepOne = ({ onNext }: SellStepOneProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 12) {
      toast({
        title: "Maximum 12 images allowed",
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleNext = () => {
    if (!selectedCategory || !selectedSubcategory) {
      toast({
        title: "Please select a category and subcategory",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    onNext({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      images,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-primary/10 shadow-sm">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 pt-4 pb-20">
        <motion.div 
          className="max-w-3xl mx-auto space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-md p-4 md:p-6 space-y-5"
            variants={item}
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Post Your Ad</h2>
              <p className="text-black font-medium">Choose a category that best fits your item</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "h-auto py-3 px-2 flex-col gap-2 relative transition-all text-sm break-words",
                      selectedCategory === category.id 
                        ? "bg-primary text-white shadow-md scale-105" 
                        : "hover:border-primary hover:bg-primary/5 text-black" // Ensure text is black
                    )}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory("");
                    }}
                  >
                    <span className="font-medium text-center px-2 line-clamp-2">
                      {category.name}
                    </span>
                    {selectedCategory === category.id && (
                      <motion.div 
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-white bg-green-500 rounded-full" />
                      </motion.div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-foreground">Select Subcategory</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories
                    .find((c) => c.id === selectedCategory)
                    ?.subcategories.map((sub) => (
                      <Button
                        key={sub.id}
                        variant={selectedSubcategory === sub.id ? "default" : "outline"}
                        className={cn(
                          "h-auto py-2 justify-start px-4 text-sm break-words",
                          selectedSubcategory === sub.id 
                            ? "bg-primary text-white shadow-md" 
                            : "hover:border-primary hover:bg-primary/5 text-black" // Ensure text is black
                        )}
                        onClick={() => setSelectedSubcategory(sub.id)}
                      >
                        <span className="line-clamp-1">{sub.name}</span>
                        {selectedSubcategory === sub.id && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </Button>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-md p-4 md:p-6 space-y-4"
            variants={item}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Upload Images
              </h3>
              <p className="text-black font-medium">Add up to 12 photos to showcase your item.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-1">
                <div className="aspect-square border-2 border-dashed rounded-lg relative overflow-hidden hover:border-primary hover:bg-primary/5 transition-colors">
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Image className="h-8 w-8 text-primary mb-2" />
                    <span className="text-xs text-primary font-medium text-center px-2">
                      Add Photos
                    </span>
                  </label>
                </div>
              </div>
              
              {previewUrls.map((preview, index) => (
                <motion.div 
                  key={index} 
                  className="col-span-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="aspect-square border-2 border-solid border-primary/20 rounded-lg relative overflow-hidden group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button 
              onClick={handleNext} 
              className="w-full md:w-auto md:min-w-[200px] md:mx-auto block bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellStepOne;
