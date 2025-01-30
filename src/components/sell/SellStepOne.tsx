import { useState } from "react";
import { Button } from "../ui/button";
import { categories } from "@/types/categories";
import { Upload, X } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import Header from "../Header";

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

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Post Your Ad</h2>
              <p className="text-muted-foreground">Choose a category that best fits your item</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "h-auto py-3 flex-col gap-2 relative transition-all text-sm break-words",
                      selectedCategory === category.id 
                        ? "bg-primary text-white shadow-md" 
                        : "hover:border-primary hover:bg-primary/5"
                    )}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory("");
                    }}
                  >
                    <span className="font-medium text-center px-2 line-clamp-2">
                      {category.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div className="space-y-4 animate-fade-up">
                <h3 className="text-lg font-semibold text-foreground">Select Subcategory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            : "hover:border-primary hover:bg-primary/5"
                        )}
                        onClick={() => setSelectedSubcategory(sub.id)}
                      >
                        <span className="line-clamp-1">{sub.name}</span>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Upload Images</h3>
              <p className="text-sm text-muted-foreground">Add up to 12 photos. First photo will be the cover image.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(12)].map((_, index) => {
                const preview = previewUrls[index];
                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square border-2 border-dashed rounded-lg relative overflow-hidden group transition-colors",
                      preview ? "border-solid border-primary/20" : "hover:border-primary/50"
                    )}
                  >
                    {preview ? (
                      <>
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
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Upload className="h-6 w-6 text-primary" />
                        <span className="text-xs text-muted-foreground mt-1 text-center px-2">
                          Add Photo
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button 
            onClick={handleNext} 
            className="w-full md:w-auto md:min-w-[200px] md:mx-auto block bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellStepOne;